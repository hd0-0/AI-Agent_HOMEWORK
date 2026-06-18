import "dotenv/config";

export function getConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("缺少環境變數：OPENAI_API_KEY");
  }

  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini"
  };
}
