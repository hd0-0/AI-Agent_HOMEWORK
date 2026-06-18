import { createEmbedding } from "./src/embeddings.js";
import { buildPairs, cosineSimilarity } from "./src/similarity.js";
import { testGroups } from "./src/testCases.js";

console.log("hw05 向量相似度實驗開始");

for (const group of testGroups) {
  console.log("");
  console.log(group.name);
  console.log("Step 1: 建立每一句的 embedding");

  const embedded = [];
  for (const sentence of group.sentences) {
    console.log(`建立向量：${sentence}`);
    const vector = await createEmbedding(sentence);
    embedded.push({ sentence, vector });
  }

  console.log("Step 2: 計算兩兩 cosine similarity");
  const pairs = buildPairs(embedded);
  for (const [left, right] of pairs) {
    const score = cosineSimilarity(left.vector, right.vector);
    console.log(`- "${left.sentence}" vs "${right.sentence}" = ${score.toFixed(4)}`);
  }
}

console.log("");
console.log("hw05 向量相似度實驗完成");
