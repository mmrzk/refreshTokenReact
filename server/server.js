const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const notes1 = ["note msg 1 --- 1", "note msg 1 --- 2", "note msg 1 --- 3"];
const notes2 = ["note msg 2 --- 1", "note msg 2 --- 2", "note msg 2 --- 3"];
const notes3 = ["note msg 3 --- 1", "note msg 3 --- 2", "note msg 3 --- 3"];

const app = express();

const genAccessToken = () => {
  return jwt.sign({ login: "admin" }, "secret", { expiresIn: "30s" });
};

const genRefreshToken = () => {
  return jwt.sign({ login: "admin" }, "refreshSecret", { expiresIn: "5m" });
};

const genTokens = () => {
  return { accessToken: genAccessToken(), refreshToken: genRefreshToken() };
};

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("hello");
});

app.post("/login", (req, res) => {
  console.log(`got post`);
  const { email, password } = req.body;
  if (email === "admin@admin" && password === "admin") {
    const { accessToken, refreshToken } = genTokens();
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 300,
      httpOnly: true,
      secure: true,
    });
    return res.send({ accessToken });
  } else return res.sendStatus(404);
});

app.post("/logout", (_, res) => {
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
});

app.post("/refresh-access-token", async (req, res) => {
  console.log(`Got refresh token request`);
  const refreshTokenCookie = req.cookies.refreshToken;
  await new Promise((r) => setTimeout(r, 5000));
  try {
    if (refreshTokenCookie && jwt.verify(refreshTokenCookie, "refreshSecret")) {
      return res.send({ accessToken: genAccessToken() });
    } else {
      return res.sendStatus(401);
    }
  } catch {
    return res.sendStatus(401);
  }
});

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log({ authHeader });
  if (!authHeader) return res.sendStatus(401);
  const accessToken = authHeader.split(" ")[1];
  try {
    if (jwt.verify(accessToken, "secret")) next();
  } catch {
    return res.sendStatus(401);
  }
});

app.post("/notes1", (req, res) => {
  const { value } = req.body;
  notes1.push(value);
  return res.sendStatus(200);
});

app.post("/notes2", (req, res) => {
  const { value } = req.body;
  notes2.push(value);
  return res.sendStatus(200);
});

app.post("/notes3", (req, res) => {
  const { value } = req.body;
  notes3.push(value);
  return res.sendStatus(200);
});

app.get("/notes1", async (_, res) => {
  await new Promise((r) => setTimeout(r, 300));
  res.send(notes1);
});

app.get("/notes2", async (_, res) => {
  await new Promise((r) => setTimeout(r, 800));
  res.send(notes2);
});

app.get("/notes3", async (_, res) => {
  await new Promise((r) => setTimeout(r, 1300));
  res.send(notes3);
});

app.listen(3002);
