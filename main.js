import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createEmbedding } from "./src/embeddings.js";
import { searchSimilar } from "./src/vectorStore.js";

console.log("台灣風景名勝知識庫問答");
console.log("輸入問題後會搜尋最相關的景點資料，輸入 exit 離開");

const rl = readline.createInterface({ input, output });

while (true) {
  const question = await rl.question("\n請輸入問題：");
  if (question.trim().toLowerCase() === "exit") break;
  if (!question.trim()) continue;

  console.log("Step 1: 建立問題 embedding");
  const vector = await createEmbedding(question);

  console.log("Step 2: 搜尋向量資料庫");
  const result = await searchSimilar(vector, 1);
  const best = result[0];

  if (!best) {
    console.log("沒有找到相關資料");
    continue;
  }

  console.log("回答：");
  console.log(`${best.payload.name} 是最相關的景點。`);
  console.log(best.payload.text);
  console.log(`相似度分數：${best.score.toFixed(4)}`);
}

rl.close();
console.log("程式結束");
