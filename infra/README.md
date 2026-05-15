# berke.pro infrastructure

Terraform for the berke.pro static site (S3 + CloudFront) and contact-form
backend (Lambda + SNS). Region us-east-1.

## Inputs

Copy `terraform.tfvars.example` to `terraform.tfvars` (gitignored) and set:

- `acm_certificate_arn` — the existing us-east-1 ACM cert ARN for berke.pro
- `github_repo` — `owner/repo` slug, scopes the CI OIDC trust policy
- `notification_email` — contact-form + budget-alert recipient

## Phase 1 — bootstrap (local, once)

0. Create a Cloudflare Turnstile widget for `berke.pro`. Note the **site key**
   (public, baked in at build time) and **secret key** (step 4).
1. `./infra/bootstrap.sh` — creates the `berkepro-tfstate` state bucket.
2. `terraform -chdir=infra init` — configures the S3 backend.
3. `terraform -chdir=infra apply` — first apply creates the whole stack,
   including the GitHub OIDC provider and CI role.
4. Inject the Turnstile secret (never stored in Terraform state):
   `aws ssm put-parameter --name /berkepro/turnstile-secret-key --type SecureString --value <SECRET> --overwrite`
5. Confirm the SNS subscription email AWS sends to `notification_email`.
6. In Cloudflare, add a **DNS-only** (grey-cloud) CNAME at `berke.pro` →
   the `cloudfront_domain` output.

## Phase 2 — wire CI (once)

Set these GitHub Actions **repository variables** (Settings → Secrets and
variables → Actions → Variables):

| Variable | Value |
|---|---|
| `VITE_CONTACT_ENDPOINT` | `contact_function_url` output |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `AWS_CI_ROLE_ARN` | `ci_role_arn` output |
| `SITE_BUCKET` | `site_bucket` output |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` output |

Read the outputs with `terraform -chdir=infra output`.

## Phase 3 — deploy (every change)

Push to `main` → `.github/workflows/deploy.yml` builds and deploys.

Manual fallback / first deploy, from the repo root:

```
VITE_CONTACT_ENDPOINT=... VITE_TURNSTILE_SITE_KEY=... \
SITE_BUCKET=... CLOUDFRONT_DISTRIBUTION_ID=... ./infra/deploy.sh
```

## Build/deploy ordering

`VITE_CONTACT_ENDPOINT` is baked in at build time, so the Lambda Function URL
must exist before the site is built. It is created on the first
`terraform apply` (Phase 1) and is stable for the life of the function —
Phase 3 always builds against an existing endpoint.
