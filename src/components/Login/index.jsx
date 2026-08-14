import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/ccbp-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('jwt_token', data.jwt_token)
        localStorage.setItem('username', username)
        navigate('/', { replace: true })
      } else {
        setErrorMsg('wrong username/password')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-container fade-in">
        {/* Left decorative panel */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">N</div>
            <div>
              <div className="brand-sub">WELCOME TO</div>
              <div className="brand-name">NXT ASSESS</div>
            </div>
          </div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-assess-logo-img.png"
            alt="login website logo"
            className="login-logo-img"
            onError={e => { e.target.style.display = 'none' }}
          />
          <p className="login-tagline">
            Test your knowledge. Track your progress. Excel with confidence.
          </p>
          <div className="login-stats">
            <div className="stat-item">
              <span className="stat-num">10</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">10min</span>
              <span className="stat-label">Time Limit</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Instant Results</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-right glass-card">
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Enter your credentials to continue</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="show-pwd-row">
              <input
                id="showPassword"
                type="checkbox"
                className="show-pwd-checkbox"
                checked={showPwd}
                onChange={e => setShowPwd(e.target.checked)}
              />
              <label htmlFor="showPassword" className="show-pwd-label">Show Password</label>
            </div>

            {errorMsg && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>*{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Signing in...
                </>
              ) : 'Login'}
            </button>
          </form>


        </div>
      </div>
    </div>
  )
}

export default Login
