import { Fragment, useState } from 'react'
import MemberBorrowForm from './MemberBorrowForm.jsx'

export default function BookRow({ book, onEdit, onDelete, canManage, isMember, onBorrow }) {
  const [borrowing, setBorrowing] = useState(false)
  function confirmDelete() {
    if (window.confirm(`Delete ${book.title}? This cannot be undone.`)) onDelete(book.id)
  }

  const stockState = book.quantity === 0
    ? { label: 'Out of stock', className: 'stock-out' }
    : book.quantity === 1
      ? { label: 'Low stock', className: 'stock-low' }
      : { label: 'In stock', className: 'stock-in' }

  return (
    <Fragment>
    <tr>
      <td><div className="book-title">{book.title}</div></td>
      <td>{book.author}</td>
      <td>{book.genre}</td>
      <td>{book.isbn}</td>
      <td><span className={`stock-badge ${stockState.className}`}>{book.quantity} · {stockState.label}</span></td>
      {(canManage || isMember) && <td><div className="table-actions">
        {isMember && <button className="button button-primary button-small" type="button" disabled={book.quantity < 1} onClick={() => setBorrowing(true)}>Borrow</button>}
        {canManage && <button className="button button-secondary button-small" type="button" onClick={() => onEdit(book)}>Edit</button>}
        {canManage && <button className="button button-danger button-small" type="button" onClick={confirmDelete}>Delete</button>}
      </div></td>}
    </tr>
    {borrowing && isMember && <tr className="borrow-form-row"><td colSpan={canManage || isMember ? 6 : 5}>
      <div><strong>Borrow {book.title}</strong><MemberBorrowForm book={book} onSubmit={onBorrow} onCancel={() => setBorrowing(false)} /></div>
    </td></tr>}
    </Fragment>
  )
}
