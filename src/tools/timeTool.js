export const timeTool = {
  type: "function",
  function: {
    name: "get_current_time",
    description: "取得目前台北時間",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

export async function getCurrentTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return {
    timezone: "Asia/Taipei",
    current_time: formatter.format(now)
  };
}
