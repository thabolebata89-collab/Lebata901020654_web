export default function Toast({ notice }) {
  if (!notice) return null

  return (
    <div className={`toast toast-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'} key={notice.id}>
      <span aria-hidden="true">{notice.type === 'error' ? '!' : '✓'}</span>
      {notice.message}
    </div>
  )
}