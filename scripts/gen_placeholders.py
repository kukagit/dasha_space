"""Generate 32x32 placeholder PNG sprites and a simple background/card.

Run from repo root:  python3 scripts/gen_placeholders.py
The resulting PNGs are committed so the game works out of the box.
Replace them with your own art (same filenames) when ready.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
OUT.mkdir(parents=True, exist_ok=True)


def make_npc(filename: str, body_color, eye_color=(20, 20, 20), label: str | None = None):
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # body (rounded-ish rectangle)
    d.rectangle((10, 10, 22, 28), fill=body_color)
    d.rectangle((11, 8, 21, 11), fill=body_color)  # head top
    # head
    d.ellipse((9, 4, 23, 16), fill=body_color)
    # eyes
    d.rectangle((12, 9, 13, 11), fill=eye_color)
    d.rectangle((19, 9, 20, 11), fill=eye_color)
    # feet
    d.rectangle((11, 28, 14, 30), fill=(40, 40, 40))
    d.rectangle((18, 28, 21, 30), fill=(40, 40, 40))
    if label:
        # tiny label dot for differentiation
        d.text((13, 18), label, fill=(255, 255, 255))
    img.save(OUT / filename)


def make_player():
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # body
    d.rectangle((11, 14, 21, 27), fill=(40, 40, 40))
    # head
    d.ellipse((9, 3, 23, 17), fill=(255, 220, 190))
    # hair
    d.rectangle((9, 3, 23, 8), fill=(60, 35, 20))
    d.ellipse((9, 2, 23, 10), fill=(60, 35, 20))
    # eyes
    d.rectangle((12, 10, 13, 12), fill=(0, 0, 0))
    d.rectangle((19, 10, 20, 12), fill=(0, 0, 0))
    # feet
    d.rectangle((11, 27, 15, 30), fill=(20, 20, 20))
    d.rectangle((17, 27, 21, 30), fill=(20, 20, 20))
    img.save(OUT / "player.png")


def make_altar():
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # diamond
    d.polygon([(16, 2), (30, 16), (16, 30), (2, 16)], fill=(0, 0, 0))
    d.polygon([(16, 6), (26, 16), (16, 26), (6, 16)], fill=(255, 255, 255))
    d.text((13, 11), "?", fill=(0, 0, 0))
    img.save(OUT / "altar.png")


def make_background():
    # Just a pure-white 800x600 with a faint vignette to look less flat
    img = Image.new("RGB", (800, 600), (255, 255, 255))
    d = ImageDraw.Draw(img)
    # subtle dotted border to feel like Omori "white space"
    for x in range(0, 800, 40):
        d.point((x, 4), fill=(220, 220, 220))
        d.point((x, 596), fill=(220, 220, 220))
    for y in range(0, 600, 40):
        d.point((4, y), fill=(220, 220, 220))
        d.point((796, y), fill=(220, 220, 220))
    img.save(OUT / "background.png")


def make_card():
    img = Image.new("RGB", (320, 320), (255, 240, 245))
    d = ImageDraw.Draw(img)
    d.rectangle((8, 8, 311, 311), outline=(255, 100, 130), width=4)
    d.text((40, 80), "HAPPY", fill=(255, 90, 120))
    d.text((40, 120), "BIRTHDAY", fill=(255, 90, 120))
    d.text((40, 180), "DASHA!", fill=(255, 90, 120))
    img.save(OUT / "card.png")


if __name__ == "__main__":
    make_player()
    make_npc("npc1.png", (220, 80, 80), label="1")
    make_npc("npc2.png", (80, 130, 220), label="2")
    make_npc("npc3.png", (90, 180, 90), label="3")
    make_npc("npc4.png", (220, 180, 70), label="4")
    make_altar()
    make_background()
    make_card()
    print("Placeholders generated in", OUT)
