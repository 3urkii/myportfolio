variable "acm_certificate_arn" {
  type        = string
  description = "ARN of the existing ACM certificate for the domain (must be in us-east-1)."

  validation {
    condition     = can(regex("^arn:aws:acm:us-east-1:[0-9]{12}:certificate/", var.acm_certificate_arn))
    error_message = "Must be an ACM certificate ARN in us-east-1."
  }
}

variable "github_repo" {
  type        = string
  description = "GitHub repository in owner/repo form — scopes the CI OIDC trust policy."

  validation {
    condition     = can(regex("^[^/ ]+/[^/ ]+$", var.github_repo))
    error_message = "Must be in owner/repo form, e.g. ryan/berkepro-redesign."
  }
}

variable "notification_email" {
  type        = string
  description = "Email address for contact-form submissions (SNS) and budget alerts."

  validation {
    condition     = can(regex("^[^@ ]+@[^@ ]+\\.[^@ ]+$", var.notification_email))
    error_message = "Must be a valid email address."
  }
}

variable "domain_name" {
  type        = string
  description = "Apex domain served by the CloudFront distribution."
  default     = "berke.pro"
}

variable "site_bucket_name" {
  type        = string
  description = "Globally-unique S3 bucket name for the built site."
  default     = "berkepro-site"
}

variable "logs_bucket_name" {
  type        = string
  description = "Globally-unique S3 bucket name for CloudFront access logs."
  default     = "berkepro-logs"
}
