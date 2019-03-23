import dotenv from 'dotenv'

dotenv.config()

if (process.env['EXTRA_ENV']){
  const extraEnv = JSON.parse(process.env['EXTRA_ENV'])
  Object.keys(extraEnv).forEach((k) => process.env[k] = extraEnv[k])
}
