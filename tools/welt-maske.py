# Erzeugt eine Effekt-Maske für ein Weltbild: R = Wasser, G = leuchtende Straßen/Adern, B = Himmel
import sys, numpy as np, cv2
from PIL import Image
from scipy import ndimage as nd
src, out, horizon = sys.argv[1], sys.argv[2], int(sys.argv[3]); sunx = int(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4].isdigit() else None; nowater = "--ohne-wasser" in sys.argv
im = np.array(Image.open(src).convert("RGB")).astype(np.int16); H, W, _ = im.shape
r, g, b = im[...,0], im[...,1], im[...,2]
hsv = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(int)
yy = np.arange(H)[:,None].repeat(W,1)
# Wasser: bläulich/violett-dunkel, unter dem Horizont, mit dem Rand verbunden
w = (b > r + 8) & (b >= g - 4) & (yy > horizon) & (hsv[...,2] < 200)
if sunx is not None: w |= (yy > horizon) & (yy < horizon + 260) & (np.abs(np.arange(W)[None,:] - sunx) < 90) & (r > 180) & (b < 140)  # Sonnenspiegelung
w = nd.binary_opening(w, iterations=2); w = nd.binary_closing(w, iterations=4)
lab, n = nd.label(w); keep = set(lab[0][lab[0]>0]) | set(lab[-1][lab[-1]>0]) | set(lab[:,0][lab[:,0]>0]) | set(lab[:,-1][lab[:,-1]>0])
sizes = nd.sum(w, lab, range(1, n+1)); keep |= {i+1 for i,s in enumerate(sizes) if s > 20000}
w = np.isin(lab, list(keep))
if nowater: w[:] = False
# Adern: kräftig rot/pink, gesättigt
hue = hsv[...,0]
v = (r > 165) & (r - g > 70) & (r - b > 40) & (hsv[...,1] > 90) & (yy > horizon) & ((hue < 7) | (hue > 160))
v = nd.binary_opening(v, iterations=1) & ~nd.binary_dilation(w, iterations=6)
lab, n = nd.label(v); sizes = nd.sum(v, lab, range(1, n+1)); v = np.isin(lab, [i+1 for i,s in enumerate(sizes) if s > 60])
s = (yy < horizon).astype(np.uint8)
def soft(m, k): return cv2.GaussianBlur((m*255).astype(np.uint8), (k|1, k|1), 0)
M = np.dstack([soft(w, 7), soft(v, 3), soft(s, 9)])
Image.fromarray(M).resize((W//2, H//2), Image.LANCZOS).save(out, optimize=True)
print("Wasser %.0f%%  Adern %.1f%%" % (w.mean()*100, v.mean()*100))
