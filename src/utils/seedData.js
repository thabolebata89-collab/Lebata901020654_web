import { STORAGE_KEYS } from './localStorage.js'

const SEED_MARKER = 'khanya-library.seeded-v1'
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

export const SEED_DATA = {
  books: [
    { id: 'kl-book-001', title: 'Mopheme', author: 'Sebolai Matlosa', genre: 'Folklore', isbn: '978-99911-0-001-1', quantity: 4, addedAt: daysAgo(40) },
    { id: 'kl-book-002', title: 'Masoabi ke Moloi', author: 'S.M. Mofokeng', genre: 'Fiction', isbn: '978-99911-0-002-8', quantity: 3, addedAt: daysAgo(37) },
    { id: 'kl-book-003', title: "Lits'omo tsa Basotho", author: 'Traditional', genre: 'Folklore', isbn: '978-99911-0-003-5', quantity: 2, addedAt: daysAgo(34) },
    { id: 'kl-book-004', title: "'Makotulo", author: 'S.M. Mofokeng', genre: 'Fiction', isbn: '978-99911-0-004-2', quantity: 1, addedAt: daysAgo(31) },
    { id: 'kl-book-005', title: 'How to Solve It', author: 'George Polya', genre: 'Mathematics', isbn: '978-0-691-11966-3', quantity: 5, addedAt: daysAgo(28) },
    { id: 'kl-book-006', title: 'The Joy of X', author: 'Steven Strogatz', genre: 'Mathematics', isbn: '978-0-547-51765-0', quantity: 0, addedAt: daysAgo(25) },
    { id: 'kl-book-007', title: 'Phutha-lichaba', author: 'NEO Lebajoa', genre: 'Fiction', isbn: '978-99911-0-007-3', quantity: 3, addedAt: daysAgo(22) },
    { id: 'kl-book-008', title: 'Namane e Selota', author: 'Thabo Metsing David', genre: 'Fiction', isbn: '978-99911-0-008-0', quantity: 2, addedAt: daysAgo(19) },
    { id: 'kl-book-009', title: 'Math Becomes a Hobby', author: 'Manyarela Leutsoa Lenkoe', genre: 'Mathematics', isbn: '978-99911-0-009-7', quantity: 2, addedAt: daysAgo(16) },
    { id: 'kl-book-010', title: 'Before All the People Died', author: 'Sarafina Samuel Moses', genre: 'Fiction', isbn: '978-99911-0-010-3', quantity: 1, addedAt: daysAgo(13) },
  ],
  members: [
    { id: 'kl-member-001', name: 'Lebata Neo', membershipId: 'KL-26001', role: 'Admin', joinedAt: daysAgo(120) },
    { id: 'kl-member-002', name: 'Korotsoane Thetso', membershipId: 'KL-26002', role: 'Librarian', joinedAt: daysAgo(98) },
    { id: 'kl-member-003', name: 'Lineo Lehloenya', membershipId: 'KL-26003', role: 'Member', joinedAt: daysAgo(75) },
    { id: 'kl-member-004', name: 'Phamotse Khoetha', membershipId: 'KL-26004', role: 'Member', joinedAt: daysAgo(52) },
    { id: 'kl-member-005', name: 'Pulane Letsoela', membershipId: 'KL-26005', role: 'Member', joinedAt: daysAgo(29) },
    { id: 'kl-member-006', name: 'Leseli Tlomo', membershipId: 'KL-26006', role: 'Member', joinedAt: daysAgo(8) },
  ],
  transactions: [
    { id: 'kl-transaction-001', bookId: 'kl-book-007', bookTitle: 'Phutha-lichaba', type: 'add', amount: 2, timestamp: daysAgo(1), memberId: 'kl-member-001' },
    { id: 'kl-transaction-002', bookId: 'kl-book-004', bookTitle: "'Makotulo", type: 'borrow', amount: 1, timestamp: daysAgo(2), memberId: 'kl-member-003' },
    { id: 'kl-transaction-003', bookId: 'kl-book-001', bookTitle: 'Mopheme', type: 'add', amount: 1, timestamp: daysAgo(3), memberId: 'kl-member-002' },
    { id: 'kl-transaction-004', bookId: 'kl-book-006', bookTitle: 'The Joy of X', type: 'borrow', amount: 1, timestamp: daysAgo(4), memberId: 'kl-member-004' },
    { id: 'kl-transaction-005', bookId: 'kl-book-005', bookTitle: 'How to Solve It', type: 'borrow', amount: 1, timestamp: daysAgo(5), memberId: 'kl-member-005' },
    { id: 'kl-transaction-006', bookId: 'kl-book-010', bookTitle: 'Before All the People Died', type: 'add', amount: 1, timestamp: daysAgo(6), memberId: 'kl-member-006' },
  ],
}

export function seedLocalStorage(storage = window.localStorage) {
  try {
    if (storage.getItem(SEED_MARKER)) return false

    const hasExistingRecords = [STORAGE_KEYS.books, STORAGE_KEYS.members, STORAGE_KEYS.transactions]
      .some((key) => {
        try {
          const value = JSON.parse(storage.getItem(key) ?? 'null')
          return Array.isArray(value) && value.length > 0
        } catch {
          return false
        }
      })

    if (!hasExistingRecords) {
      storage.setItem(STORAGE_KEYS.books, JSON.stringify(SEED_DATA.books))
      storage.setItem(STORAGE_KEYS.members, JSON.stringify(SEED_DATA.members))
      storage.setItem(STORAGE_KEYS.transactions, JSON.stringify(SEED_DATA.transactions))
    }

    storage.setItem(SEED_MARKER, 'true')
    return !hasExistingRecords
  } catch {
    return false
  }
}
