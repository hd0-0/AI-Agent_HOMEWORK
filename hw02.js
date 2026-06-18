import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(toolList.map((t) => [t.name, t.fn]));

import { input } from "@inquirer/prompts";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

await initMessage(
  "你是一位專門聊星座話題的星座大師，請用繁體中文回答。請用幽默有趣的方式回應。回答的字數要大於50個, 但是要精簡。"
);

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

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
      tools,
      tool_choice: "auto",
    });

    const message = response.choices[0].message;
    if (!message.tool_calls || message.tool_calls.length === 0) {
        console.log(message.content);
        break;
    }

    for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

        const fn = AVAILABLE_TOOLS[fnName];
        const result = await fn(args);

        messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
        });
    }

    await addMessage(message.content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}