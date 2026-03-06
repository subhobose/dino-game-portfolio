# Dino Portfolio

Chrome Dino style portfolio game.

## Run locally

```bash
npm start
```

Open `http://localhost:8080`.

## Deploy on GitHub Pages

This repo is configured to deploy automatically from `main` using GitHub Actions.

1. Push this code to GitHub.
2. In GitHub: `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push again (or run `Deploy to GitHub Pages` from the Actions tab).
5. Your site URL will be:
   `https://subhobose.github.io/dino-game-portfolio/`

## Notes

- This app is static (`index.html`, `styles.css`, `game.js`) and does not require Node on GitHub Pages.
- `server.js` is only for local development.

## Analytics (Microsoft Clarity)

1. Create a project at https://clarity.microsoft.com/.
2. Copy your Clarity Project ID.
3. In `index.html`, update:
   `meta name="clarity-project-id" content="REPLACE_WITH_CLARITY_PROJECT_ID"`
4. Commit + push.
