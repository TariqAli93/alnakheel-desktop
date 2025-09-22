export async function generateJWT(payload, secret, expiresInSec = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const exp = Math.floor(Date.now() / 1000) + expiresInSec
  const fullPayload = { ...payload, exp }

  const base64url = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const headerEncoded = base64url(header)
  const payloadEncoded = base64url(fullPayload)
  const data = `${headerEncoded}.${payloadEncoded}`

  const enc = new TextEncoder()
  const key = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await window.crypto.subtle.sign('HMAC', key, enc.encode(data))

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${data}.${signatureBase64}`
}
