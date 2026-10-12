import { useState } from 'react'

export default function MemberLoanRow({ loan, onReturn }) {
  const [amount, setAmount] = useState(String(loan.remaining))
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const result = onReturn(loan.id, amount)
    setError(result.errors?.amount ?? result.errors?.loan ?? '')
  }

  return (
    <tr>
      <td><div className="book-title">{loan.bookTitle}</div></td>
      <td>{loan.dueDate}</td>
      <td>{loan.remaining} {loan.remaining === 1 ? 'copy' : 'copies'}</td>
      <td>
        <form className="loan-return-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`return-amount-${loan.id}`}>Copies to return</label>
          <input id={`return-amount-${loan.id}`} type="number" min="1" max={loan.remaining} step="1" value={amount} onChange={(event) => { setAmount(event.target.value); setError('') }} aria-invalid={Boolean(error)} />
          <button className="button button-secondary button-small" type="submit">Return</button>
          {error && <small className="field-error">{error}</small>}
        </form>
      </td>
    </tr>
  )
}