import axios from "axios";

export default axios.create({
  // इसे Azure की लिंक से बदलें
  baseURL: "https://cloud-blog-backend-gvffhqg9hbg8a4gn.centralindia-01.azurewebsites.net/api"
});