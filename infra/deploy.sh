#!/usr/bin/env bash
# Manual deploy: build the site, sync to S3, invalidate CloudFront. Mirrors
# .github/workflows/deploy.yml — use as a fallback or for the first deploy
# before CI variables are wired up. Run from the repository root.
set -euo pipefail

: "${VITE_CONTACT_ENDPOINT:?set to the contact_function_url output}"
: "${VITE_TURNSTILE_SITE_KEY:?set to your Cloudflare Turnstile site key}"
: "${SITE_BUCKET:?set to the site_bucket output}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?set to the cloudfront_distribution_id output}"

npm ci
npm run build
aws s3 sync out/ "s3://${SITE_BUCKET}" --delete
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"

echo "Deployed: synced out/ to s3://${SITE_BUCKET} and invalidated the CDN."
