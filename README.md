# Tim's little corner

A lightweight personal homepage built with plain HTML, CSS, and JavaScript. It is ready to deploy as a static site on Cloudflare Pages.

The Tiny Image Lab uses Google's Nano Banana 2 model (`gemini-3.1-flash-image`) through a Cloudflare Pages Function. The Google API key stays server-side.

## Preview locally

Open `index.html` in a browser, or serve this folder with any static file server.

## Deploy with Cloudflare Pages

Import this GitHub repository in Cloudflare Pages and use these build settings:

- Framework preset: **None**
- Build command: *(leave blank)*
- Build output directory: `/` (the repository root)

Cloudflare will publish the static files directly. There is no build step or framework dependency.

To enable image generation, create a Gemini API key in Google AI Studio, then add it to the Pages project as an encrypted environment variable named `GEMINI_API_KEY` (available to Production and Preview). The `functions/api/generate-image.js` Pages Function uses that secret; redeploy after adding it. Without the secret, the rest of the site still works and the image lab displays a setup message.

## Personalize

Update the intro and about text in `index.html`.
