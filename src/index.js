import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import db from '../config/db'
import mongoose from 'mongoose'
import session from 'express-session'
import connectRedis from 'connect-redis'

mongoose.Promise = global.Promise
mongoose.connect(db)

const app = express()

const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!secret!',
  SESS_LIFETIME = 1000 * 60 * 60 * 2,
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_PASSWORD = 'secret'
} = process.env

const IN_PROD = NODE_ENV === 'production'

app.disable('x-powered-by')

const RedisStore = connectRedis(session)

const store = new RedisStore({
  host: REDIS_HOST,
  port: REDIS_PORT,
  pass: REDIS_PASSWORD
})

app.use(
  session({
    store,
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(SESS_LIFETIME),
      sameSite: true,
      secure: IN_PROD
    }
  })
)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: !IN_PROD,
  context: ({ req, res }) => ({ req, res })
})

server.applyMiddleware({ app })

app.listen({ port: APP_PORT }, () =>
  console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
)
