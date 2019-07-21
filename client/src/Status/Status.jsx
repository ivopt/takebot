import React from 'react'
import { Table } from 'react-bootstrap'

import { fetchStatus }   from './Service'

export default class Status extends React.Component {
  constructor(props) {
    super(props)
    this.state = { apps: [] }
  }

  componentWillMount() {
    fetchStatus().then((apps) => this.setState({apps}))
  }

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
            {this.state.apps.map(({app, status, user}) => (
              <tr key={app}>
                <td>{app}</td>
                <td>{status}</td>
                <td>{user}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    )
  }
}
