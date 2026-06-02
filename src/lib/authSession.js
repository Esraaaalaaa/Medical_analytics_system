const SESSION_KEY = 'uh-connect-session'

export function setSession({ role, username }) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ role, username }))
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
