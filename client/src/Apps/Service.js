import axios from 'axios'

export const fetchAppList = () =>
  fetch("http://localhost:3000/api/list")
    .then((data) => data.json())

export const addApp = (name) =>
  axios.put("http://localhost:3000/api/add", { name })
