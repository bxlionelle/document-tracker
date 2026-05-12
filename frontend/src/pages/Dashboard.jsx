import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUS_COLORS = {
  pending:  { bg: '#fef3c7', text: '#92400e' },
  approved: { bg: '#d1fae5', text: '#065f46' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
  archived: { bg: '#e5e7eb', text: '#374151' },
}

export default function Dashboard() {
  const { user, logout }   = useAuth()
  const [documents, setDocuments] = useState([])
  const [departments, setDepartments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', department_id: '' })
  const [loading, setLoading] = useState(true)

  const fetchDocuments = () => {
    api.get('/documents').then(res => {
      setDocuments(res.data.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchDocuments()
    api.get('/departments').then(res => setDepartments(res.data))
  }, [])

  const submitDocument = async (e) => {
    e.preventDefault()
    await api.post('/documents', form)
    setForm({ title: '', description: '', department_id: '' })
    setShowForm(false)
    fetchDocuments()
  }

  const reviewDocument = async (id, status) => {
    const remarks = status === 'rejected' ? prompt('Reason for rejection:') : null
    await api.put(`/documents/${id}/review`, { status, remarks })
    fetchDocuments()
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Document Tracker</h1>
          <p style={styles.subtitle}>
            {user?.name} · {user?.department?.name || 'Admin'} · <b>{user?.role}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {user?.role === 'staff' && (
            <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
              + Submit Document
            </button>
          )}
          <button style={styles.btnSecondary} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Submit form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>Submit New Document</h3>
          <form onSubmit={submitDocument}>
            <input
              style={styles.input}
              placeholder="Document title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              style={{ ...styles.input, height: 80 }}
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <select
              style={styles.input}
              value={form.department_id}
              onChange={e => setForm({ ...form, department_id: e.target.value })}
              required
            >
              <option value="">Select department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={styles.btnPrimary} type="submit">Submit</button>
              <button style={styles.btnSecondary} type="button"
                onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Documents table */}
      {loading ? (
        <p>Loading documents...</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Title', 'Department', 'Submitted By', 'Status', 'Date', 'Actions']
                  .map(h => <th key={h} style={styles.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#888' }}>
                  No documents yet
                </td></tr>
              ) : documents.map(doc => (
                <tr key={doc.id}>
                  <td style={styles.td}>{doc.title}</td>
                  <td style={styles.td}>{doc.department?.name}</td>
                  <td style={styles.td}>{doc.user?.name}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: STATUS_COLORS[doc.status]?.bg,
                      color:      STATUS_COLORS[doc.status]?.text,
                    }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {(user?.role === 'admin' || user?.role === 'dept_head')
                      && doc.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={styles.btnApprove}
                          onClick={() => reviewDocument(doc.id, 'approved')}>
                          Approve
                        </button>
                        <button style={styles.btnReject}
                          onClick={() => reviewDocument(doc.id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24 },
  title: { margin: 0, fontSize: 26 },
  subtitle: { margin: '4px 0 0', color: '#666', fontSize: 14 },
  formCard: { background: '#f8f9fa', padding: 24, borderRadius: 10,
    marginBottom: 24, border: '1px solid #e5e7eb' },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: 12,
    border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f1f5f9', padding: '12px 16px', textAlign: 'left',
    fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' },
  td: { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 14 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  btnPrimary: { padding: '10px 18px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  btnSecondary: { padding: '10px 18px', background: '#f1f5f9', color: '#374151',
    border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  btnApprove: { padding: '6px 12px', background: '#d1fae5', color: '#065f46',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  btnReject: { padding: '6px 12px', background: '#fee2e2', color: '#991b1b',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
}