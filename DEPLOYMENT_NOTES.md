# Deployment notes

## What was added
- GitHub Actions CI on pull request to `main`/`master`.
- GitHub Actions CD on push to `main`/`master` using SSH.
- `nginx.conf` with HTTPS redirect and strict rate limiting for `/threads` without `burst` and `nodelay`.
- Application-level rate limiting using `express-rate-limit` on all `/threads*` endpoints so the protection still works even when deployed behind a proxy platform like Railway.
- Optional comment-like endpoint: `PUT /threads/:threadId/comments/:commentId/likes`.

## Current rate limit behavior
- Window: 1 minute
- Maximum requests: 10 requests per IP to `/threads*`
- Response when exceeded: HTTP `429 Too Many Requests`

## Why this was changed
Railway or other proxy-based platforms can make NGINX-only limiting less reliable for submission testing. Because of that, the API now also enforces the limit directly inside Express. This makes Postman testing without delay fail with `429` consistently after the quota is exceeded.

## Suggested re-test
1. Run the Postman collection without delay until the `/threads` quota is exceeded.
2. Confirm the API returns `429` with message `terlalu banyak request ke endpoint threads`.
3. Run the same collection with delay and confirm requests can pass again after the rate window resets.

## Secrets needed for CD
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `APP_DIRECTORY`

## Important follow-up
- Replace SSL certificate paths and server name in `nginx.conf`.
- Adjust `git pull origin main` if your default branch is `master`.
- If Railway still causes inconsistent reviewer results, move deployment to a VPS and keep the Express limiter enabled as a second layer.
