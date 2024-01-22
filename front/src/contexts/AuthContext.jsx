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

    // recording token to state and local storage
    const saveToken = tokenFromLogin => {
        setToken(tokenFromLogin)
        window.localStorage.setItem('authToken', tokenFromLogin)
      }

      // we make a request to see if we are verified - we pass the token to our backend route
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

      useEffect(() => {
        const tokenFromLS = window.localStorage.getItem('authToken')
        if (tokenFromLS) {
          verifyToken(tokenFromLS)
          //setToken(tokenFromLS) 
          /* if we have a token in LS we set the token to the value of the LS token
          but we need to also check if we are authenticated! */
        } else {
          setIsLoading(false)
        }
      }, [])

    return (
        <AuthContext.Provider value={{ saveToken, isLoading, isAuthenticated }}>
        {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
