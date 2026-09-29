Hero backgrounds live here as animated WebP, not GIF: a GIF of this kind runs
to ~100 MB, the same animation as WebP is a few MB.

Each background needs two files:
  <name>.webp          the animation (keep it under ~4 MB)
  <name>-poster.webp   its first frame, shown while the animation loads

To add or replace one, convert the source with sharp (it ships with Next.js).
From the project root:

  node -e "const s=require('sharp'); const f='public/background/NAME'; \
    s(f+'.gif',{animated:true,limitInputPixels:false}).resize({width:860}) \
      .webp({quality:35,effort:4,loop:0}).toFile(f+'.webp') \
    .then(()=>s(f+'.gif',{limitInputPixels:false}).resize({width:1280}) \
      .webp({quality:62}).toFile(f+'-poster.webp'))"

Then point the page at it, e.g. background="/background/NAME.webp" (see
components/AnimatedBackground.tsx, which finds the poster by name).
