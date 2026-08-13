import { useNavigate } from 'react-router-dom'
import './index.css'

const Header = () => {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Rahul'

  const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('username')
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="header-logo-btn"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <div className="header-logo">
            <div className="logo-icon">
              <span className="logo-n">N</span>
            </div>
            <div className="logo-text">
              <span className="logo-nxt">NXT</span>
              <span className="logo-assess">ASSESS</span>
            </div>
          </div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-assess-logo-img.png"
            alt="website logo"
            className="header-logo-img"
            onError={e => { e.target.style.display = 'none' }}
          />
        </button>
        <div className="header-right">
          <div className="user-profile">
            <div className="profile-icon-badge">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="profile-name">{username}</span>
          </div>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
