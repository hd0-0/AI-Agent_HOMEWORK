import { createEmbedding } from "./src/embeddings.js";
import { buildKnowledgeDocuments } from "./src/knowledge.js";
import { createCollection, upsertDocuments } from "./src/vectorStore.js";

console.log("Step 1: 載入台灣風景名勝知識資料");
const documents = buildKnowledgeDocuments();
console.log(`共準備 ${documents.length} 筆資料`);

console.log("Step 2: 建立 Qdrant collection");
await createCollection();
console.log("collection 建立完成");

console.log("Step 3: 建立 embeddings 並寫入 vector database");
const embeddedDocuments = [];
for (const document of documents) {
  console.log(`正在處理：${document.name}`);
  const vector = await createEmbedding(document.text);
  embeddedDocuments.push({ ...document, vector });
}

await upsertDocuments(embeddedDocuments);
console.log("Step 4: 寫入完成");
console.log("hw03 知識庫初始化完成");
