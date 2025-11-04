import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import meRoutes from "./routes/meRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import purchasesRoutes from "./routes/purchasesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", userRoutes);
app.use("/api/user", meRoutes);
app.use("/api", cartRoutes);
app.use("/api", purchasesRoutes);

app.get("/", (_, res) => res.send("Marketplace server"));
app.get("/home", (_, res) =>
  res.sendFile(path.join(__dirname, "../public/home.html"))
);
app.get("/market", (_, res) =>
  res.sendFile(path.join(__dirname, "../public/market.html"))
);
app.get("/post", (_, res) =>
  res.sendFile(path.join(__dirname, "../public/post.html"))
);
app.get("/about", (_, res) =>
  res.sendFile(path.join(__dirname, "../public/about.html"))
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at https://marketplace-4d4t.onrender.com`)
);
