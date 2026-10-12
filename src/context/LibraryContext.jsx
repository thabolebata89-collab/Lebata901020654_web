import { useCallback, useEffect, useMemo, useState } from 'react'
import LibraryContext from './LibraryContext.js'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/localStorage.js'
import { normalizeISBN, validateBook, validateLogin, validateTransaction, validateUser } from '../utils/validators.js'

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function initialList(key) {
  const stored = readStorage(key, [])
  return Array.isArray(stored) ? stored : []
}

function canManageLibrary(currentUser) {
  return currentUser?.role === 'Admin' || currentUser?.role === 'Librarian'
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => initialList(STORAGE_KEYS.books))
  const [members, setMembers] = useState(() => initialList(STORAGE_KEYS.members))
  const [transactions, setTransactions] = useState(() => initialList(STORAGE_KEYS.transactions))
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.session, null))
  const [notice, setNotice] = useState(null)

  useEffect(() => { writeStorage(STORAGE_KEYS.books, books) }, [books])
  useEffect(() => { writeStorage(STORAGE_KEYS.members, members) }, [members])
  useEffect(() => { writeStorage(STORAGE_KEYS.transactions, transactions) }, [transactions])
  useEffect(() => { writeStorage(STORAGE_KEYS.session, currentUser) }, [currentUser])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const notify = useCallback((message, type = 'success') => {
    setNotice({ message, type, id: makeId() })
  }, [])

  const addBook = useCallback((values) => {
    if (!canManageLibrary(currentUser)) {
      const error = 'Only librarians and admins can manage books.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const errors = validateBook(values, books)
    if (Object.keys(errors).length) {
      notify(Object.values(errors)[0], 'error')
      return { errors }
    }
    const book = {
      id: makeId(),
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre.trim(),
      isbn: normalizeISBN(values.isbn),
      quantity: Number(values.quantity),
      addedAt: new Date().toISOString(),
    }
    setBooks((previous) => [book, ...previous])
    notify(`Added ${book.title} to collection`)
    return { success: true }
  }, [books, currentUser, notify])

  const updateBook = useCallback((id, values) => {
    if (!canManageLibrary(currentUser)) {
      const error = 'Only librarians and admins can manage books.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const errors = validateBook(values, books, id)
    if (Object.keys(errors).length) {
      notify(Object.values(errors)[0], 'error')
      return { errors }
    }
    setBooks((previous) => previous.map((book) => book.id === id ? {
      ...book,
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre.trim(),
      isbn: normalizeISBN(values.isbn),
      quantity: Number(values.quantity),
    } : book))
    const updatedBook = books.find((book) => book.id === id)
    notify(`Updated ${values.title.trim() || updatedBook?.title || 'book'}`)
    return { success: true }
  }, [books, currentUser, notify])

  const deleteBook = useCallback((id) => {
    if (!canManageLibrary(currentUser)) {
      notify('Only librarians and admins can manage books.', 'error')
      return
    }
    const book = books.find((entry) => entry.id === id)
    setBooks((previous) => previous.filter((entry) => entry.id !== id))
    if (book) notify(`Deleted ${book.title}`)
  }, [books, currentUser, notify])

  const addUser = useCallback((values) => {
    if (currentUser?.role !== 'Admin') {
      const error = 'Only an administrator can manage member accounts.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const errors = validateUser(values, members)
    if (Object.keys(errors).length) {
      notify(Object.values(errors)[0], 'error')
      return { errors }
    }
    const member = {
      id: makeId(),
      name: values.name.trim(),
      membershipId: values.membershipId.trim(),
      role: values.role,
      joinedAt: new Date().toISOString(),
    }
    setMembers((previous) => [member, ...previous])
    notify(`Added ${member.name} to members`)
    return { success: true }
  }, [currentUser, members, notify])

  const updateUser = useCallback((id, values) => {
    if (currentUser?.role !== 'Admin') {
      const error = 'Only an administrator can manage member accounts.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const errors = validateUser(values, members, id)
    if (Object.keys(errors).length) {
      notify(Object.values(errors)[0], 'error')
      return { errors }
    }
    const updated = {
      ...members.find((member) => member.id === id),
      name: values.name.trim(),
      membershipId: values.membershipId.trim(),
      role: values.role,
    }
    setMembers((previous) => previous.map((member) => member.id === id ? updated : member))
    if (currentUser?.id === id) setCurrentUser(updated)
    notify(`Updated ${updated.name}`)
    return { success: true }
  }, [currentUser, members, notify])

  const deleteUser = useCallback((id) => {
    if (currentUser?.role !== 'Admin') {
      notify('Only an administrator can manage member accounts.', 'error')
      return
    }
    const member = members.find((entry) => entry.id === id)
    setMembers((previous) => previous.filter((entry) => entry.id !== id))
    if (currentUser?.id === id) setCurrentUser(null)
    if (member) notify(`Deleted ${member.name}`)
  }, [currentUser, members, notify])

  const login = useCallback((values) => {
    const result = validateLogin(values, members)
    if (result.error) {
      notify(result.error, 'error')
      return result
    }
    setCurrentUser(result.user)
    notify(`Signed in as ${result.user.name}`)
    return { success: true }
  }, [members, notify])

  const logout = useCallback(() => {
    setCurrentUser(null)
    notify('You have signed out.')
  }, [notify])

  const createTransaction = useCallback((values, borrower) => {
    const errors = validateTransaction(values, books, values.type === 'borrow' ? members : null)
    if (Object.keys(errors).length) {
      notify(Object.values(errors)[0], 'error')
      return { errors }
    }
    const book = books.find((entry) => entry.id === values.bookId)
    const amount = Number(values.amount)
    const transaction = {
      id: makeId(),
      bookId: book.id,
      bookTitle: book.title,
      type: values.type,
      amount,
      timestamp: new Date().toISOString(),
      ...(values.type === 'borrow' ? { dueDate: values.dueDate, borrower: borrower.name } : {}),
      ...(currentUser ? { memberId: currentUser.id } : {}),
    }
    setBooks((previous) => previous.map((entry) => entry.id === book.id
      ? { ...entry, quantity: entry.quantity + (values.type === 'add' ? amount : -amount) }
      : entry))
    setTransactions((previous) => [transaction, ...previous])
    notify(values.type === 'add' ? `Recorded arrival for ${book.title}` : `Recorded borrow for ${book.title}`)
    return { success: true }
  }, [books, currentUser, members, notify])

  const recordTransaction = useCallback((values) => {
    if (!canManageLibrary(currentUser)) {
      const error = 'Only librarians and admins can record stock activity.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const borrower = values.type === 'borrow' ? members.find((member) => member.id === values.borrowerId) : null
    return createTransaction(values, borrower)
  }, [createTransaction, currentUser, members, notify])

  const borrowBook = useCallback((values) => {
    if (currentUser?.role !== 'Member') {
      const error = 'Sign in as a member to borrow books.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const borrower = members.find((member) => member.id === currentUser.id)
    return createTransaction({ ...values, type: 'borrow', borrowerId: currentUser.id }, borrower)
  }, [createTransaction, currentUser, members, notify])

  const returnBook = useCallback((loanId, amountValue) => {
    if (currentUser?.role !== 'Member') {
      const error = 'Sign in as a member to return books.'
      notify(error, 'error')
      return { errors: { permission: error } }
    }
    const loan = transactions.find((entry) => entry.id === loanId
      && entry.type === 'borrow' && entry.memberId === currentUser.id)
    if (!loan) {
      const error = 'This loan could not be found in your account.'
      notify(error, 'error')
      return { errors: { loan: error } }
    }
    const returnedAmount = transactions
      .filter((entry) => entry.type === 'return' && entry.loanId === loan.id)
      .reduce((total, entry) => total + entry.amount, 0)
    const remaining = loan.amount - returnedAmount
    const amount = Number(amountValue)
    if (!Number.isInteger(amount) || amount < 1 || amount > remaining) {
      const error = `Enter a quantity from 1 to ${remaining}.`
      notify(error, 'error')
      return { errors: { amount: error } }
    }

    const transaction = {
      id: makeId(),
      loanId: loan.id,
      bookId: loan.bookId,
      bookTitle: loan.bookTitle,
      type: 'return',
      amount,
      timestamp: new Date().toISOString(),
      borrower: currentUser.name,
      memberId: currentUser.id,
    }
    setBooks((previous) => previous.map((book) => book.id === loan.bookId
      ? { ...book, quantity: book.quantity + amount }
      : book))
    setTransactions((previous) => [transaction, ...previous])
    notify(`Returned ${amount} ${amount === 1 ? 'copy' : 'copies'} of ${loan.bookTitle}`)
    return { success: true }
  }, [currentUser, notify, transactions])

  const myLoans = useMemo(() => {
    if (currentUser?.role !== 'Member') return []
    return transactions
      .filter((entry) => entry.type === 'borrow' && entry.memberId === currentUser.id)
      .map((loan) => ({
        ...loan,
        remaining: loan.amount - transactions
          .filter((entry) => entry.type === 'return' && entry.loanId === loan.id)
          .reduce((total, entry) => total + entry.amount, 0),
      }))
      .filter((loan) => loan.remaining > 0)
      .sort((first, second) => Date.parse(second.timestamp) - Date.parse(first.timestamp))
  }, [currentUser, transactions])

  const value = useMemo(() => ({
    books, members, transactions, currentUser, notice, myLoans, addBook, updateBook, deleteBook,
    addMember: addUser, updateMember: updateUser, deleteMember: deleteUser, login, logout, recordTransaction, borrowBook, returnBook,
  }), [books, members, transactions, currentUser, notice, addBook, updateBook, deleteBook,
    myLoans, addUser, updateUser, deleteUser, login, logout, recordTransaction, borrowBook, returnBook])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}