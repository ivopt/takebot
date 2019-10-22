export const fetchStatus = () =>
  fetch("http://localhost:3000/status")
    .then((data) => data.json())
    .then((apps) => apps.sort((a, b) => a.id < b.id))
