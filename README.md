# berke.pro

My personal portfolio, live at https://berke.pro.

## Deployment

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds my website and syncs it to S3, then invalidates the CloudFront distribution.

Infrastructure is Terraform in `infra/` (S3 + CloudFront for the site, Lambda + SNS for the contact form).
