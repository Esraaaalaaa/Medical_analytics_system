export const CREDENTIALS = {
  admin:     { username: 'admin',     password: 'admin'        },
  director:  { username: 'director',  password: 'director123'  },
  president: { username: 'president', password: 'president123' },
  secretary: { username: 'secretary', password: 'secretary123' },
}

export function validateCredentials(role, username, password) {
  const creds = CREDENTIALS[role]
  if (!creds) return false
  return creds.username === username.trim() && creds.password === password
}
