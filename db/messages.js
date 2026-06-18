const messages = [];

export async function initMessage(systemPrompt) {
  messages.length = 0;

  messages.push({
    role: "system",
    content: systemPrompt,
  });
}

export async function addMessage(message, role = "user") {
  if (typeof message === "string") {
    messages.push({
      role,
      content: message,
    });
    return;
  }

  messages.push({
    role,
    ...message,
  });
}

export function getMessages() {
  return messages;
}