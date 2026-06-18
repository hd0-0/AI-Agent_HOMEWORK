import "dotenv/config";

export function getConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("缺少環境變數：OPENAI_API_KEY");
  }

  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small"
  };
}
