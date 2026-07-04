# AGENTS.md — Bandstand Marketing Site

**Read this before editing anything in this directory.**

## This is the marketing website. It deploys DIFFERENTLY from the app.

- Files here are the source for `bandstand.fm` (a Next.js site).
- Deploys via **git push** to `github.com/bandstandfm/bandstand-web` → Vercel auto-builds.
- **The Emergent "Publish" button does NOT deploy this repo.** Publish only redeploys the Expo app and FastAPI backend at `/app`.

## Required checklist after any edit in `/app/website/**`

```bash
cd /app/website
git status --short                      # Confirm intended files only
git diff HEAD -- <path>                 # Review the diff
git add <paths>
git commit -m "<message>"
git push origin main                    # Triggers Vercel deploy
# Wait ~90 seconds
curl -s https://www.bandstand.fm/<path> | grep <marker>
```

Only after the curl verifies the marker is present may you tell the user "the change is live."

## Common bugs (all caused by skipping the checklist above)

1. Editing `/app/website/**` and clicking Emergent Publish. Publish snapshots `/app`, not `/app/website`. The change never leaves the workspace.
2. Committing but not pushing. Vercel triggers on the GitHub webhook, not on the local commit.
3. Checking `bandstand.fm` without waiting for Vercel to finish (~90s typical). Curl too early → you see the old page and get confused.
4. Checking `bandstand.fm` (apex) instead of `www.bandstand.fm`. The apex 308-redirects; some tools don't follow the redirect and report a false negative.

See `/app/memory/deploy_workflow.md` for the full picture.
