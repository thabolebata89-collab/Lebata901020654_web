import { useState } from 'react'

function defaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function MemberBorrowForm({ book, onSubmit, onCancel }) {
  const [amount, setAmount] = useState('1')
  const [dueDate, setDueDate] = useState(defaultDueDate)
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit({ bookId: book.id, amount, dueDate })
    if (result.errors) setErrors(result.errors)
    else onCancel()
  }

  return (
    <form className="member-borrow-form" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <div className="field">
          <label htmlFor={`borrow-amount-${book.id}`}>Quantity</label>
          <input id={`borrow-amount-${book.id}`} type="number" min="1" max={book.quantity} step="1" value={amount} onChange={(event) => { setAmount(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.amount)} />
          {errors.amount && <small className="field-error">{errors.amount}</small>}
        </div>
        <div className="field">
          <label htmlFor={`borrow-due-date-${book.id}`}>Return date</label>
          <input id={`borrow-due-date-${book.id}`} type="date" value={dueDate} onChange={(event) => { setDueDate(event.target.value); setErrors({}) }} aria-invalid={Boolean(errors.dueDate)} />
          {errors.dueDate && <small className="field-error">{errors.dueDate}</small>}
        </div>
      </div>
      <div className="form-actions">
        <button className="button button-primary button-small" type="submit">Confirm borrow</button>
        <button className="button button-secondary button-small" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
