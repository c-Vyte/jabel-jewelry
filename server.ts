import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

async function enhanceDescriptionWithGrok(description: string, productName: string, category: string): Promise<string> {
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY not configured");
  }

  const prompt = `Enhance this luxury product description for a ${category.toLowerCase()} called "${productName}". 
Current description: "${description || 'No description provided'}"
Write a sophisticated, compelling 2-3 sentence description that highlights craftsmanship, materials, and emotional appeal. 
Tone: elegant, premium, evocative. No markdown, just plain text.`;

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        { role: "system", content: "You are a luxury copywriter for high-end jewelry and accessories." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || description;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3002;

  app.use(express.json({ limit: '10mb' }));

  // API route for Grok description enhancement
  app.post("/api/enhance-description", async (req, res) => {
    try {
      const { description, productName, category } = req.body;
      
      if (!productName || !category) {
        return res.status(400).json({ error: "productName and category are required" });
      }

      const enhanced = await enhanceDescriptionWithGrok(description || "", productName, category);
      res.json({ enhanced });
    } catch (error: any) {
      console.error("Description enhancement error:", error);
      res.status(500).json({ error: error.message || "Failed to enhance description" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
