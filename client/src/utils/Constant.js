//Production
// export const BASE_URL = "/api" //server url

//dev
export const BASE_URL = location.hostname === "localhost"?"http://localhost:3000":"/api"