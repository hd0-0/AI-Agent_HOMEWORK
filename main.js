import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { ChatManager } from "./src/chatManager.js";

console.log("台北時間與 YouBike 助理");
console.log("可詢問：現在幾點？信義區有 YouBike 可以借嗎？輸入 exit 離開");

const chat = new ChatManager();
const rl = readline.createInterface({ input, output });

while (true) {
  const question = await rl.question("\n你：");
  if (question.trim().toLowerCase() === "exit") break;
  if (!question.trim()) continue;

  const answer = await chat.sendMessage(question);
  console.log(`助理：${answer}`);
}

rl.close();
console.log("程式結束");
