output "cloudfront_domain" {
  description = "CloudFront domain — create a DNS-only CNAME at the apex pointing here."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — GitHub Actions variable CLOUDFRONT_DISTRIBUTION_ID."
  value       = aws_cloudfront_distribution.site.id
}

output "site_bucket" {
  description = "S3 site bucket name — GitHub Actions variable SITE_BUCKET."
  value       = aws_s3_bucket.site.bucket
}

output "contact_function_url" {
  description = "Lambda Function URL — GitHub Actions variable VITE_CONTACT_ENDPOINT."
  value       = aws_lambda_function_url.contact.function_url
}

output "ci_role_arn" {
  description = "CI OIDC role ARN — GitHub Actions variable AWS_CI_ROLE_ARN."
  value       = aws_iam_role.ci.arn
}
