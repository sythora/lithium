import express from "express";
import { createServer } from "node:http";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import fs from "fs/promises";

const __dirname = process.cwd();
const app = express();

const publicPath = join(__dirname, "static");
app.use(express.static(publicPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use(express.json());

const rantsFile = join(__dirname, "./static/json/rant.json");

// Helper: safely read rants
async function readRants() {
    try {
        const data = await fs.readFile(rantsFile, "utf-8");
        return JSON.parse(data || "[]"); // fallback to empty array
    } catch (err) {
        console.error("Failed to read rants:", err);
        return [];
    }
}

// GET all rants
app.get("/api/rants", async (req, res) => {
    const rants = await readRants();
    res.json(rants);
});

// POST a new rant (secret key required)
app.post("/api/rants", async (req, res) => {
    const SECRET_KEY = "darwin2023"; // <-- change this
    const { secret, text } = req.body;

    if (secret !== SECRET_KEY) return res.status(403).json({ error: "Forbidden" });
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Invalid text" });

    try {
        const rants = await readRants();
        rants.push({ text: text.trim() });
        await fs.writeFile(rantsFile, JSON.stringify(rants, null, 2));
        res.json({ success: true, rants });
    } catch (err) {
        console.error("Failed to save rant:", err);
        res.status(500).json({ error: "Failed to save rant" });
    }
});

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(join(publicPath, "index.html"));
});

// Catch-all
app.use((req, res) => {
    res.status(404).sendFile(join(publicPath, "index.html"));
});

const server = createServer(app);

// WebSocket
server.on("upgrade", (req, socket, head) => {
    if (req.headers['upgrade'] !== 'websocket') return socket.destroy();
    wisp.routeRequest(req, socket, head);
});

let port = parseInt(process.env.PORT || "8080");
if (isNaN(port)) port = 8080;

server.listen(port, () => {
    console.log("Lithium Protection Active");
    console.log(`Listening on http://localhost:${port}`);
    console.log(`Listening on http://${hostname()}:${port}`);
});

// Graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    process.exit(0);
}
