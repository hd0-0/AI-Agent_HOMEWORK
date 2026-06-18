import OpenAI from "openai";
import { getConfig } from "./config.js";

const config = getConfig();
const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

export async function createEmbedding(input) {
  const response = await openai.embeddings.create({
    model: config.embeddingModel,
    input
  });

  return response.data[0].embedding;
}
