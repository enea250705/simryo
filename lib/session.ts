import { cookies } from 'next/headers'

interface SessionData {
  userId: string
  email: string
  name: string
  image?: string
  exp: number
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('simryo-session')?.value
    if (!token) return null
    const data = JSON.parse(Buffer.from(token, 'base64').toString()) as SessionData
    if (Date.now() > data.exp) return null
    return data
  } catch {
    return null
  }
}
