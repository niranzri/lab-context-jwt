import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, PasswordInput, Text, TextInput } from '@mantine/core'
import { AuthContext } from '../contexts/AuthContext'

const AuthForm = ( {isLogin = false } ) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { saveToken } = useContext(AuthContext);

    // Connect frontend to backend
    const handleSubmit = async event => {
        event.preventDefault()
        // requested body with user's e-mail and password
        const credentials = { email, password }
        try {
          // POST request with the user's credentials to the server, so that the backend can use them.
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/${isLogin ? 'login' : 'signup'}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              // The body is a JSON-formatted string, send as the body of the request
              body: JSON.stringify(credentials),
            }
          )
          if (response.status === 201) {
            navigate('/login')
          }
          
          if (response.status === 200) {
            const parsed = await response.json()
            console.log(parsed.authToken)
            saveToken(parsed.authToken)
            navigate('/profile')
          } 
        } catch (error) {
          console.error(error)
        }
    }

    return (
        <Box
        sx={{
          margin: '0 auto',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: 'calc(100vh - 100px)',
        }}>
  
        <Text align='center' size='xl' weight='bold'>
            {isLogin ? 'Login' : 'Signup'}
        </Text>
  
        <Box
          component='form'
          sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '2rem' }}
          onSubmit={handleSubmit}>
  
          <TextInput 
            label='E-mail' 
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant='filled' 
            withAsterisk 
            type="email"
            />

          <PasswordInput 
            label='Password'
            id='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant='filled' 
            withAsterisk />

          <Button
            type='submit'
            variant='filled'
            color='cyan'
            sx={{ marginTop: '1rem', alignSelf: 'center' }}
          > { isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </Box>
      </Box>
    )
}

export default AuthForm