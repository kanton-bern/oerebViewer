import { getEsriTokenService } from '~/config/setup'

interface EsriTokenResponse {
  token: string,
  expires: number,
}

export async function fetchEsriToken(): Promise<EsriTokenResponse> {

  const esriTokenService = await getEsriTokenService()

  const settings = {
    ...esriTokenService,
  }

  const formData = new URLSearchParams()
  formData.append('username', settings.username)
  formData.append('password', settings.password)
  formData.append('expiration', `${Math.min(settings.intervalMinutes, 60)}`)
  formData.append('f', 'json')

  const response = await $fetch(settings.endpoint, {
    method: 'POST',
    body: formData.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })
  const token = await response.json()

  if (!token) {
    throw new Error('Expected token as response')
  }

  if (token.error) {
    const message = `Failed fetching token from ${settings.endpoint} with message: ${token.error.message}`
    console.error(message, token)
    throw new Error(message)
  }

  return token
}
