import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext)

  if (isLoading) {
    return <h1> Loading... </h1>
  } else if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  return children
}

export default PrivateRoute