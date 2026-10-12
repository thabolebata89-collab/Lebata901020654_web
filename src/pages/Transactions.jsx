import TransactionForm from '../components/TransactionForm.jsx'
import MemberLoanRow from '../components/MemberLoanRow.jsx'
import PageHeading from '../components/PageHeading.jsx'
import useLibrary from '../context/useLibrary.js'

const dateTime = new Intl.DateTimeFormat(undefined, {
  year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
})

export default function Transactions() {
  const { books, members, transactions, currentUser, myLoans, recordTransaction, returnBook } = useLibrary()
  const canRecordTransactions = currentUser?.role === 'Admin' || currentUser?.role === 'Librarian'
  const memberNames = new Map(members.map((member) => [member.id, member.name]))
  const newestFirst = [...transactions].sort((first, second) => Date.parse(second.timestamp) - Date.parse(first.timestamp))

  return (
    <>
      <PageHeading eyebrow="LIBRARY DESK / INVENTORY" title="Stock activity" subtitle="Record new arrivals and keep every book handover in the log." />
      <div className="transaction-layout">
        {canRecordTransactions ? (
          <section className="panel form-panel">
            <h2>Update availability</h2>
            <p className="form-intro">Stock changes are recorded in the activity history.</p>
            <TransactionForm books={books} members={members} onSubmit={recordTransaction} />
          </section>
        ) : (
          <section className="panel form-panel">
            <h2>Stock activity</h2>
            <p className="form-intro">Only librarians and admins can record stock arrivals and borrows. You can view the transaction history below.</p>
          </section>
        )}
        {currentUser?.role === 'Member' && (
          <section className="panel table-panel member-loans-panel" aria-label="My active loans">
            <div className="panel-header"><div><h2>My active loans</h2><p>Return all or some of the copies you borrowed</p></div><span className="table-count">{myLoans.length} {myLoans.length === 1 ? 'loan' : 'loans'}</span></div>
            {myLoans.length === 0 ? <div className="table-empty">You have no active loans.</div> : (
              <div className="table-scroll">
                <table className="data-table member-loans-table">
                  <thead><tr><th>Book</th><th>Return date</th><th>Outstanding</th><th>Return copies</th></tr></thead>
                  <tbody>{myLoans.map((loan) => <MemberLoanRow key={`${loan.id}-${loan.remaining}`} loan={loan} onReturn={returnBook} />)}</tbody>
                </table>
              </div>
            )}
          </section>
        )}
        <section className="panel table-panel" aria-label="Transaction history">
          <div className="panel-header"><div><h2>Transaction history</h2><p>Newest activity appears first</p></div><span className="table-count">{transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}</span></div>
          {transactions.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">↕</span><h2>No transactions</h2><p>Stock arrivals and loans will appear here.</p></div> : (
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Date / Time</th><th>Book</th><th>Type</th><th>Qty</th><th>Borrower</th><th>By</th></tr></thead>
                <tbody>{newestFirst.map((transaction) => <tr key={transaction.id}>
                  <td>{dateTime.format(new Date(transaction.timestamp))}</td>
                  <td><div className="book-title">{transaction.bookTitle}</div></td>
                  <td><span className={`history-type ${transaction.type}`}><span className="history-mark" aria-hidden="true">{transaction.type === 'add' ? '+' : transaction.type === 'return' ? '↩' : '−'}</span>{transaction.type === 'add' ? 'Arrival' : transaction.type === 'return' ? 'Return' : 'Borrow'}</span></td>
                  <td>{transaction.amount} {transaction.amount === 1 ? 'copy' : 'copies'}</td>
                  <td>{transaction.borrower || '—'}</td>
                  <td>{memberNames.get(transaction.memberId) || 'Library desk'}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
