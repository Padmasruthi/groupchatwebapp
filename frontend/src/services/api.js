import axios from "axios";

const API = axios.create({
  baseURL: "https://groupchat-backend-i06f.onrender.com",
});

export default API;
