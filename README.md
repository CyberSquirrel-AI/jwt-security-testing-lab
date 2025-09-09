# JWT Security Testing Lab (Beginner-Friendly)

This repo pairs with the blog post **“JWT Security Testing: A Beginner’s Guide to Spotting and Fixing Vulnerabilities.”**
https://cybersquirrel.ai/posts/jwt-security-testing/
It demonstrates JWT validation using Node.js, Express, and `jose`.

## What this lab does
- Returns **200** for a valid token
- Returns **401** for invalid tokens (expired / wrong audience / wrong issuer / bad signature)
- No exploit code, just safe validation checks for learning

## Prereqs
- Docker & Docker Compose
- Node 20+ (only if you want to run the token generator locally)

## Quick start

```bash
# 1) Start the API
docker compose build --no-cache
docker compose up
```

The API listens on **http://localhost:8080** with default env:
- `JWT_ISS=https://issuer.example`
- `JWT_AUD=https://api.example`
- `JWT_HS_SECRET=use-a-long-random-secret-and-store-secret-in-vault`

## Generate test tokens

```bash
# Match the API's env for "valid"
export JWT_ISS=https://issuer.example
export JWT_AUD=https://api.example
export JWT_HS_SECRET=use-a-long-random-secret-and-store-secret-in-vault

docker compose exec -T api node scripts/make-tokens.mjs > tokens.txt
```

Open `tokens.txt`, copy each token after `Bearer `, and call the endpoint:

```bash
API=http://localhost:8080/protected

curl -s -H "Authorization: Bearer <valid>" "$API" | jq .
curl -s -H "Authorization: Bearer <expired>" "$API" | jq .
curl -s -H "Authorization: Bearer <wrong_audience>" "$API" | jq .
curl -s -H "Authorization: Bearer <wrong_issuer>" "$API" | jq .
curl -s -H "Authorization: Bearer <bad_signature>" "$API" | jq .
```
## Automated Bash script

```bash
chmod +x test-tokens.sh
./test-tokens.sh
```

**Expected**
- `valid` → HTTP 200, `{ ok: true }`
- others → HTTP 401 with clear error messages

## Notes & tips
- This is a lab: it shows correct verification/claim checks.
- For extra learning, try changing:
  - the pinned algorithms in `server.js`
  - the `aud`/`iss` values in `scripts/make-tokens.mjs`
  - the expiration window
- Never paste secrets or production tokens into public tools.
- Only test systems you own or are authorized to assess.

## Attribution

*Ideas are mine but rephrased and edited using AI.*

## 📌 Disclaimer

> This is intended for **learning**. Misuse against environments you don't own or operate is illegal and unethical.

## License

MIT License
