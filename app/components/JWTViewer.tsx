"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface DecodedJWT {
  header: any
  payload: any
}

export default function JWTViewer() {
  const { data: session } = useSession()
  const [decodedToken, setDecodedToken] = useState<DecodedJWT | null>(null)
  const [rawToken, setRawToken] = useState<string>('')

  useEffect(() => {
    // Get JWT from cookies
    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find(cookie =>
      cookie.trim().startsWith('next-auth.session-token=') ||
      cookie.trim().startsWith('__Secure-next-auth.session-token=')
    )

    if (sessionCookie) {
      const token = sessionCookie.split('=')[1]
      setRawToken(token)

      try {
        // Decode JWT (it's base64 encoded)
        const parts = token.split('.')

        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]))
          const payload = JSON.parse(atob(parts[1]))

          setDecodedToken({ header, payload })
        }
      } catch (error) {
        console.error('Failed to decode JWT:', error)
      }
    }
  }, [session])

  if (!session) {
    return (
      <div className="p-4 border rounded">
        <p className="text-red-500">Not logged in</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="border rounded p-4">
        <h2 className="text-xl font-bold mb-2">Session Data</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {decodedToken && (
        <>
          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">JWT Header</h2>
            <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
              {JSON.stringify(decodedToken.header, null, 2)}
            </pre>
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">JWT Payload</h2>
            <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
              {JSON.stringify(decodedToken.payload, null, 2)}
            </pre>
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">Raw JWT Token</h2>
            <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs break-all">
              {rawToken}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
