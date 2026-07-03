# Manual Test Checklist

## Basic App

- Open the app in a clean browser profile.
- Confirm no API keys are preloaded.
- Add one provider key.
- Send a basic prompt.
- Confirm the response appears in chat history.

## Key Rotation

- Add two keys for the same provider.
- Set a low request limit for the first key.
- Send enough prompts to trigger rotation.
- Confirm usage count and rotation log update.

## Safe Export

- Add a test key.
- Export safe config.
- Open the exported JSON.
- Confirm raw key values are not present.

## Import

- Import a safe config.
- Confirm providers, labels, limits, and notes load correctly.
- Confirm missing key values need re-entry before use.

## PWA

- Install the app.
- Refresh while offline.
- Confirm static UI loads.
- Confirm provider API requests are not cached by the service worker.
