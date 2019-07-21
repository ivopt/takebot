import dotenv from 'dotenv'

dotenv.config({path: './test/.env.test'})

if (process.env['EXTRA_ENV']){
  const extraEnv = JSON.parse(process.env['EXTRA_ENV'])
  Object.keys(extraEnv).forEach((k) => process.env[k] = extraEnv[k])
}

import 'jest-extended'
import 'jest-chain'
