#!/usr/bin/env bash
# Convert a camera original (HEIC, JPEG, etc.) into web-ready WebP renditions.
#
#   scripts/photo.sh ~/Downloads/IMG_1234.HEIC some-slug
#
# Writes lossless photos/<slug>-<width>.webp at 640, 1280,
# 2048 and the photo's full width. Keeps all metadata: the colour profile
# (iPhones shoot Display P3), EXIF, GPS location and camera details.
# Requires macOS (`sips`, `swift`, `python3`) and `cwebp`/`webpmux` (libwebp).
set -euo pipefail

src=$1
slug=$2
out=photos
widths=(640 1280 2048)

mkdir -p "$out"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# Phones store pixels sideways plus an EXIF orientation tag. cwebp ignores the
# tag, so read it and rotate the pixels ourselves.
orientation=$(swift - "$src" 2>/dev/null <<'SWIFT'
import Foundation
import ImageIO
let url = URL(fileURLWithPath: CommandLine.arguments[1]) as CFURL
let source = CGImageSourceCreateWithURL(url, nil)!
let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any]
print(props?["Orientation"] ?? 1)
SWIFT
)
case $orientation in
	3) degrees=180 ;;
	6) degrees=90 ;;
	8) degrees=270 ;;
	*) degrees=0 ;;
esac

sips -s format png "$src" --out "$tmp/full.png" >/dev/null
if [ "$degrees" != 0 ]; then
	sips -r "$degrees" "$tmp/full.png" >/dev/null
fi

# Smaller sizes for the grid, plus the untouched full resolution for viewing.
native=$(sips -g pixelWidth "$tmp/full.png" | awk '/pixelWidth/ {print $2}')
sizes=()
for w in "${widths[@]}"; do
	[ "$w" -lt "$native" ] && sizes+=("$w")
done
sizes+=("$native")

# Resize with macOS's high-quality resampler, then encode losslessly: every
# rendition has exactly the pixels of the decoded original at that size.
for w in "${sizes[@]}"; do
	if [ "$w" = "$native" ]; then
		cp "$tmp/full.png" "$tmp/$w.png"
	else
		sips --resampleWidth "$w" "$tmp/full.png" --out "$tmp/$w.png" >/dev/null
	fi
	cwebp -quiet -lossless -z 6 -metadata all "$tmp/$w.png" -o "$out/$slug-$w.webp" >/dev/null
done

# The pixels are upright now, but the copied EXIF still says to rotate them.
# Set just the Orientation tag to 1 so browsers don't rotate a second time.
if [ "$degrees" != 0 ]; then
	webpmux -get exif "$out/$slug-$native.webp" -o "$tmp/exif.bin" >/dev/null
	python3 - "$tmp/exif.bin" <<'PYTHON'
import struct, sys
path = sys.argv[1]
data = bytearray(open(path, 'rb').read())
base = 6 if data.startswith(b'Exif\0\0') else 0
endian = '<' if data[base:base + 2] == b'II' else '>'
ifd = base + struct.unpack_from(endian + 'I', data, base + 4)[0]
for i in range(struct.unpack_from(endian + 'H', data, ifd)[0]):
	entry = ifd + 2 + i * 12
	if struct.unpack_from(endian + 'H', data, entry)[0] == 0x0112:
		struct.pack_into(endian + 'H', data, entry + 8, 1)
		break
else:
	sys.exit('no Orientation tag found')
open(path, 'wb').write(data)
PYTHON
	for w in "${sizes[@]}"; do
		webpmux -set exif "$tmp/exif.bin" "$out/$slug-$w.webp" -o "$out/$slug-$w.webp" >/dev/null
	done
fi

echo "$out/$slug-{$(IFS=,; echo "${sizes[*]}")}.webp"
