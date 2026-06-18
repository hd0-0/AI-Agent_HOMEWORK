import { timeTool, getCurrentTime } from "./tools/timeTool.js";
import { youbikeTool, findYouBikeByArea } from "./tools/youbikeTool.js";

export const tools = [timeTool, youbikeTool];

export async function executeTool(name, args) {
  console.log(`Tool Call: ${name}`);

  if (name === "get_current_time") {
    return getCurrentTime();
  }

  if (name === "find_youbike_by_area") {
    return findYouBikeByArea(args);
  }

  return {
    error: true,
    message: `找不到工具：${name}`
  };
}
