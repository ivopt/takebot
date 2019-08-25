import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'

import { BSNavLink, BSBrand } from './util/BootstrapRouterBridge'

import Home from './Home'
import Status from './Status'
import Apps from './Apps'

const Router = () => (
  <BrowserRouter>
    <Navbar bg="dark" expand="lg" variant="dark">
      <BSBrand to="/status">TakeBot Admin</BSBrand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <BSNavLink to="/" exact>Home</BSNavLink>
          <BSNavLink to="/status">Status</BSNavLink>
          <BSNavLink to="/apps">Apps</BSNavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/status" component={Status} />
        <Route path="/apps" component={Apps} />
      </Switch>
    </Container>
  </BrowserRouter>
)

export default Router
