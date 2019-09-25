import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
import { SESS_NAME } from './auth'

export const attemptSignIn = (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AuthenticationError('Incorrect email or password.')
    }
   if (!await user.matchesPassword(password)) {
       throw new AuthenticationError('Incorrect email or password.')
   }
}

const signedIn = req => req.session.userId

export const checkSignedIn = req => {
  if (!signedIn(req)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const checkSignedOut = req => {
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

export const signOut = (req, res) => new Promise((resolve, reject) => {
    req.session.destroy(err => {
        if (err) reject(err)

        res.clearCookie(SESS_NAME)

        resolve(true)
    })
})
