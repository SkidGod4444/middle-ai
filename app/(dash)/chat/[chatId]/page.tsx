import { Chat } from "@/components/custom/chat/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const dbMessages = await getMessagesByChatId({ id: chatId });
  const initialMessages = convertToUIMessages(dbMessages);

  return (
    <Chat
      id={chatId}
      initialMessages={initialMessages}
      selectedChatModel={DEFAULT_CHAT_MODEL}
      isReadonly={false}
    />
  );
}
