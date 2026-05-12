import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const { register }    = useAuth()
  const navigate        = useNavigate()
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', department_id: ''
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      const msgs = err.response?.data?.errors
      if (msgs) {
        setError(Object.values(msgs).flat().join(', '))
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name',                  label: 'Full Name',         type: 'text' },
            { key: 'email',                 label: 'Email',             type: 'email' },
            { key: 'password',              label: 'Password',          type: 'password' },
            { key: 'password_confirmation', label: 'Confirm Password',  type: 'password' },
          ].map(f => (
            <div key={f.key} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                style={styles.input}
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required
              />
            </div>
          ))}

          <div style={styles.field}>
            <label style={styles.label}>Department</label>
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
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f4f6fa' },
  card: { background: '#fff', padding: 40, borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 420 },
  title: { textAlign: 'center', marginBottom: 20, fontSize: 24 },
  field: { marginBottom: 14 },
  label: { display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 12, background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 8 },
  error: { background: '#fee2e2', color: '#b91c1c', padding: '10px 12px',
    borderRadius: 8, marginBottom: 16, fontSize: 14 },
}