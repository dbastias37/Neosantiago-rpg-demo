#!/usr/bin/env python3
"""Convierte un retrato aprobado a WebP sin recortar ni ampliar (requiere Pillow)."""
import argparse
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


def encode(source):
    with Image.open(source) as original:
        if getattr(original, "n_frames", 1) != 1:
            raise ValueError("Se requiere un retrato estático; no se descartan animaciones.")
        picture = ImageOps.exif_transpose(original).convert("RGBA")
        picture.thumbnail((768, 1024), Image.Resampling.LANCZOS)
        if picture.getextrema()[3] == (255, 255):
            picture = picture.convert("RGB")
        for quality in (84, 80, 76, 72):
            buffer = BytesIO()
            picture.save(buffer, format="WEBP", quality=quality, method=6)
            payload = buffer.getvalue()
            if len(payload) <= 180 * 1024:
                return payload, picture.size, quality
    raise ValueError("Supera 180 KiB. Revisar visualmente antes de reducir más calidad o resolución.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    if args.destination.suffix.lower() != ".webp":
        parser.error("El destino debe terminar en .webp")
    if args.destination.exists():
        parser.error("El destino ya existe; elegir otro nombre para revisar la nueva conversión.")
    payload, size, quality = encode(args.source)
    args.destination.parent.mkdir(parents=True, exist_ok=True)
    with args.destination.open("xb") as target:
        target.write(payload)
    print(f"{args.destination}: {size[0]}x{size[1]}, {len(payload)} bytes, calidad {quality}")


if __name__ == "__main__":
    main()
