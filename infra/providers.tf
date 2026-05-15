# Region is fixed to us-east-1: the ACM certificate already lives there and a
# single-region stack keeps state, IAM, and CloudFront Functions together.
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "berkepro"
      ManagedBy   = "terraform"
      Environment = "prod"
    }
  }
}
