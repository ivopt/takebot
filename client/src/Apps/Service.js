import axios from 'axios'

export const fetchAppList = () => {
  const headers = new Headers({ 'Authorization': 'basic: a3llcm86c3VwZXJzZWNyZXQ=' })

  return fetch("http://localhost:3000/list", { headers })
          .then((data) => data.json())
}

export const addApp = (name) => {
  const headers = { 'Authorization': 'basic: a3llcm86c3VwZXJzZWNyZXQ=' }

  return axios.put("http://localhost:3000/add", { name }, { headers })
}
