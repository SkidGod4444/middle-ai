
import { getChatsByUserId } from '@/lib/db/queries';
import { getLoggedInUser } from '@/lib/appwrite/server';

export async function GET() {
    const user = await getLoggedInUser();

  if ( !user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const chats = await getChatsByUserId({ id: user.$id! });
  return Response.json(chats);
}