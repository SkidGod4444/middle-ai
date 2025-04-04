import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { myProvider } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { generateTitleFromUserMessage } from "@/lib/actions";
import { getLoggedInUser } from "@/lib/appwrite/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();
  

  const session = await getLoggedInUser();


  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);


  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }
  console.log("chatId", id);
  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id: id, userId: session.$id!, title });
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === "chat-model-reasoning"
            ? []
            : [
                "getWeather",
                "createDocument",
                "updateDocument",
                "requestSuggestions",
              ],
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,
          // tools: {
          //   // getWeather,
          //   // createDocument: createDocument({ session, dataStream }),
          //   // updateDocument: updateDocument({ session, dataStream }),
          //   // requestSuggestions: requestSuggestions({
          //   //   session,
          //   //   dataStream,
          //   // }),
          // },
        onFinish: async ({ response, reasoning }) => {
          // if (session.user?.id) {
          try {
            const sanitizedResponseMessages = sanitizeResponseMessages({
              messages: response.messages,
              reasoning,
            });

            await saveMessages({
              messages: sanitizedResponseMessages.map((message) => {
                return {
                  id: message.id,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                };
              }),
            });
          } catch (error) {
            console.error("ERROR OCCURED", error);
            console.error("Failed to save chat");
          }
          // }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return "Oops, an error occured!";
    },
  });
}

  export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Not Found', { status: 404 });
    }

    const session = await getLoggedInUser()

    if (!session ) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const chat = await getChatById({ id });

      if (chat.userId !== session.$id) {
        return new Response('Unauthorized', { status: 401 });
      }

      await deleteChatById({ id });

      return new Response('Chat deleted', { status: 200 });
    } catch (error) {
      return new Response('An error occurred while processing your request' + error, {
        status: 500,
      });
    }
  }
