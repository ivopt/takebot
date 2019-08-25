import React, { useState } from 'react'

import { Form, Button } from 'react-bootstrap'

const createNewApp = (event) => {
  event.preventDefault()
  console.log("Form Submission!!")
}

const extractAndCall = (callback) => (event) => {
  console.log("setting state")
  callback(event.target.value)
}

const AppEditForm = ({history}) => {
  const [name, setName] = useState("")

  return (
    <React.Fragment>
      <h1>New app</h1>
      <Form onSubmit={createNewApp}>
        <Form.Group controlId="appName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="app's name" value={name} onChange={extractAndCall(setName)} />
        </Form.Group>

        <Button variant="primary" type="submit" className="float-right">Create app</Button>
        <Button variant="danger" onClick={() => history.push("/apps")}>Cancel</Button>
      </Form>
    </React.Fragment>
  )
}

export default AppEditForm
