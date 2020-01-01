import url from '../util/ApiUrlBuilder'
import axios from 'axios'

export const fetchAppList = () =>
  fetch(url("/api/list"))
    .then((data) => data.json())

export const addApp = (name) =>
  axios.put(url("/api/add"), { name })

export const removeApp = (name) =>
  axios.post(url("/api/remove"), { name })