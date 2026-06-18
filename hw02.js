import { client } from "./lib/openai.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

import { input } from "@inquirer/prompts";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(
  toolList.map((tool) => [tool.name, tool.fn])
);

await initMessage(
  "你是一位專門聊星座話題的星座大師，請用繁體中文回答。請用幽默有趣的方式回應。回答的字數要大於50個，但是要精簡。\n如果使用者問單位換算，必須使用我提供的工具 convert_unit。若工具回傳 error，或單位組合不支援，絕對不可自行計算或用常識回答，只能回答：不支援的單位組合。"
);

async function callOpenAI() {
  return client.chat.completions.create({
    model: "gpt-5-mini",
    messages: getMessages(),
    tools,
    tool_choice: "auto",
  });
}

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;

    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion, "user");

    while (true) {
      const response = await callOpenAI();
      const message = response.choices[0].message;

      if (!message.tool_calls || message.tool_calls.length === 0) {
        console.log(message.content);
        await addMessage(message.content, "assistant");
        break;
      }

      await addMessage(
        {
          content: message.content ?? null,
          tool_calls: message.tool_calls,
        },
        "assistant"
      );

      for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || "{}");

        console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

        const fn = AVAILABLE_TOOLS[fnName];

        const result = fn
          ? await fn(args)
          : { error: `找不到工具：${fnName}` };

        await addMessage(
          {
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          },
          "tool"
        );
      }
    }
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}