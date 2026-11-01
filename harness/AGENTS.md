# ARCADE Repository Harness

This document records the project context and the user's established workflow for future coding sessions.

## Project

- Repository: `https://github.com/julie9578/VisionAI`
- Local checkout: `C:\Users\user\Documents\VisionAI`
- Primary branch: `main`
- The project is a Korean-language static game catalog built with plain HTML, CSS, and browser JavaScript.
- Core pages/assets: `index.html`, `styles.css`, `script.js`, `game.html`, `game.css`, `board.html`, `board.css`, `board.js`, `signup.html`, `login.html`, `auth.css`, `auth.js`.
- Game metadata is held in the `games` array in `script.js`; keep IDs unique and preserve the existing card/detail-page data shape.
- The catalog currently has 24 games, genre tags, and a `source: 'steam'` marker for Steam-chart additions. The Steam filter uses that source marker, separate from genre tags.

## Hosting and data services

- GitHub Pages publishes the repository root from `main` at `https://julie9578.github.io/VisionAI/`.
- The existing homepage also has a separate Cloudflare Workers address: `https://arcade.nextarcade.workers.dev/`. Do not assume a GitHub push deploys or updates that Worker.
- The board/auth API Worker is `arcade-board-api` at `https://arcade-board-api.nextarcade.workers.dev/`.
- Cloudflare D1 database name: `arcade-board`; Wrangler binding: `DB`.
- Wrangler config: `wrangler.jsonc`; D1 SQL migrations: `migrations/`; Worker entry point: `src/worker.js`.
- Board posts use `posts`; user accounts use `users`. The user table stores password hashes/salts, and the address is encrypted by the Worker. Never store plaintext passwords or address encryption keys in the repository.
- Required Cloudflare secrets are `SESSION_SECRET` and `ADDRESS_ENCRYPTION_KEY`. Manage them only with Wrangler secrets / Cloudflare dashboard; never print, commit, or include their values in logs or documentation.
- `data/arcade-board.sqlite` is a local SQLite sample/import file and is ignored by Git (`*.sqlite`). Do not assume local SQLite changes automatically update D1.
- Cloudflare deployment requires Wrangler, a logged-in Cloudflare account, a valid `database_id` in `wrangler.jsonc`, and the configured secrets. Verify deployment status separately from GitHub Pages.

## User's preferred workflow

- The user expects requested code changes to be implemented proactively, validated, committed, and pushed to the remote repository.
- Before edits, inspect the current branch, working tree, repository conventions, relevant files, and available deployment/test tools.
- Preserve unrelated user changes. If the working tree contains pre-existing modifications, avoid staging or committing them unless they are explicitly part of the requested task.
- State clearly which branch was changed and pushed. Do not claim a feature is live until the actual target has been deployed and verified.
- The user often asks to work on named branches such as `레이아웃` and `프로필`. Use the branch they request; do not silently merge to `main` unless asked.
- When asked to merge to `main`, resolve conflicts by preserving both sides' functionality (for example, static layout changes plus profile/auth functionality), then test and push `main`.
- Do not claim the Cloudflare Worker was updated merely because GitHub Pages built successfully. These are separate deployment targets.

## Verification expectations

- Run `git diff --check` before commit.
- For static pages, verify page links, asset paths, form fields, unique game IDs, filter counts, and responsive/accessible markup.
- Use `node --check` when Node.js is available; if unavailable, say so and run other meaningful checks.
- Test browser interactions where possible: game-card/detail navigation, Steam filter, profile dialog, roulette result/link, board API list/create, signup/login endpoints.
- For D1 changes, validate migrations against SQLite locally when possible, then verify the remote D1 schema/data through Wrangler after deployment.
- Verify `main` / remote status after pushing and check the actual deployment URL/build state for the hosting target the user requested.

## Important implementation constraints

- The public catalog itself is static; persistent data must go through the Worker API and D1.
- The board API allows only configured origins. Keep `ALLOWED_ORIGINS` aligned with the deployed frontend origin.
- The current signup/login frontend is static and calls the separate Worker API. It requires CORS to allow the GitHub Pages origin.
- User-entered address is highly sensitive. Collect it only because explicitly requested, encrypt it at rest in the Worker, never return it from `/api/auth/me`, and recommend reviewing privacy/legal obligations before operating the site publicly.
- Never create an account using a real personal identity during tests. Use a synthetic `.invalid` email and remove the test row after integration tests.

## Known follow-ups / cautions

- Confirm the current deployment status and public contents before describing signup/login as live.
- The repository has had duplicate users-table migration files (`0003_create_users.sql` and `0004_create_users.sql`) applied with `IF NOT EXISTS`; review the migration history before trying to rewrite or delete an already-applied migration.
- `README.md` may lag behind current deployment state. Update deployment instructions only after checking actual GitHub Pages and Worker status.