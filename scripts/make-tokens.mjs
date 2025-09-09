import { SignJWT } from "jose";

const ISS = process.env.JWT_ISS || "https://issuer.example";
const AUD = process.env.JWT_AUD || "https://api.example";
const SECRET = new TextEncoder().encode(process.env.JWT_HS_SECRET || "use-a-long-random-secret-from-kms");

async function buildToken({ iss = ISS, aud = AUD, expSeconds = 600, secret = SECRET } = {}) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ sub: "user123", role: "reader" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(iss)
    .setAudience(aud)
    .setIssuedAt(now)
    .setExpirationTime(now + expSeconds)
    .sign(secret);
}

const wrongSecret = new TextEncoder().encode("this-is-the-wrong-secret");

const tokens = {
  valid: await buildToken(),
  expired: await buildToken({ expSeconds: -60 }),
  wrong_audience: await buildToken({ aud: "https://someone-else" }),
  wrong_issuer: await buildToken({ iss: "https://evil.example" }),
  bad_signature: await buildToken({ secret: wrongSecret })
};

for (const [name, tok] of Object.entries(tokens)) {
  console.log(`\n# ${name}\n${tok}\n`);
}
