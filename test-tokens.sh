#!/usr/bin/env bash
set -euo pipefail

API=http://localhost:8080/protected

# Generate fresh tokens
echo "[*] Generating tokens..."
docker compose exec -T api node scripts/make-tokens.mjs > tokens.txt

# Helper: decode a JWT
decode_jwt() {
  TOKEN=$1
  HEADER=$(echo "$TOKEN" | cut -d '.' -f1 | tr '_-' '/+' | base64 -d 2>/dev/null)
  PAYLOAD=$(echo "$TOKEN" | cut -d '.' -f2 | tr '_-' '/+' | base64 -d 2>/dev/null)
  echo "Header:"
  echo "$HEADER"
  echo "Payload:"
  echo "$PAYLOAD"
}

# Load tokens into variables
VALID=$(grep -A1 '# valid' tokens.txt | tail -n1)
EXPIRED=$(grep -A1 '# expired' tokens.txt | tail -n1)
WRONG_AUD=$(grep -A1 '# wrong_audience' tokens.txt | tail -n1)
WRONG_ISS=$(grep -A1 '# wrong_issuer' tokens.txt | tail -n1)
BAD_SIG=$(grep -A1 '# bad_signature' tokens.txt | tail -n1)

test_token() {
  LABEL=$1
  TOKEN=$2
  echo
  echo "============================"
  echo " Testing with $LABEL"
  echo "============================"
  echo "Raw token:"
  echo "$TOKEN"
  echo
  echo "Decoded JWT:"
  decode_jwt "$TOKEN"
  echo
  echo "Curl command:"
  echo "curl -s -H \"Authorization: Bearer $TOKEN\" \"$API\" | jq ."
  echo
  echo "Response:"
  curl -s -H "Authorization: Bearer $TOKEN" "$API" | jq .
}

test_token "VALID token" "$VALID"
test_token "EXPIRED token" "$EXPIRED"
test_token "WRONG AUDIENCE" "$WRONG_AUD"
test_token "WRONG ISSUER" "$WRONG_ISS"
test_token "BAD SIGNATURE" "$BAD_SIG"
