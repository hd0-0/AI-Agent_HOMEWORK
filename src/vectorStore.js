import { QdrantClient } from "@qdrant/js-client-rest";
import { getConfig } from "./config.js";

const config = getConfig();
const qdrant = new QdrantClient({
  url: config.qdrantUrl,
  apiKey: config.qdrantApiKey
});

export async function createCollection() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (collection) => collection.name === config.collectionName
  );

  if (exists) {
    console.log(`collection 已存在：${config.collectionName}`);
    return;
  }

  await qdrant.createCollection(config.collectionName, {
    vectors: {
      size: config.vectorSize,
      distance: "Cosine"
    }
  });
}

export async function upsertDocuments(documents) {
  const points = documents.map((document) => ({
    id: document.id,
    vector: document.vector,
    payload: {
      name: document.name,
      text: document.text,
      ...document.metadata
    }
  }));

  return qdrant.upsert(config.collectionName, {
    wait: true,
    points
  });
}

export async function searchSimilar(vector, limit = 3) {
  return qdrant.search(config.collectionName, {
    vector,
    limit,
    with_payload: true
  });
}
