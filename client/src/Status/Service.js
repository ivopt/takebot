import url from '../util/ApiUrlBuilder'

export const fetchStatus = () =>
  fetch(url("/api/status"))
    .then((data) => data.json())
    .then((apps) => apps.sort((a, b) => a.id < b.id))
