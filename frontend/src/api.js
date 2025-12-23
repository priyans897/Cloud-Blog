import axios from "axios";




const BASE_URL = "https://cloud-blog-backend-gvffhqg9hbg8a4gn.centralindia-01.azurewebsites.net/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;