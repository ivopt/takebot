export const fetchStatus = () => {
  const headers = new Headers({ 'Authorization': 'basic: a3llcm86c3VwZXJzZWNyZXQ='})

  return fetch("http://localhost:3000/status", { headers })
          .then((data) => data.json())
          .then((apps) =>
            Object.keys(apps).reduce((acc, key) =>
              acc.concat(Object.assign(apps[key], {app: key}))
            , [])
          )

}
