import { useState } from 'react'

function defaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function TransactionForm({ books, members, onSubmit }) {
  const [type, setType] = useState('add')
  const [bookId, setBookId] = useState('')
  const [amount, setAmount] = useState('1')
  const [dueDate, setDueDate] = useState(defaultDueDate)
  const [borrowerId, setBorrowerId] = useState('')
  const [errors, setErrors] = useState({})
  const selectedBook = books.find((book) => book.id === bookId)

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit({ type, bookId, amount, ...(type === 'borrow' ? { dueDate, borrowerId } : {}) })
    if (result.errors) setErrors(result.errors)
    else {
      setErrors({})
      setAmount('1')
    }
  }

  function changeType(nextType) {
    setType(nextType)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="transaction-switch" role="group" aria-label="Transaction type">
        <button className={type === 'add' ? 'selected' : ''} type="button" aria-pressed={type === 'add'} onClick={() => changeType('add')}>＋ Add stock</button>
        <button className={type === 'borrow' ? 'selected deduct' : ''} type="button" aria-pressed={type === 'borrow'} onClick={() => changeType('borrow')}>− Borrow</button>
      </div>
      <p className="transaction-type">{type === 'add' ? 'Record new arrivals' : 'Record a book borrow'}</p>
      <div className="field-grid">
        <div className="field full">
          <label htmlFor="transaction-book">Book</label>
          <select id="transaction-book" value={bookId} onChange={(event) => { setBookId(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.bookId)}>
            <option value="">Choose a book</option>
            {books.map((book) => <option key={book.id} value={book.id}>{book.title} · {book.quantity} available</option>)}
          </select>
          {errors.bookId && <small className="field-error">{errors.bookId}</small>}
        </div>
        <div className="field full">
          <label htmlFor="transaction-amount">Quantity</label>
          <input id="transaction-amount" type="number" min="1" step="1" max={type === 'borrow' ? selectedBook?.quantity : undefined} value={amount} onChange={(event) => { setAmount(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.amount)} />
          {type === 'borrow' && selectedBook && <small className="field-help">{selectedBook.quantity} {selectedBook.quantity === 1 ? 'copy' : 'copies'} available</small>}
          {errors.amount && <small className="field-error">{errors.amount}</small>}
        </div>
        {type === 'borrow' && <div className="field full">
          <label htmlFor="transaction-borrower">Borrower</label>
          <select id="transaction-borrower" value={borrowerId} onChange={(event) => { setBorrowerId(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.borrowerId)}>
            <option value="">Choose a member</option>
            {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
          {errors.borrowerId && <small className="field-error">{errors.borrowerId}</small>}
        </div>}
        {type === 'borrow' && <div className="field full">
          <label htmlFor="transaction-due-date">Return date</label>
          <input id="transaction-due-date" type="date" value={dueDate} onChange={(event) => { setDueDate(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.dueDate)} />
          {errors.dueDate && <small className="field-error">{errors.dueDate}</small>}
        </div>}
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={books.length === 0}>{type === 'add' ? 'Record arrival' : 'Record borrow'}</button>
      </div>
    </form>
  )
}
