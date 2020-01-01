import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'

import { fetchAppList, removeApp } from './Service'
import { BSLinkButton } from '../util/BootstrapRouterBridge'

const AppsTable = ({match}) => {
  const [apps, setApps] = useState([])

  useEffect(() => { fetchAppList().then(setApps) }, [])

  const deleteApp = (id) => (event) => {
    event.preventDefault()
    removeApp(id).then(() => fetchAppList().then(setApps))
  }

  return (
    <React.Fragment>
      <h1>Apps</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>App name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {apps.map(({id}) => (
            <tr key={id}>
              <td>{id}</td>
              <td><Button className="float-right" variant="danger" onClick={deleteApp(id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BSLinkButton to={`${match.url}/new`} className="float-right" variant="">
        Add app
      </BSLinkButton>
    </React.Fragment>
  )
}

export default AppsTable
