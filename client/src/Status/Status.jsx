import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'

import { fetchStatus } from './Service'

const Status = () => {
  const [apps, setApps] = useState([])

  const refresh = () => { fetchStatus().then(setApps) }
  useEffect(refresh, [])

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
          {apps.map(({id, status, user}) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{status}</td>
              <td>{user}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className="float-right" onClick={refresh}>Refresh</Button>
    </React.Fragment>
  )
}

export default Status
