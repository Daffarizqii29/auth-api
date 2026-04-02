# Deployment notes

## What was added
- GitHub Actions CI on pull request to `main`/`master`.
- GitHub Actions CD on push to `main`/`master` using SSH.
- `nginx.conf` with HTTPS redirect and strict rate limiting for `/threads` (tanpa `burst` dan `nodelay`).
- App-level strict rate limiter untuk `/threads` agar tetap bekerja saat reverse proxy dikelola platform.
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
- Untuk penilaian limit access, hindari deployment yang menyerap traffic di layer platform sebelum rule kamu dijalankan. Gunakan VPS/reverse proxy yang kamu kontrol penuh, atau andalkan app-level limiter yang sekarang sudah ditambahkan.

## Variabel environment baru
- `THREADS_RATE_LIMIT_WINDOW_MS` (default contoh: `60000`)
- `THREADS_RATE_LIMIT_MAX_REQUESTS` (default contoh: `90`)

## Saran pengujian Postman
- Jalankan collection tanpa delay: request ke `/threads` harus mulai menerima `429 Too Many Requests` setelah batas terlampaui.
- Jalankan collection dengan delay: request tetap lolos selama masih di bawah batas per window.
