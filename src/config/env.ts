require('dotenv').config()

export const ADMINEMAIL = process.env.ADMIN_EMAIL
export const ADMINPASSWORD = process.env.ADMIN_PASSWORD
export const MONGODBURL = process.env.MONGODBURL
export const REDISURL = process.env.REDISURL
export const NODEMAILEREMAIL = process.env.NODEMAILEREMAIL
export const NODEMAILERPASSWORD = process.env.NODEMAILERPASSWORD
export const CLIENTURL = process.env.CLIENTURL
export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const GOOGLECLIENTID = process.env.GOOGLECLIENTID
export const BACKENDENDPOINT = process.env.BACKENDENDPOINT
export const CLOUDNAME = process.env.CLOUDNAME
export const APIKEY = process.env.APIKEY
export const APISECRET = process.env.APISECRET
export const STRIPEKEY = process.env.STRIPEKEY
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY
export const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET
export const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET
export const NODE_ENV = process.env.NODE_ENV
export const LOG_INTERVAL = process.env.LOG_INTERVAL