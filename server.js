
const express = require("express");
const crypto = require("crypto");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.CLOUD_JUNZ_API_KEY;

if (!API_KEY || API_KEY.length < 32) {
  console.error("CLOUD_JUNZ_API_KEY belum diatur.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.json({
    name: "CLOUD JUNZ API",
    status: "online"
  });
});

app.get("/api/status", (req, res) => {
  res.json({ success: true, message: "API aktif" });
});

app.get("/api/dashboard", (req, res) => {
  const auth = req.get("authorization") || "";
  const match = auth.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "API key diperlukan"
    });
  }

  const provided = Buffer.from(match[1]);
  const expected = Buffer.from(API_KEY);

  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(provided, expected)
  ) {
    return res.status(403).json({
      success: false,
      message: "API key salah"
    });
  }

  res.json({
    success: true,
    app: "CLOUD JUNZ",
    message: "Autentikasi berhasil"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("CLOUD JUNZ API berjalan pada port " + PORT);
});
