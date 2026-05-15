# --- SNS topic: contact-form submissions delivered by email ---

resource "aws_sns_topic" "contact" {
  name = "berkepro-contact"
}

resource "aws_sns_topic_subscription" "contact_email" {
  topic_arn = aws_sns_topic.contact.arn
  protocol  = "email"
  endpoint  = var.notification_email
}

# --- Turnstile secret key (SecureString) ---
# Terraform owns the parameter's existence; the real value is injected
# out-of-band (aws ssm put-parameter --overwrite) so it never enters state.

resource "aws_ssm_parameter" "turnstile_secret" {
  name        = "/berkepro/turnstile-secret-key"
  description = "Cloudflare Turnstile secret key — set out-of-band, not via Terraform."
  type        = "SecureString"
  value       = "PLACEHOLDER_SET_OUT_OF_BAND"

  lifecycle {
    ignore_changes = [value]
  }
}

# AWS-managed key behind SecureString params. depends_on forces this read to
# happen after the parameter exists, guaranteeing the alias is present.
data "aws_kms_alias" "ssm" {
  name       = "alias/aws/ssm"
  depends_on = [aws_ssm_parameter.turnstile_secret]
}

# --- Lambda execution role ---

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "berkepro-contact-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "lambda_inline" {
  statement {
    sid       = "PublishContactTopic"
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.contact.arn]
  }

  statement {
    sid       = "ReadTurnstileSecret"
    actions   = ["ssm:GetParameter"]
    resources = [aws_ssm_parameter.turnstile_secret.arn]
  }

  statement {
    sid       = "DecryptTurnstileSecret"
    actions   = ["kms:Decrypt"]
    resources = [data.aws_kms_alias.ssm.target_key_arn]
  }
}

resource "aws_iam_role_policy" "lambda_inline" {
  name   = "berkepro-contact-lambda-inline"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda_inline.json
}

# --- Lambda log group (explicit, so retention is bounded) ---

resource "aws_cloudwatch_log_group" "contact" {
  name              = "/aws/lambda/berkepro-contact"
  retention_in_days = 14
}

# --- Lambda package: zip only the runtime .mjs files, excluding tests ---

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  excludes    = ["validate.test.mjs", "index.test.mjs"]
  output_path = "${path.module}/lambda.zip"
}

# --- Lambda function ---

resource "aws_lambda_function" "contact" {
  function_name = "berkepro-contact"
  description   = "berke.pro contact-form handler — validates and publishes to SNS."
  role          = aws_iam_role.lambda.arn

  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  handler       = "index.handler"
  runtime       = "nodejs22.x"
  architectures = ["arm64"]
  memory_size   = 128
  timeout       = 10

  environment {
    variables = {
      SNS_TOPIC_ARN          = aws_sns_topic.contact.arn
      TURNSTILE_SECRET_PARAM = aws_ssm_parameter.turnstile_secret.name
    }
  }

  depends_on = [
    aws_iam_role_policy.lambda_inline,
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.contact,
  ]
}

# --- Public Function URL. CORS is scoped to the apex domain; AWS applies the
# CORS headers to every response and answers the browser's OPTIONS preflight. ---

resource "aws_lambda_function_url" "contact" {
  function_name      = aws_lambda_function.contact.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["https://${var.domain_name}"]
    allow_methods = ["POST"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}
