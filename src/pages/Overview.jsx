import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading.jsx'
import useLibrary from '../context/useLibrary.js'
import CountUp from '../components/CountUp.jsx'

const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
const todayLabel = dateLabel.format(new Date())
const dueDateLabel = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function StatCard({ label, value, icon, alert = false }) {
  return <article className={`stat-card${alert ? ' alert' : ''}`}>
    <div className="stat-top"><span>{label}</span><span className="stat-icon" aria-hidden="true">{icon}</span></div>
    <div className="stat-number"><CountUp value={value} /></div>
  </article>
}

export default function Overview() {
  const { books, members, transactions } = useLibrary()
  const copyCount = books.reduce((total, book) => total + book.quantity, 0)
  const lowStockCount = books.filter((book) => book.quantity < 2).length
  const sortedBooks = [...books].sort((first, second) => first.quantity - second.quantity || first.title.localeCompare(second.title))
  const today = localDateKey()
  const overdueLoans = transactions.filter((transaction) => transaction.type === 'borrow'
    && transaction.dueDate && today > transaction.dueDate)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
  const overdueBookIds = new Set(overdueLoans.map((transaction) => transaction.bookId))
  const memberNames = new Map(members.map((member) => [member.id, member.name]))

  return (
    <>
      <PageHeading eyebrow="KHANYA LIBRARY / OVERVIEW" title="Khanya Library" subtitle="A quick look at your collection and today's availability." date={todayLabel} />
      <section className="overview-banner" aria-label="Library welcome">
        <div className="banner-copy">
          <p className="banner-kicker">KNOWLEDGE THAT LIGHTS THE WAY.</p>
          <h2>Every book finds its next reader.</h2>
          <p>Keep the collection in good order, one thoughtful handover at a time.</p>
        </div>
        <div className="banner-mark" aria-hidden="true">K</div>
      </section>
      <section className="stats-grid" aria-label="Collection summary">
        <StatCard label="Titles in collection" value={books.length} icon="▤" />
        <StatCard label="Copies on the shelf" value={copyCount} icon="▣" />
        <StatCard label="Running low — fewer than 2 copies" value={lowStockCount} icon="!" alert={lowStockCount > 0} />
        <StatCard label="Overdue loans" value={overdueLoans.length} icon="!" alert={overdueLoans.length > 0} />
      </section>
      <section className="overdue-section" aria-labelledby="overdue-title">
        <div className="section-heading"><h2 id="overdue-title">Overdue loans</h2><span className="overdue-count">{overdueLoans.length} {overdueLoans.length === 1 ? 'loan' : 'loans'}</span></div>
        <div className="panel table-panel">
          {overdueLoans.length === 0 ? <p className="overdue-empty">No overdue loans.</p> : <div className="table-scroll"><table className="data-table overdue-table">
            <thead><tr><th>Book</th><th>Due date</th><th>Copies</th><th>By</th></tr></thead>
            <tbody>{overdueLoans.map((loan) => <tr key={loan.id}>
              <td><div className="book-title">{loan.bookTitle}</div></td>
              <td><span className="overdue-date">{dueDateLabel.format(new Date(`${loan.dueDate}T00:00:00Z`))}</span></td>
              <td>{loan.amount} {loan.amount === 1 ? 'copy' : 'copies'}</td>
              <td>{loan.borrower || memberNames.get(loan.memberId) || 'Library desk'}</td>
            </tr>)}</tbody>
          </table></div>}
        </div>
      </section>
      <section aria-labelledby="availability-title">
        <div className="section-heading">
          <h2 id="availability-title">Book availability</h2>
          <Link className="text-link" to="/books">Manage collection <span aria-hidden="true">→</span></Link>
        </div>
        <div className="panel table-panel">
          {books.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">▤</span>
              <h2>No books yet</h2>
              <p>Add your first title to see availability here.</p>
              <Link className="button button-primary" to="/books">Add a book</Link>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="data-table dashboard-table">
                <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Availability</th></tr></thead>
                <tbody>{sortedBooks.map((book) => <tr key={book.id} className={overdueBookIds.has(book.id) ? 'overdue-book-row' : undefined}>
                  <td><div className="book-title">{book.title}</div></td>
                  <td>{book.author}</td><td>{book.genre}</td><td>{book.isbn}</td>
                  <td><span className={`stock-badge ${book.quantity === 0 ? 'stock-out' : book.quantity === 1 ? 'stock-low' : 'stock-in'}`}>{book.quantity === 0 ? 'Out of stock' : book.quantity === 1 ? 'Low stock' : 'In stock'} · {book.quantity}</span></td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      {transactions.length > 0 && <p className="dashboard-footnote">{transactions.length} stock {transactions.length === 1 ? 'update' : 'updates'} recorded in the activity log.</p>}
    </>
  )
}