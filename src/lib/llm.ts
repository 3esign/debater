import { GoogleGenerativeAI } from "@google/generative-ai";
import { APIKeys } from "./types";
import { CONFIG } from "./config";

/**
 * Deliberate cybernetic typing delay helper to simulate rhythmic agent reasoning
 */
export async function streamTextRhythmically(
  text: string,
  onWord: (textSoFar: string, newWord: string) => void,
  signal?: AbortSignal
) {
  const words = text.split(/(\s+)/); // split by spaces but keep whitespace
  let accumulated = "";

  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) break;

    const token = words[i];
    accumulated += token;
    
    // Call user chunk handler
    onWord(accumulated, token);

    // Calculate delay
    let delay = Math.floor(
      Math.random() * (CONFIG.cadence.wordDelayMaxMs - CONFIG.cadence.wordDelayMinMs) +
      CONFIG.cadence.wordDelayMinMs
    );

    if (token.includes('.') || token.includes('?') || token.includes('!')) {
      delay = CONFIG.cadence.sentenceDelayMs;
    } else if (token.includes(',') || token.includes(';') || token.includes(':')) {
      delay = CONFIG.cadence.punctuationDelayMs;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

/**
 * Universal Browser LLM Engine Router
 * Streams directly from client-side network to prevent key theft/server relay friction.
 */
export async function streamLLMResponse(
  provider: 'gemini' | 'groq' | 'ollama' | 'openrouter' | 'openai' | 'anthropic',
  modelName: string,
  prompt: string,
  keys: APIKeys,
  onWord: (textSoFar: string, newWord: string) => void,
  signal?: AbortSignal
): Promise<string> {
  let fullText = "";

  try {
    if (provider === 'gemini') {
      const key = keys.gemini;
      if (!key) throw new Error("Google Gemini API Key is missing. Enter it in the Keys Modal.");

      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });
      
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      for await (const chunk of result.stream) {
        if (signal?.aborted) break;
        const text = chunk.text();
        fullText += text;
        
        // Feed into rhythmic typing simulator to maintain premium pacing
        // For real-time chunks, we type them fast as they arrive
        onWord(fullText, text);
      }
      return fullText;
    }

    // Configure other providers (OpenAI compatible)
    let url = "";
    let authHeader = "";
    let requestModel = modelName;

    if (provider === 'groq') {
      const key = keys.groq;
      if (!key) throw new Error("Groq API Key is missing. Enter it in the Keys Modal.");
      url = "https://api.groq.com/openai/v1/chat/completions";
      authHeader = `Bearer ${key}`;
      requestModel = modelName || "llama3-70b-8192";
    } else if (provider === 'openrouter') {
      const key = keys.openrouter;
      if (!key) throw new Error("OpenRouter API Key is missing. Enter it in the Keys Modal.");
      url = "https://openrouter.ai/api/v1/chat/completions";
      authHeader = `Bearer ${key}`;
      requestModel = modelName || "deepseek/deepseek-chat";
    } else if (provider === 'openai') {
      const key = keys.openai;
      if (!key) throw new Error("OpenAI API Key is missing. Enter it in the Keys Modal.");
      url = "https://api.openai.com/v1/chat/completions";
      authHeader = `Bearer ${key}`;
      requestModel = modelName || "gpt-4o-mini";
    } else if (provider === 'ollama') {
      const ollamaHost = keys.ollamaUrl || "http://localhost:11434";
      url = `${ollamaHost}/v1/chat/completions`;
      requestModel = modelName || "llama3";
    } else if (provider === 'anthropic') {
      const key = keys.anthropic;
      if (!key) throw new Error("Anthropic API Key is missing.");
      // Using openrouter to bypass client CORS header blocks from Anthropic, or fetch direct
      url = "https://api.anthropic.com/v1/messages"; // Direct
      authHeader = `Bearer ${key}`;
      // Note: Anthropic client-side fetches might fail CORS natively in browsers. 
      // Recommend using Gemini, Groq, or OpenRouter for seamless direct web execution.
    }

    if (!url) throw new Error(`Provider ${provider} is not configured.`);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    if (provider === 'openrouter') {
      headers["HTTP-Referer"] = "https://github.com/autonomous-debater";
      headers["X-Title"] = "Debater Arena";
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      signal,
      body: JSON.stringify({
        model: requestModel,
        messages: [{ role: "user", content: prompt }],
        stream: true,
        // Anthropic structure differs, but we wrap in OpenAI compatible format for others
        ...(provider === 'anthropic' ? {
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }]
        } : {})
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LLM API returned error (${response.status}): ${errText || response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    if (!reader) throw new Error("Failed to get stream reader from response.");

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done || signal?.aborted) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;
        if (cleanLine === "data: [DONE]") continue;

        if (cleanLine.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(cleanLine.slice(6));
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              fullText += content;
              onWord(fullText, content);
            }
          } catch (e) {
            // Quiet fail for malformed JSON chunks
          }
        }
      }
    }

    return fullText;
  } catch (error: any) {
    console.error("LLM Stream Error:", error);
    throw error;
  }
}
