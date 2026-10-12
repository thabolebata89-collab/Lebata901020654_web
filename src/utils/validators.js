export function normalizeISBN(value) {
  return String(value ?? '').replace(/[\s-]/g, '').toUpperCase()
}

export function isValidISBN(value) {
  const isbn = normalizeISBN(value)
  return /^\d{9}[\dX]$/.test(isbn) || /^\d{13}$/.test(isbn)
}

export function validateBook(values, books, editingId = null) {
  const errors = {}
  const title = String(values.title ?? '').trim()
  const author = String(values.author ?? '').trim()
  const genre = String(values.genre ?? '').trim()
  const isbn = normalizeISBN(values.isbn)
  const quantity = Number(values.quantity)

  if (!title) errors.title = 'Enter a book title.'
  if (!author) errors.author = 'Enter an author name.'
  if (!genre) errors.genre = 'Choose or enter a genre.'
  if (!isbn) errors.isbn = 'Enter an ISBN.'
  else if (!isValidISBN(isbn)) errors.isbn = 'Enter a valid ISBN-10 or ISBN-13.'
  else if (books.some((book) => book.id !== editingId && normalizeISBN(book.isbn) === isbn)) {
    errors.isbn = 'A book with this ISBN already exists.'
  }
  if (values.quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    errors.quantity = 'Quantity must be a whole number of zero or more.'
  }

  return errors
}

export function validateUser(values, users, editingId = null) {
  const errors = {}
  const name = String(values.name ?? '').trim()
  const membershipId = String(values.membershipId ?? '').trim()

  if (!name) errors.name = 'Enter the member name.'
  if (!membershipId) errors.membershipId = 'Enter a membership ID.'
  else if (users.some((user) => user.id !== editingId && user.membershipId.toLowerCase() === membershipId.toLowerCase())) {
    errors.membershipId = 'This membership ID is already registered.'
  }
  if (!['Librarian', 'Admin', 'Member'].includes(values.role)) errors.role = 'Choose a valid role.'

  return errors
}

export function validateLogin(values, users) {
  const name = String(values.name ?? '').trim()
  const membershipId = String(values.membershipId ?? '').trim()

  if (!name || !membershipId) return { error: 'No matching member found. Check your name and ID.' }
  const user = users.find((entry) => entry.name.toLowerCase() === name.toLowerCase()
    && entry.membershipId.toLowerCase() === membershipId.toLowerCase())
  return user ? { user } : { error: 'No matching member found. Check your name and ID.' }
}

export function validateTransaction(values, books, members = null) {
  const errors = {}
  const amount = Number(values.amount)
  const book = books.find((entry) => entry.id === values.bookId)

  if (!book) errors.bookId = 'Choose a book from the collection.'
  if (values.type === 'borrow') {
    const dueDate = String(values.dueDate ?? '')
    const parsedDueDate = new Date(`${dueDate}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || Number.isNaN(parsedDueDate.getTime())
      || parsedDueDate.toISOString().slice(0, 10) !== dueDate) {
      errors.dueDate = 'Choose a valid return date.'
    }
    if (members) {
      const borrowerId = String(values.borrowerId ?? '')
      if (!members.some((member) => member.id === borrowerId)) errors.borrowerId = 'Choose a borrower from the member list.'
    }
  }
  if (!Number.isInteger(amount) || amount < 1) errors.amount = 'Enter a whole-number quantity of at least 1.'
  else if (values.type === 'borrow' && book && amount > book.quantity) {
    errors.amount = `Only ${book.quantity} copies available.`
  }

  return errors
}
