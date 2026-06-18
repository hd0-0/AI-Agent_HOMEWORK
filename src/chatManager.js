import OpenAI from "openai";
import { getConfig } from "./config.js";
import { executeTool, tools } from "./toolRegistry.js";

const systemPrompt = `
你是一個台北生活助理。
你可以回答現在台北時間，也可以查詢台北市行政區的 YouBike 可借車輛。
查詢 YouBike 時請使用行政區名稱，例如大安區、信義區；不要用「台北市」當查詢條件。
回答要簡潔，若工具有回傳站點，列出站名、可借車數、地址。
`;

export class ChatManager {
  constructor() {
    const config = getConfig();
    this.model = config.model;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
    this.messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
  }

  async sendMessage(content) {
    this.messages.push({ role: "user", content });

    console.log("Step 1: 傳送訊息給模型");
    let responseMessage = await this.createChatCompletion();

    while (responseMessage.tool_calls?.length) {
      this.messages.push(responseMessage);
      console.log(`Step 2: 模型要求呼叫 ${responseMessage.tool_calls.length} 個工具`);

      for (const toolCall of responseMessage.tool_calls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || "{}");
        const result = await executeTool(name, args);

        this.messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      console.log("Step 3: 將工具結果交回模型整理回答");
      responseMessage = await this.createChatCompletion();
    }

    this.messages.push(responseMessage);
    return responseMessage.content;
  }

  async createChatCompletion() {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: this.messages,
      tools,
      tool_choice: "auto"
    });

    return response.choices[0].message;
  }
}
