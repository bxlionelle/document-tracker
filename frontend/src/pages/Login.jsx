import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }      = useAuth()
  const navigate       = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Document Tracker</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f4f6fa' },
  card: { background: '#fff', padding: 40, borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 },
  title: { textAlign: 'center', marginBottom: 4, fontSize: 24 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 8 },
  error: { background: '#fee2e2', color: '#b91c1c', padding: '10px 12px',
    borderRadius: 8, marginBottom: 16, fontSize: 14 },
}