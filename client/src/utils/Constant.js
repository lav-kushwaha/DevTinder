//Production
// export const BASE_URL = "/api" //server url

devtinder-backend-nu.vercel.app

//dev
// export const BASE_URL = location.hostname === "localhost"?"http://localhost:3000":"/api"

export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://devtinder-backend-nu.vercel.app/api";
