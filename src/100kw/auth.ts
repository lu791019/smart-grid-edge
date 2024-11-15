// auth.ts

let token: string = ''; // 用于保存 token
let tokenExpiryTime: number = 0; // 用于保存 token 的过期时间

export async function fetchToken(): Promise<void> {
  const response = await fetch('http://140.115.65.34:8001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin',
    }),
  });

  if (!response.ok) {
    console.log('GGGGGG');
    throw new Error('Failed to fetch token');
  }

  const data = await response.json();
  token = data.data;
  // 根据 token 的有效期设置过期时间，比如 token 有效期是 1 小时
  tokenExpiryTime = Date.now() + 60 * 60 * 1000;
}

export function getToken(): string {
  return token;
}

export function isTokenValid(): boolean {
  // 提前 5 分钟检查 token 是否快过期了
  return Date.now() < tokenExpiryTime - 5 * 60 * 1000;
}
