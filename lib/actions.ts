"use server";

import { generateText, Message } from "ai";
import { cookies } from "next/headers";

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  //   updateChatVisiblityById,
} from "@/lib/db/queries";
import { myProvider } from "@/lib/ai/models";

import { createAdminClient, createSessionClient } from "./appwrite/server";
import { ID } from "appwrite";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

// export async function updateChatVisibility({
//   chatId,
//   visibility,
// }: {
//   chatId: string;
//   visibility: VisibilityType;
// }) {
//   await updateChatVisiblityById({ chatId, visibility });
// }

export const createSession = async (uid: string, otp: string) => {
  const { account } = await createAdminClient();
  const session = await account.createSession(uid, otp);
  console.log("session",session)
  console.log("session", session);
  if (session) {
    (await cookies()).set("session", session.secret);
  }
  return session;
};

export const createToken = async (phone: string) => {
  const { account } = await createAdminClient();
  const token = await account.createPhoneToken(ID.unique(), phone);
  console.log("token", token);
  return token;
};
