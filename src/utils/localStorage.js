export const STORAGE_KEYS = {
  books: 'kl_books',
  members: 'kl_members',
  transactions: 'kl_transactions',
  session: 'kl_session',
}

export function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}