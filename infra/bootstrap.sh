#!/usr/bin/env bash
# One-time bootstrap: creates the S3 bucket that holds Terraform remote state.
# Run this BEFORE the first `terraform init`. The bucket name here MUST match
# the `bucket` value in the backend "s3" block of infra/versions.tf.
set -euo pipefail

STATE_BUCKET="berkepro-tfstate"
REGION="us-east-1"

if aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
  echo "State bucket $STATE_BUCKET already exists — nothing to do."
  exit 0
fi

# us-east-1 must NOT pass a LocationConstraint.
aws s3api create-bucket --bucket "$STATE_BUCKET" --region "$REGION"

aws s3api put-bucket-versioning --bucket "$STATE_BUCKET" \
  --versioning-configuration Status=Enabled

aws s3api put-public-access-block --bucket "$STATE_BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

aws s3api put-bucket-encryption --bucket "$STATE_BUCKET" \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"}}]}'

echo "State bucket $STATE_BUCKET created (versioned, encrypted, private)."
echo "Next: terraform -chdir=infra init"
