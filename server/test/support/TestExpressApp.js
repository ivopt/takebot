import express from 'express'
import bodyParser from 'body-parser'

export default () =>
  express().use(bodyParser.json())
           .use(bodyParser.urlencoded({extended: true}))
