import React from 'react'
import {Navbar, Container} from 'react-bootstrap'

import Status from './Status'

export default class MyApp extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">TakeBot Admin</Navbar.Brand>
        </Navbar>
        <Container>
          <Status />
        </Container>
      </React.Fragment>
    )
  }
}
