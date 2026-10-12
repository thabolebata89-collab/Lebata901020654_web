import { useState } from 'react'
import BookForm from '../components/BookForm.jsx'
import BookRow from '../components/BookRow.jsx'
import PageHeading from '../components/PageHeading.jsx'
import useLibrary from '../context/useLibrary.js'

export default function Books() {
  const { books, currentUser, addBook, updateBook, deleteBook, borrowBook } = useLibrary()
  const canManageBooks = currentUser?.role === 'Admin' || currentUser?.role === 'Librarian'
  const isMember = currentUser?.role === 'Member'
  const [editingBook, setEditingBook] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const sortedBooks = [...books]
    .filter((book) => `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(normalizedQuery))
    .sort((first, second) => first.title.localeCompare(second.title))

  function saveBook(values) {
    const result = editingBook ? updateBook(editingBook.id, values) : addBook(values)
    if (result.success) setEditingBook(null)
    return result
  }

  return (
    <>
      <PageHeading eyebrow="LIBRARY DESK / COLLECTION" title="Book collection" subtitle="Add titles, keep details current, and see what's in stock." />
      <div className={canManageBooks ? 'workspace-grid' : undefined}>
        {canManageBooks && (
          <section className="panel form-panel">
            <h2>{editingBook ? 'Update book' : 'Add a book'}</h2>
            <p className="form-intro">{editingBook ? 'Update the catalogue information below.' : 'New arrivals start here. Quantity can be adjusted in stock activity.'}</p>
            <BookForm key={editingBook?.id ?? 'new'} book={editingBook} onSubmit={saveBook} onCancel={() => setEditingBook(null)} />
          </section>
        )}
        <section className="panel table-panel" aria-label="Book collection list">
          <div className="panel-header collection-header">
            <div><h2>All titles</h2><p>ISBN and current quantity{canManageBooks ? '' : ' · View only'}</p></div>
            <div className="collection-tools">
              <label className="search-input-wrap">
                <span aria-hidden="true">⌕</span>
                <input className="search-input" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search titles" aria-label="Search books" />
              </label>
              <span className="table-count">{sortedBooks.length} of {books.length} {books.length === 1 ? 'title' : 'titles'}</span>
            </div>
          </div>
          {books.length === 0 ? <div className="table-empty">No books yet. Add the first title using the form.</div> : (
            sortedBooks.length === 0 ? <div className="table-empty">No books match “{searchQuery}”.</div> : (
            <div className="table-scroll">
              <table className="data-table collection-table">
                <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Quantity</th>{(canManageBooks || isMember) && <th>Actions</th>}</tr></thead>
                <tbody>{sortedBooks.map((book) => <BookRow key={book.id} book={book} onEdit={setEditingBook} onDelete={deleteBook} canManage={canManageBooks} isMember={isMember} onBorrow={borrowBook} />)}</tbody>
              </table>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
