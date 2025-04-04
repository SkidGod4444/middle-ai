'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import {  useState } from 'react';
import  { useSWRConfig } from 'swr';
import {  generateUUID } from '@/lib/utils';
import { toast } from 'sonner';
import { Messages } from '../msgs/messages';
import { MultimodalInput } from './multimodal-input';


export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: (error) => {
        console.error("ERROR OCCURED:", error);
      toast.error('An error occured, please try again!');
    },
  });

  // const { data: votes } = useSWR<Array<Vote>>(
  //   `/api/vote?chatId=${id}`,
  //   fetcher,
  // );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);


  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          isReadonly={isReadonly}
        /> */}

        <Messages
          chatId={id}
          isLoading={isLoading}

          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={false}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>
    </>
  );
}