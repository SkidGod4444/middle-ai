export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';
export const dealPrompts = '';

export const systemPrompt = ({
    selectedChatModel,
  }: {
    selectedChatModel: string;
  }) => {
    if (selectedChatModel === 'chat-model-reasoning') {
      return regularPrompt;
    } else {
      return `${regularPrompt}\n\n${dealPrompts}`;
    }
  };