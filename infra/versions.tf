terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # Remote state. The bucket is created by bootstrap.sh BEFORE the first
  # `terraform init` — its name must match STATE_BUCKET in bootstrap.sh.
  # Backend blocks cannot use variables, so this value is intentionally literal.
  backend "s3" {
    bucket       = "berkepro-tfstate"
    key          = "berkepro/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
