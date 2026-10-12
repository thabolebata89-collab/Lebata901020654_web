import { useState } from 'react'
import MemberForm from '../components/MemberForm.jsx'
import MemberRow from '../components/MemberRow.jsx'
import PageHeading from '../components/PageHeading.jsx'
import useLibrary from '../context/useLibrary.js'

export default function Members() {
  const { members, currentUser, addMember, updateMember, deleteMember, login, logout } = useLibrary()
  const [editingMember, setEditingMember] = useState(null)
  const [credentials, setCredentials] = useState({ name: '', membershipId: '' })
  const [loginError, setLoginError] = useState('')
  const canManageMembers = currentUser?.role === 'Admin'
  const sortedMembers = [...members].sort((first, second) => first.name.localeCompare(second.name))

  function handleLogin(event) {
    event.preventDefault()
    const result = login(credentials)
    setLoginError(result.error ?? '')
    if (result.success) setCredentials({ name: '', membershipId: '' })
  }

  function handleCredentialChange(event) {
    const { name, value } = event.target
    setCredentials((previous) => ({ ...previous, [name]: value }))
    setLoginError('')
  }

  function handleLogout() {
    logout()
    setCredentials({ name: '', membershipId: '' })
    setLoginError('')
  }

  function saveMember(values) {
    const result = editingMember ? updateMember(editingMember.id, values) : addMember(values)
    if (result.success) setEditingMember(null)
    return result
  }

  return (
    <>
      <PageHeading eyebrow="KHANYA LIBRARY / MEMBERS" title="Members &amp; access" subtitle="Manage library accounts and sign in to attribute stock activity." />
      <section className="panel login-panel" aria-label="Member sign in">
        <div className="login-aside">
          <div><p className="eyebrow">YOUR LIBRARY, TOGETHER</p><h2>Welcome back to the reading room.</h2><p>Sign in with your registered name and membership ID.</p></div>
          <span className="login-decoration" aria-hidden="true">open a book.</span>
        </div>
        <div className="login-form-wrap">
          {currentUser ? (
            <div className="signed-in"><span className="avatar">{currentUser.name.slice(0, 1).toUpperCase()}</span><div className="signed-in-copy"><strong>Signed in as {currentUser.name}</strong><span>{currentUser.membershipId} · {currentUser.role}</span></div><button className="button button-secondary button-small" type="button" onClick={handleLogout}>Sign out</button></div>
          ) : (
            <div className="form-panel">
              <h2>Member sign in</h2>
              <p className="form-intro">{members.length ? 'Use the details from your member account.' : 'Contact an administrator to create a member account.'}</p>
              <form onSubmit={handleLogin} noValidate>
                <div className="field-grid">
                  <div className="field full"><label htmlFor="login-name">Full name</label><input id="login-name" name="name" value={credentials.name} onChange={handleCredentialChange} autoComplete="name" placeholder="Your registered name" aria-invalid={Boolean(loginError)} /></div>
                  <div className="field full"><label htmlFor="login-membership-id">Membership ID</label><input id="login-membership-id" name="membershipId" value={credentials.membershipId} onChange={handleCredentialChange} autoComplete="username" placeholder="Your membership ID" aria-invalid={Boolean(loginError)} /></div>
                </div>
                {loginError && <p className="form-error" role="alert">{loginError}</p>}
                <div className="form-actions"><button className="button button-primary" type="submit">Sign in</button></div>
              </form>
            </div>
          )}
        </div>
      </section>
      {canManageMembers ? (
        <>
          <div className="section-heading users-section-heading"><h2>Admin view · Member management</h2><span className="table-count">{members.length} {members.length === 1 ? 'member' : 'members'}</span></div>
          <div className="workspace-grid">
            <section className="panel form-panel">
              <h2>{editingMember ? 'Update member' : 'Add a member'}</h2>
              <p className="form-intro">Create a library account or update an existing one.</p>
              <MemberForm key={editingMember?.id ?? 'new'} member={editingMember} onSubmit={saveMember} onCancel={() => setEditingMember(null)} />
            </section>
            <section className="panel table-panel" aria-label="Member management list">
              <div className="panel-header"><div><h2>Registered members</h2><p>Name, membership ID, and role</p></div><span className="table-count">{members.length} total</span></div>
              {members.length === 0 ? <div className="table-empty">No members yet. Add the first member using the form.</div> : (
                <div className="table-scroll">
                  <table className="data-table member-table">
                    <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>{sortedMembers.map((member) => <MemberRow key={member.id} member={member} onEdit={setEditingMember} onDelete={deleteMember} />)}</tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      ) : (
        <section className="panel form-panel" aria-label="Member management access">
          <h2>Member management</h2>
          <p className="form-intro">The member directory and account management tools are available to administrators after sign-in.</p>
        </section>
      )}
    </>
  )
}
