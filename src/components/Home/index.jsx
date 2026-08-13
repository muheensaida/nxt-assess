import { useNavigate } from 'react-router-dom'
import Header from '../Header'
import { hasSavedExam } from '../../utils/examStorage'
import './index.css'

const Home = () => {
  const navigate = useNavigate()
  const canResume = hasSavedExam()

  return (
    <div className="page-wrapper">
      <Header />
      <main className="home-main fade-in">
        <div className="home-blob home-blob-1" />
        <div className="home-blob home-blob-2" />

        <div className="home-content">
          <div className="home-text-section">
            <div className="home-badge">
              <span className="badge-dot" />
              Assessment Platform
            </div>
            <h1 className="home-heading">
              Ready to Test Your
              <span className="home-heading-accent"> Knowledge?</span>
            </h1>
            <p className="home-desc">
              Challenge yourself with our comprehensive assessment. Answer timed questions, 
              track your performance, and see where you stand.
            </p>
            <div className="home-features">
              <div className="feature-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                10 Minutes
              </div>
              <div className="feature-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Instant Results
              </div>
              <div className="feature-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Score Tracking
              </div>
            </div>
            <button
              className="btn btn-primary home-start-btn"
              onClick={() => navigate('/assessment')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {canResume ? 'Resume Assessment' : 'Start Assessment'}
            </button>
          </div>

          <div className="home-image-section">
            <div className="home-image-card glass-card">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-assess-assessment-img.png"
                alt="assessment"
                className="home-img"
                onError={e => { e.target.src = 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Assessment' }}
              />
              <div className="home-card-overlay">
                <div className="overlay-stat">
                  <span className="overlay-num">∞</span>
                  <span className="overlay-label">Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
