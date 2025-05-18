import express from "express";
import { rateLimit, MemoryStore } from "express-rate-limit";
import WebSocket from "ws";
import cors from "cors";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";

config();

// console.log(process.env.FIREBASE_PRIVATE_KEY, process.env.OPENAI_API_KEY);

initializeApp({
  credential: credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    // privateKey: process.env.FIREBASE_PRIVATE_KEY,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = getFirestore();

const store = new MemoryStore();

const PROMPT_LIMITS = {
  "groq/llama2-70b-4096": 5,
  "groq/mixtral-8x7b-32768": 5,
  "groq/gemma-7b-it": 5,
};
const PORT = process.env.PORT || 6823;

function rateLimiterKey(model: string, fingerprint: string) {
  return model + "/" + fingerprint;
}

const rateLimiters = {
  "groq/llama2-70b-4096": rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: PROMPT_LIMITS["groq/llama2-70b-4096"],
    message: "You have exceeded the 5 requests in 24 hours limit!",
    keyGenerator: (req) => {
      return rateLimiterKey(req.query.model as string, req.query.fp as string);
    },
    store,
    legacyHeaders: false,
    standardHeaders: true,
  }),
  // Add other models if needed
};

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not set in environment variables");
  process.exit(1);
}

const app = express();
app.use(cors());

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Listen for WebSocket connections
wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      try {
        const documentRef = await db
          .collection("completions")
          .add({ ...data, createdAt: new Date() });
        console.log("Document added with ID:", documentRef.id);
      } catch (error) {
        console.error("Error while adding document:", error);
      }
      console.log("data", data);
      // Use model from client or default
      const model = data.model || "meta-llama/llama-4-scout-17b-16e-instruct";
      // Call Groq API
      const groqRes = await fetchUrl("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "user", content: data.prompt },
          ],
          stream: true,
          max_tokens: 200,
          temperature: data.temperature,
        }),
      });
      if (!groqRes.ok || !groqRes.body) {
        const err = await groqRes.text();
        ws.send(`Error: ${err}`);
        return;
      }
      // Stream response to client (Node.js stream)
      let buffer = "";
      for await (const chunk of groqRes.body as any) {
        buffer += Buffer.from(chunk).toString();
        let lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.trim().startsWith("data:")) {
            const jsonStr = line.replace(/^data:\s*/, "");
            if (jsonStr === "[DONE]") {
              ws.send("[DONE]");
              return;
            }
            try {
              const payload = JSON.parse(jsonStr);
              const content = payload.choices?.[0]?.delta?.content;
              if (content) ws.send(content);
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }
      ws.send("[DONE]");
    } catch (error: any) {
      ws.send(`Error: ${error.message || error}`);
    }
  });
});

// Upgrade HTTP connections to WebSocket connections
app.use("/ws", (req, res, next) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    wss.emit("connection", ws, req);
  });
});

app.get("/api/completion", (req, res) => {
  const prompt = req.query.prompt as string;
  // OpenAI request
  // Respond with a JSON object that includes the received "prompt" value
  res.json({ receivedPrompt: prompt });
});

app.get("/api/prompts-remaining", (req, res) => {
  const key = rateLimiterKey(req.query.model as string, req.query.fp as string);
  console.log("KEY", key);

  const remaining = Math.max(
    (PROMPT_LIMITS[req.query.model as keyof typeof PROMPT_LIMITS] ?? 5) -
      (store.hits[key] ?? 0),
    0
  );

  res.json({
    remaining: remaining,
  });
});

app.get("/api/moar-prompts", (req, res) => {
  const key = rateLimiterKey(req.query.model as string, req.query.fp as string);
  store.hits[key] = (store.hits[key] ?? 0) - 3;
  console.log("Got moar prompts for", req.query.fp);
  res.json({
    message: "Decremented",
  });
});

app.get("/api/use-prompt", (req, res) => {
  const key = rateLimiterKey(req.query.model as string, req.query.fp as string);
  store.increment(key);
  res.json({
    message: `Used a token: ${key}`,
  });
});

app.get("/api/examples", (req, res) => {
  const examplesDir = path.join(__dirname, "examples");
  const exampleFiles = fs.readdirSync(examplesDir);
  const examples = exampleFiles.map((filename) => {
    const filePath = path.join(examplesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  });
  res.json(examples);
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const fetch = (...args: [RequestInfo, RequestInit?]) =>
  import('node-fetch').then(mod => mod.default(...args));

async function fetchUrl(...args: Parameters<typeof import('node-fetch')['default']>) {
  const mod = await import('node-fetch');
  return mod.default(...args);
}
