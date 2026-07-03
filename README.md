# KeyVault Chat

KeyVault Chat is a local-first, bring-your-own-key AI chat workspace. Users add their own provider API keys on their own machine, choose a model, and chat through a simple installable web app.

The project does not include API keys, proxy keys, hosted credentials, or maintainer-owned secrets.

## Features

- Bring your own API keys
- Multiple providers and custom provider support
- API key rotation and usage tracking
- Local conversation history
- Installable PWA
- Safe config export without raw API key values
- Dark and light themes

## Supported Provider Types

- Google Gemini
- Groq
- Mistral
- DeepSeek
- Anthropic
- OpenAI-compatible providers
- Custom base URLs and model names

## Security Model

This is a local-first BYOK app. Keys are entered by the user and stored on the user's own device.

Important:

- Do not commit exported configs or backups.
- Do not use this on shared or untrusted computers.
- Browser local storage is convenient, not a hardware vault.
- For production or team usage, put provider calls behind a backend that stores secrets server-side.

## Running Locally

Open `index.html` in a browser, or serve the folder with any static file server.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Roadmap

- Encrypted backup/export flow
- Safer DOM rendering throughout
- Better provider validation
- Optional backend proxy mode
- Real image/video generation routing
- Automated tests

## License

MIT
