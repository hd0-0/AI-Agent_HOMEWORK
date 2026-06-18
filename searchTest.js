import { createEmbedding } from "./src/embeddings.js";
import { searchSimilar } from "./src/vectorStore.js";

const questions = [
  "我想看日出、雲海，還想搭高山鐵路，推薦哪裡？",
  "哪個景點適合騎自行車環湖，也可以搭船？",
  "想看峽谷和大理岩地形，台灣哪個地方最適合？"
];

console.log("Step 1: 開始搜尋測試");

for (const question of questions) {
  console.log("");
  console.log(`問題：${question}`);
  console.log("Step 2: 將問題轉成向量");
  const vector = await createEmbedding(question);

  console.log("Step 3: 到 Qdrant 搜尋相近資料");
  const result = await searchSimilar(vector, 3);

  console.log("搜尋結果：");
  for (const item of result) {
    console.log(`- ${item.payload.name}，分數：${item.score.toFixed(4)}`);
    console.log(`  ${item.payload.text}`);
  }
}

console.log("");
console.log("hw03 搜尋測試完成");
