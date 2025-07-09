import { MESSAGES } from '@/constants';

/**
 * Misskeyサーバーからユーザー名を取得する
 * @param server サーバーURL
 * @param userId ユーザーID
 * @returns ユーザー名（取得失敗時は"Unknown User (ID)"）
 */
export async function getUserName(
  server: string,
  userId: string
): Promise<string> {
  try {
    const requestBody = {
      userId: userId,
    };

    const response = await fetch(`${server}/api/users/show`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch user data: ${response.status} ${response.statusText}`
      );
      return MESSAGES.UNKNOWN_USER(userId);
    }

    const userData = await response.json();

    if (!userData || typeof userData !== 'object') {
      console.error('Invalid user data response:', userData);
      return MESSAGES.UNKNOWN_USER(userId);
    }

    const username = (userData as Record<string, unknown>).username;
    if (typeof username === 'string' && username.trim() !== '') {
      return username.trim();
    }

    console.error('Username not found in response:', userData);
    return MESSAGES.UNKNOWN_USER(userId);
  } catch (error) {
    console.error(`Error fetching user data for ${userId}:`, error);
    return MESSAGES.UNKNOWN_USER(userId);
  }
}

/**
 * 複数のユーザー名を並列で取得する
 * @param server サーバーURL
 * @param userIds ユーザーIDの配列
 * @returns ユーザー名の配列
 */
export async function getUserNames(
  server: string,
  userIds: string[]
): Promise<string[]> {
  const promises = userIds.map((userId) => getUserName(server, userId));
  return Promise.all(promises);
}
