const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require("../models/User.model");
const { isAuthenticated } = require('../middlewares/isAuthenticated')

const router = require('express').Router()

// TESTING AUTH ROUTES
router.get('/', (req, res) => {
  res.json("All good in auth")
})

// SIGNUP
router.post('/signup', async (req, res) => {
  const saltRounds = 10;
  const { email, password } = req.body;

      // Check if the email or password or name is provided as an empty string 
      if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide email and password.' });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    const salt = bcrypt.genSaltSync(saltRounds)
    const passwordHash = bcrypt.hashSync(password, salt)
    const userToRegister = { email: email, passwordHash }

  try {
    const newUser = await User.create(userToRegister)
    res.status(201).json({ message: 'User created.', newUser })
    console.log(newUser)

  } catch (error) {
    res.status(500).json({ message: 'Error creating user.', error })
    console.log(error)
  }

})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const potentialUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (potentialUser) {
      if (bcrypt.compareSync(password, potentialUser.passwordHash)) {
        const authToken = jwt.sign(
          {
            user: potentialUser._id,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: 'HS256',
            expiresIn: '6h'
          }
        )
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ authToken: authToken })
      } else {
        res.status(403).json({ message: 'Incorrect password or email' })
      }
    } else {
      res.status(404).json({ message: `User not found.` })
    }
  } catch (error) {
    res.status(500).json({message: 'Error logging in user', error})
    console.log(error)
  }
})


router.get('/verify', isAuthenticated, async (req, res) => {
  console.log(req.tokenPayload)
  const currentUser = await User.findById(req.tokenPayload.userId)
  res.status(200).json(currentUser)
})


module.exports = router
