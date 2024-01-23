import { useState, useEffect, createContext } from "react"
// import { useLocalStorage } from "@mantine/hooks"

export const AuthContext = createContext()

const AuthContextProvider = ( {children} ) => {
    const [token, setToken] = useState();
    // we will expose the following two states instead of the token for the children to consume
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    // with Mantine's local storage hook:
    // const [tokenFromLS, setTokenFromLS] = useLocalStorage({key: 'authToken'})

    // Records token to state (setToken) and local storage
    const saveToken = tokenFromLogin => {
        setToken(tokenFromLogin)
        setIsAuthenticated(true)
        // key set to 'authToken' here
        window.localStorage.setItem('authToken', tokenFromLogin)
    }
    
    // Clears the token from the state and local storage
    const logout = () => {
        setToken()
        setIsAuthenticated(false)
        window.localStorage.removeItem('authToken')
    }

    // makes a request to the server (with the fetch API) verify the token.
    // the URL of the server is obtained from the envrionment variable VITE_API_URL
    const verifyToken = async tokenToVerify => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
              headers: {
                Authorization: `Bearer ${tokenToVerify}`,
              },
            })
            if (response.status === 200) {
              setToken(tokenToVerify)
              setIsAuthenticated(true)
              setIsLoading(false)
            }
            if (response.status === 401) {
              throw new Error('Invalid Token') 
              // add a react-toastify notification to tell the user to authenticate again
            }
        } catch (error) {
            setIsLoading(false)
            window.localStorage.removeItem('authToken')
        }
    }

    // checks if there is a token in the local storage.
    // If there is a token, the verifyToken function is called to verify the token.
    useEffect(() => {
        const tokenFromLS = window.localStorage.getItem('authToken')
        if (tokenFromLS) {
          verifyToken(tokenFromLS)
        } else {
          setIsLoading(false)
        }
    }, [])

    /* Function to use for protected API endppoints  
    reuses a token so that we don't have to use the verify route all the time
    we need the token. */
    const fetchWithToken = async (endpoint, method = 'GET', payload) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
                method,
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
        })
        return response
        } catch (error) {
            console.error('Something went wrong with the fetchWithToken', error)
        }
    }

    return (
        <AuthContext.Provider value={{ isLoading, isAuthenticated, logout, saveToken, fetchWithToken }}>
        {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
