export const fetchAppList = () => {
  const headers = new Headers({ 'Authorization': 'basic: a3llcm86c3VwZXJzZWNyZXQ=' })

  return fetch("http://localhost:3000/list", { headers })
          .then((data) => data.json())
}
