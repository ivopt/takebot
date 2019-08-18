import React from 'react'
import { Table, Button } from 'react-bootstrap'

import { fetchStatus } from './Service'

export default class Status extends React.Component {
  constructor(props) {
    super(props)
    this.state = { apps: [] }
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() { this.refresh() }

  refresh() { fetchStatus().then((apps) => this.setState({apps})) }

  render() {
    return (
      <React.Fragment>
        <h1>Status</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>App name</th>
              <th>Status</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {this.state.apps.map(({id, status, user}) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{status}</td>
                <td>{user}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button className="float-right" variant="success" onClick={this.refresh}>Refresh</Button>
      </React.Fragment>
    )
  }
}
