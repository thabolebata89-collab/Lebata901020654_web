import { useState } from 'react'

const blankBook = { title: '', author: '', genre: '', isbn: '', quantity: '0' }

export default function BookForm({ book, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => book ? { ...book, quantity: String(book.quantity) } : blankBook)
  const [errors, setErrors] = useState({})
  const editing = Boolean(book)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined, form: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit(values)
    if (result.errors) setErrors(result.errors)
    else {
      setErrors({})
      if (!editing) setValues(blankBook)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <div className="field full">
          <label htmlFor="book-title">Book title</label>
          <input id="book-title" name="title" value={values.title} onChange={handleChange} placeholder="e.g. The Secret Garden" autoComplete="off" aria-invalid={Boolean(errors.title)} />
          {errors.title && <small className="field-error">{errors.title}</small>}
        </div>
        <div className="field full">
          <label htmlFor="book-author">Author</label>
          <input id="book-author" name="author" value={values.author} onChange={handleChange} placeholder="e.g. Frances Hodgson Burnett" autoComplete="off" aria-invalid={Boolean(errors.author)} />
          {errors.author && <small className="field-error">{errors.author}</small>}
        </div>
        <div className="field">
          <label htmlFor="book-genre">Genre</label>
          <input id="book-genre" name="genre" value={values.genre} onChange={handleChange} placeholder="e.g. Fiction" list="book-genres" autoComplete="off" aria-invalid={Boolean(errors.genre)} />
          <datalist id="book-genres"><option value="Fiction" /><option value="Non-fiction" /><option value="Children's" /><option value="Mystery" /><option value="History" /><option value="Science" /></datalist>
          {errors.genre && <small className="field-error">{errors.genre}</small>}
        </div>
        <div className="field">
          <label htmlFor="book-isbn">ISBN</label>
          <input id="book-isbn" name="isbn" value={values.isbn} onChange={handleChange} placeholder="978-0-00-000000-0" autoComplete="off" aria-invalid={Boolean(errors.isbn)} />
          {errors.isbn && <small className="field-error">{errors.isbn}</small>}
        </div>
        <div className="field full">
          <label htmlFor="book-quantity">{editing ? 'Quantity' : 'Initial quantity'}</label>
          <input id="book-quantity" name="quantity" type="number" min="0" step="1" value={values.quantity} onChange={handleChange} aria-invalid={Boolean(errors.quantity)} />
          {errors.quantity && <small className="field-error">{errors.quantity}</small>}
        </div>
      </div>
      {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
      <div className="form-actions">
        <button className="button button-primary" type="submit">{editing ? 'Update book' : 'Add to collection'}</button>
        {editing && <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
