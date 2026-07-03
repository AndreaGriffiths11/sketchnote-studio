# Work Life Sketchnote Studio

Turn a GitHub profile into a cute, photorealistic whiteboard sketchnote of your work life.
It runs entirely in your browser as a static site. You bring your own image-model API key.

**Live:** https://andreagriffiths11.github.io/sketchnote-studio/

## How it works

1. Type a GitHub handle. The app reads the public profile, top languages, repos, and avatar to fill in a first draft.
2. Edit anything in the left panel: profile, clusters, values, journey, themes, and visual style.
3. Add your own image API key in Settings and click Generate. The image is drawn client-side and you can download it.

No key handy? Use the Copy button to grab the full prompt and paste it into any image tool.

## Bring your own key

Your API key stays in memory in the browser tab and goes straight to the provider you choose.
It is never written to disk and never reaches this site's author or any server. There is no backend here.
A reload clears the key, so you re-enter it each session. That is the safe default for a public tool.

Because this is a static page, the usual bring-your-own-key tradeoffs apply: the key lives on your device for the session, and your spend is your own. This repo ships with zero third-party scripts to keep that surface small.

## Providers

Pick a provider in Settings. Two modes ship.

### OpenAI (default)

- `gpt-image-1` (default): best quality and can use your avatar as a reference. Needs a verified OpenAI organization.
- `dall-e-3`: no organization verification, but it ignores the avatar and uses different sizes.

Change the Base URL to point at any OpenAI-compatible endpoint (OpenRouter, a local proxy). The app calls `POST {baseUrl}/images/generations` and, when a reference image is set, `POST {baseUrl}/images/edits`, then decodes `data[0].b64_json`.

### Azure AI Foundry

Use a `gpt-image` model you deployed in Azure AI Foundry (or Azure OpenAI). Switch the provider to Azure and fill in:

- **Endpoint**: your resource URL, like `https://your-resource.cognitiveservices.azure.com`.
- **Deployment name**: the name you gave the deployment, like `gpt-image-2`. This goes in the request as the `model`.
- **Key**: a resource key for that endpoint, entered the same way as any other key and kept in memory only.

The app calls `POST {endpoint}/openai/v1/images/{generations|edits}?api-version=preview` with an `api-key` header and your deployment name as `model` in the body. That `preview` version is the version-proof surface Azure recommends, so there is no dated API version to keep up with. Your avatar works as a reference with gpt-image deployments.

If Generate reports that it could not reach the provider, the key or endpoint was most likely wrong. Browsers hide the provider's error details on cross-origin failures, so the message stays generic.

## Run locally

It is plain HTML, CSS, and one JavaScript module. Serve the folder over HTTP so the module and the GitHub API calls work:

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Make it your own

Fork this repo, then turn on GitHub Pages under Settings, Pages, deploy from branch `main`, folder `/ (root)`. Your copy publishes at `https://<you>.github.io/sketchnote-studio/`. Edit `prompt.js` to change the prompt and `index.html` for the UI.

## License

MIT. See [LICENSE](LICENSE).
