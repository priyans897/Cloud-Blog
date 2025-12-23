// src/api.js
import axios from "axios";

export default axios.create({
  
  baseURL: "https://cloud-blog-backend-gvffhqg9hbg8a4gn.centralindia-01.azurewebsites.net/api"
});