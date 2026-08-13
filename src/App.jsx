import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EvaluationProvider } from './context/EvaluationContext'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const App = () => (
  <EvaluationProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            localStorage.getItem('jwt_token') ? <Navigate to="/" replace /> : <Login />
          }
        />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </EvaluationProvider>
)

export default App
