import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

import { addApp } from './Service'

const extractAndCall = (callback) => (event) => {
  console.log("setting state")
  callback(event.target.value)
}

const AppEditForm = ({history, successPath}) => {
  const [name, setName] = useState("")

  const createNewApp = (event) => {
    event.preventDefault()
    addApp(name).then(() => history.push(successPath))
  }

  return (
    <React.Fragment>
      <h1>New app</h1>
      <Form onSubmit={createNewApp}>
        <Form.Group controlId="appName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="app's name" value={name} onChange={extractAndCall(setName)} />
        </Form.Group>

        <Button variant="primary" type="submit" className="float-right">Create app</Button>
        <Button variant="danger" onClick={() => history.push(successPath)}>Cancel</Button>
      </Form>
    </React.Fragment>
  )
}

export default AppEditForm
