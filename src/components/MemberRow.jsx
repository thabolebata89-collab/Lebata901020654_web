const joinedDate = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

export default function MemberRow({ member, onEdit, onDelete }) {
  function confirmDelete() {
    if (window.confirm(`Delete ${member.name}? This cannot be undone.`)) onDelete(member.id)
  }

  return (
    <tr>
      <td><div className="book-title">{member.name}</div></td>
      <td>{member.membershipId}</td>
      <td><span className="role-pill">{member.role}</span></td>
      <td>{member.joinedAt ? joinedDate.format(new Date(member.joinedAt)) : '—'}</td>
      <td><div className="table-actions">
        <button className="button button-secondary button-small" type="button" onClick={() => onEdit(member)}>Edit</button>
        <button className="button button-danger button-small" type="button" onClick={confirmDelete}>Delete</button>
      </div></td>
    </tr>
  )
}