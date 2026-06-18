import "dotenv/config";

export function getConfig() {
  const requiredKeys = ["OPENAI_API_KEY", "QDRANT_URL", "QDRANT_API_KEY"];
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      throw new Error(`缺少環境變數：${key}`);
    }
  }

  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    qdrantUrl: process.env.QDRANT_URL.replace(/\/$/, ""),
    qdrantApiKey: process.env.QDRANT_API_KEY,
    collectionName: process.env.QDRANT_COLLECTION || "tw_scenic_spots_hw03",
    embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    vectorSize: Number(process.env.VECTOR_SIZE || 1536)
  };
}
