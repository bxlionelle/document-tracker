import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [users, setUsers]       = useState([])
  const [documents, setDocuments] = useState([])
  const [tab, setTab] = useState('documents')

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard')
    api.get('/users').then(res => setUsers(res.data))
    api.get('/documents').then(res => setDocuments(res.data.data))
  }, [user])

  const changeRole = async (userId, role) => {
    await api.put(`/users/${userId}`, { role })
    const res = await api.get('/users')
    setUsers(res.data)
  }

  const deleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return
    await api.delete(`/documents/${id}`)
    setDocuments(documents.filter(d => d.id !== id))
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Admin Panel</h1>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['documents', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            background: tab === t ? '#2563eb' : '#f1f5f9',
            color: tab === t ? '#fff' : '#374151',
            border: 'none', fontWeight: 600,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'documents' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Title', 'Department', 'User', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ background: '#f1f5f9', padding: '12px 16px',
                  textAlign: 'left', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {doc.title}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {doc.department?.name}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {doc.user?.name}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {doc.status}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <button onClick={() => deleteDoc(doc.id)} style={{
                    padding: '6px 12px', background: '#fee2e2', color: '#991b1b',
                    border: 'none', borderRadius: 6, cursor: 'pointer'
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Department', 'Role', 'Change Role'].map(h => (
                <th key={h} style={{ background: '#f1f5f9', padding: '12px 16px',
                  textAlign: 'left', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {u.name}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {u.email}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  {u.department?.name || '—'}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <b>{u.role}</b>
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                  >
                    <option value="staff">staff</option>
                    <option value="dept_head">dept_head</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}