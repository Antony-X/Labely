from PIL import Image
import uuid

def split_grid(path):
    img = Image.open(path)
    w, h = img.size
    tile_w, tile_h = w // 4, h // 4

    for row in range(4):
        for col in range(4):
            left = col * tile_w
            upper = row * tile_h
            right = left + tile_w
            lower = upper + tile_h

            tile = img.crop((left, upper, right, lower))
            filename = f"{uuid.uuid4().hex}.png"
            tile.save(filename)
            print(f"Saved {filename}")

split_grid("image.png")
