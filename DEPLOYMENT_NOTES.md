# Deployment notes

## What was added
- GitHub Actions CI on pull request to `main`/`master`.
- GitHub Actions CD on push to `main`/`master` using SSH.
- `nginx.conf` with HTTPS redirect and rate limiting for `/threads`.
- Optional comment-like endpoint: `PUT /threads/:threadId/comments/:commentId/likes`.

## Secrets needed for CD
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `APP_DIRECTORY`

## Important follow-up
- Replace SSL certificate paths and server name in `nginx.conf`.
- Adjust `git pull origin main` if your default branch is `master`.
- Make sure your deployed server exposes the API through HTTPS.
