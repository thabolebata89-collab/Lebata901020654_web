import { useState } from 'react'

const blankMember = { name: '', membershipId: '', role: 'Member' }

export default function MemberForm({ member, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => member ? { ...member } : blankMember)
  const [errors, setErrors] = useState({})
  const editing = Boolean(member)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit(values)
    if (result.errors) setErrors(result.errors)
    else if (!editing) {
      setValues(blankMember)
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <div className="field full">
          <label htmlFor="member-name">Full name</label>
          <input id="member-name" name="name" value={values.name} onChange={handleChange} placeholder="e.g. Naledi Mokoena" autoComplete="name" aria-invalid={Boolean(errors.name)} />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </div>
        <div className="field full">
          <label htmlFor="member-id">Membership ID</label>
          <input id="member-id" name="membershipId" value={values.membershipId} onChange={handleChange} placeholder="e.g. KL-26007" autoComplete="off" aria-invalid={Boolean(errors.membershipId)} />
          {errors.membershipId && <small className="field-error">{errors.membershipId}</small>}
        </div>
        <div className="field full">
          <label htmlFor="member-role">Role</label>
          <select id="member-role" name="role" value={values.role} onChange={handleChange} aria-invalid={Boolean(errors.role)}>
            <option>Member</option><option>Librarian</option><option>Admin</option>
          </select>
          {errors.role && <small className="field-error">{errors.role}</small>}
        </div>
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit">{editing ? 'Update member' : 'Add member'}</button>
        {editing && <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}