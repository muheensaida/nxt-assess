import { useNavigate } from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <div className="notfound-blob notfound-blob-1" />
      <div className="notfound-blob notfound-blob-2" />
      <div className="notfound-content fade-in">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-assess-not-found-img.png"
          alt="not found"
          className="notfound-img"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x220/7c3aed/ffffff?text=404' }}
        />
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
