#!/usr/bin/env bash
# Upload photo renditions from scripts/photo.sh to R2, under photography/.
#
#   scripts/upload-photos.sh                 # everything in photos/
#   scripts/upload-photos.sh photos/foo-*.webp
#
# Needs a one-off `npx wrangler login`, or CLOUDFLARE_API_TOKEN and
# CLOUDFLARE_ACCOUNT_ID in .env. R2_BUCKET overrides the default bucket.
#
# Files are cached as immutable, so give a re-edited photo a new slug rather
# than re-uploading over the old name.
set -euo pipefail

if [ -f .env ]; then
	set -a
	. ./.env
	set +a
fi
bucket=${R2_BUCKET:-portfolio-photos}

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
	files=(photos/*.webp)
fi

for f in "${files[@]}"; do
	npx --yes wrangler@4 r2 object put "$bucket/photography/$(basename "$f")" \
		--file "$f" \
		--content-type image/webp \
		--cache-control "public, max-age=31536000, immutable" \
		--remote
done
