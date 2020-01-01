export default (path) => 
  `${process.env["API_BASE_URL"] || ""}${path}`