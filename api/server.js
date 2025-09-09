import express from "express";
import { jwtVerify } from "jose";

const ISS = process.env.JWT_ISS;
const AUD = process.env.JWT_AUD;
const HS_SECRET = new TextEncoder().encode(process.env.JWT_HS_SECRET);

const app = express();
app.use(express.json());

async function verifyToken(bearer) {
  const token = bearer?.split(" ")[1];
  if (!token) throw new Error("No bearer token");

  return jwtVerify(token, HS_SECRET, {
    algorithms: ["HS256"], // pin expected algorithm(s)
    issuer: ISS,
    audience: AUD,
    clockTolerance: "5s"
  });
}

app.get("/protected", async (req, res) => {
  try {
    await verifyToken(req.headers.authorization);
    res.json({ ok: true, message: "✅ Access granted" });
  } catch (e) {
    res.status(401).json({ ok: false, error: e.message });
  }
});

app.listen(8080, () => console.log("API listening on :8080"));
