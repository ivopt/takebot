import React from 'react'
import { Route } from 'react-router-dom'

import AppsTable from './AppsTable'
import AppEditForm from './AppEditForm'

const Apps = ({ match: { path } }) => (
  <React.Fragment>
    <Route exact path={`${path}`} component={AppsTable} />
    <Route path={`${path}/new`} render={(props) => <AppEditForm {...props} successPath={path}/>} />
  </React.Fragment>
)

export default Apps
