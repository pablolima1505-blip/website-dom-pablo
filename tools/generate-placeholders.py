"""
Gera as imagens PROVISÓRIAS do site (texturas e luz em estilo fotográfico).
Elas existem só até o ensaio fotográfico oficial da Dom Pablo.
Uso: python3 tools/generate-placeholders.py public/images
"""
import sys, math
import numpy as np
from PIL import Image, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/images"
rng = np.random.default_rng(7)

def noise(w, h, scale, octaves=5, seed=0):
    r = np.random.default_rng(seed)
    acc = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        sw, sh = max(2, int(w / scale * 2**o)), max(2, int(h / scale * 2**o))
        base = r.random((sh, sw)).astype(np.float32)
        img = Image.fromarray((base * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(img, np.float32) / 255.0)
        tot += amp; amp *= 0.5
    return acc / tot

def grid(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x / w, y / h

def tone(img, warm=(1.0, 0.78, 0.48)):
    return img[..., None] * np.array(warm, np.float32)[None, None, :]

def finish(rgb, name, grain=0.035, vignette=0.55, blur=0):
    h, w, _ = rgb.shape
    x, y = grid(w, h)
    d = np.sqrt((x - .5) ** 2 * 1.2 + (y - .5) ** 2)
    rgb = rgb * (1 - vignette * np.clip(d * 1.5, 0, 1) ** 2)[..., None]
    rgb = rgb + rng.normal(0, grain, (h, w, 1)).astype(np.float32)
    rgb = np.clip(rgb, 0, 1) ** (1 / 1.05)
    im = Image.fromarray((rgb * 255).astype(np.uint8))
    if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
    im.save(f"{OUT}/{name}.jpg", quality=82, optimize=True, progressive=True)
    print("ok", name, im.size)

def bokeh(w, h, n, seed, rmin, rmax, ymin=0, ymax=1, color=(1, .74, .42), strength=.6):
    r = np.random.default_rng(seed)
    layer = np.zeros((h, w, 3), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    for _ in range(n):
        cx, cy = r.random() * w, (ymin + r.random() * (ymax - ymin)) * h
        rad = rmin + r.random() * (rmax - rmin)
        x0, x1 = int(max(0, cx - rad - 4)), int(min(w, cx + rad + 4))
        y0, y1 = int(max(0, cy - rad - 4)), int(min(h, cy + rad + 4))
        if x1 <= x0 or y1 <= y0: continue
        d = np.sqrt((xx[y0:y1, x0:x1] - cx) ** 2 + (yy[y0:y1, x0:x1] - cy) ** 2) / rad
        disc = np.clip((1 - d) * 6, 0, 1) * (0.55 + 0.45 * np.clip(d, 0, 1) ** 3)
        c = np.array(color) * (0.7 + 0.6 * r.random())
        layer[y0:y1, x0:x1] += disc[..., None] * c * strength * (0.35 + r.random() * .65)
    return layer

def slats(w, h, n_slats, seed, light_x=.5, light_w=.35, warmth=(1, .72, .42)):
    """Parede ripada em madeira com luz rasante vinda de cima."""
    x, y = grid(w, h)
    period = 1.0 / n_slats
    ph = (x % period) / period
    groove = np.clip(np.abs(ph - .5) * 2, 0, 1)
    shade = 0.55 + 0.45 * np.cos((ph - .35) * math.pi) ** 2
    shade *= np.where(groove > .9, 0.15, 1.0)
    grain = noise(w, h, 40, 4, seed)
    streak = noise(max(8, w // 3), h, 6, 3, seed + 1)
    streak = np.asarray(Image.fromarray((streak * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    wood = 0.55 + 0.25 * grain + 0.2 * streak
    spot = np.exp(-((x - light_x) / light_w) ** 2) * np.clip(1.15 - y * 1.1, 0, 1) ** 1.6
    return tone(wood * shade * (0.08 + 0.9 * spot), warmth)

def hero():
    w, h = 2400, 1350
    x, y = grid(w, h)
    wall = slats(w, h, 46, 3, light_x=.5, light_w=.55) * 0.8
    for lx in (.18, .5, .82):
        cone = np.exp(-((x - lx) / (0.06 + y * .22)) ** 2) * np.clip(1 - y * 1.05, 0, 1) ** 1.2
        wall += tone(cone * .35, (1, .8, .55))
    floor_mask = np.clip((y - .78) * 9, 0, 1)
    floor = tone(0.05 + 0.08 * noise(w, h, 60, 3, 9), (1, .82, .62))
    refl = np.flipud(wall) * 0.18
    rgb = wall * (1 - floor_mask[..., None]) + (floor + refl) * floor_mask[..., None]
    b = bokeh(w, h, 70, 11, 18, 70, .05, .7, strength=.45)
    b = np.asarray(Image.fromarray((np.clip(b, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), np.float32) / 255
    rgb = rgb + b * 0.7
    finish(rgb, "hero", vignette=.75)

def leather(name, w, h, seed, light=(-.6, -.8)):
    hgt = noise(w, h, 9, 5, seed) * 0.6 + noise(w, h, 3, 3, seed + 3) * 0.4
    hgt = np.abs(hgt - .5) * 2
    gy, gx = np.gradient(hgt)
    lx, ly = light
    lam = np.clip(0.6 + (gx * lx + gy * ly) * 140, 0, 1.4)
    x, y = grid(w, h)
    key = np.exp(-(((x - .25) / .55) ** 2 + ((y - .2) / .7) ** 2))
    base = 0.42 + 0.12 * noise(w, h, 2, 2, seed + 5)
    rgb = tone(base * lam * (0.12 + key * 1.5), (.7, .44, .24))
    seam = np.exp(-((x - .78 - 0.02 * np.sin(y * 9)) / .004) ** 2) * ((y * 60) % 1 < .55)
    rgb += tone(seam * .25 * key, (1, .78, .45))
    finish(rgb, name, vignette=.6)

def marble(name, w, h, seed):
    x, y = grid(w, h)
    n = noise(w, h, 4, 6, seed)
    v = np.abs(np.sin((x * 3 + y * 5 + n * 5) * math.pi))
    veins = (1 - np.clip(v * 5, 0, 1)) * (0.6 + 0.4 * noise(w, h, 2, 3, seed + 7))
    base = 0.11 + 0.05 * noise(w, h, 3, 4, seed + 1)
    key = np.exp(-(((x - .5) / .5) ** 2 + ((y - .1) / .5) ** 2))
    stone = tone(base + veins * .5, (.95, .9, .82)) * (0.3 + key * 1.3)[..., None]
    edge = np.clip((y - .62) * 400, 0, 1)
    front = tone(0.035 + 0.02 * noise(w, h, 8, 3, seed + 4), (1, .9, .78))
    lip = np.exp(-((y - .62) / .004) ** 2) * key
    rgb = stone * (1 - edge[..., None]) + front * edge[..., None] + tone(lip * .7, (1, .8, .5))
    finish(rgb, name, vignette=.55)

def architecture(name, w, h, seed):
    """Concreto escuro com perfis de LED lineares, como no forro de uma recepção."""
    x, y = grid(w, h)
    conc = 0.07 + 0.05 * noise(w, h, 5, 6, seed)
    persp = np.clip(1 - y, 0, 1)
    rgb = tone(conc * (0.4 + persp * .8), (.95, .9, .85))
    for i, off in enumerate((.08, .2, .34)):
        top, bot = off, 1 - off * 1.4
        left, right = off * 1.1, 1 - off * 1.1
        line = (np.exp(-((y - top) / .0025) ** 2) * ((x > left) & (x < right))
                + np.exp(-((x - left) / .0018) ** 2) * ((y > top) & (y < bot))
                + np.exp(-((x - right) / .0018) ** 2) * ((y > top) & (y < bot)))
        glow = np.asarray(Image.fromarray((np.clip(line, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)), np.float32) / 255
        k = 1 - i * .28
        rgb += tone(line * .9 * k + glow * .9 * k, (1, .93, .8))
    finish(rgb, name, vignette=.5)

def brushed(name, w, h, seed):
    x, y = grid(w, h)
    lines = noise(w, h, 1, 1, seed)
    streak = np.random.default_rng(seed).random((h, 1)).astype(np.float32)
    streak = np.asarray(Image.fromarray((np.repeat(streak, 8, 1) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    sheen = np.exp(-((y - .45 - (x - .5) * .3) / .16) ** 2)
    metal = 0.12 + 0.18 * streak * 0.4 + sheen * (0.55 + streak * .35)
    rgb = tone(metal, (1, .8, .5))
    # cabo de navalha / lâmina: faixa escura diagonal
    band = np.clip(1 - np.abs((y - .78 + (x - .5) * .25) / .07), 0, 1) ** .5
    rgb = rgb * (1 - band[..., None] * .85)
    finish(rgb, name, vignette=.65, grain=.03)

def experience(name, w, h, seed):
    x, y = grid(w, h)
    base = tone(0.03 + 0.05 * np.exp(-((x - .3) / .4) ** 2), (1, .8, .6))
    b1 = bokeh(w, h, 40, seed, 40, 140, 0, 1, strength=.5)
    b2 = bokeh(w, h, 90, seed + 1, 8, 30, 0, 1, strength=.35)
    b = np.asarray(Image.fromarray((np.clip(b1, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)), np.float32) / 255
    rgb = base + b + b2 * .6
    finish(rgb, name, vignette=.6)

def chairs(name, w, h, seed):
    """Espelho em arco retroiluminado sobre parede ripada (estação de atendimento)."""
    x, y = grid(w, h)
    rgb = slats(w, h, 40, seed, light_x=.5, light_w=.5) * .35
    ax, aw, top, bot = .5, .16 * h / w * 1.0, .14, .86
    aw = .2
    r = aw
    arch = ((np.abs(x - ax) < aw) & (y > top + r * w / h) & (y < bot)) | ((((x - ax) * w) ** 2 + ((y - (top + r * w / h)) * h) ** 2) < (r * w) ** 2)
    arch = arch & (y < bot)
    a = arch.astype(np.float32)
    halo = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(45)), np.float32) / 255
    rim = a - np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7)), np.float32) / 255
    rgb = rgb * (1 - a[..., None]) + tone(a * (0.05 + 0.06 * noise(w, h, 3, 3, seed + 2)), (1, .9, .8))
    rgb += tone(halo * (1 - a) * 1.1 + rim * .5, (1, .8, .5))
    # encosto da cadeira em silhueta diante do espelho
    chair = ((np.abs(x - ax) < .09) & (y > .52) & (y < .95)).astype(np.float32)
    chair = np.maximum(chair, ((((x - ax) / .09) ** 2 + ((y - .52) / .06) ** 2) < 1).astype(np.float32))
    chair = np.asarray(Image.fromarray((chair * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), np.float32) / 255
    rgb = rgb * (1 - chair[..., None] * .95)
    finish(rgb, name, vignette=.55)

if __name__ == "__main__":
    hero()
    leather("manifesto", 1200, 1500, 21)
    slats_img = slats(1600, 1100, 30, 31, light_x=.35, light_w=.4)
    finish(slats_img, "estrutura-ambiente", vignette=.5)
    chairs("estrutura-cadeiras", 1600, 1100, 41)
    marble("estrutura-recepcao", 1200, 1500, 51)
    architecture("estrutura-arquitetura", 1600, 1100, 61)
    brushed("estrutura-detalhes", 1200, 1500, 71)
    experience("estrutura-experiencia", 1600, 1100, 81)
    leather("clube", 1600, 1000, 91, light=(.7, -.6))
    experience("og", 1200, 630, 101)
