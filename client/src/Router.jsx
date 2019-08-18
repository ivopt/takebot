import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import {Navbar, Container} from 'react-bootstrap'

import Home from './Home'
import Status from './Status'

const Router = () => (
  <BrowserRouter>
    <Navbar bg="dark" expand="lg" variant="dark">
      <Link to="/status" className="navbar-brand">TakeBot Admin</Link>
    </Navbar>
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/status" component={Status} />
      </Switch>
    </Container>
  </BrowserRouter>
)

export default Router
