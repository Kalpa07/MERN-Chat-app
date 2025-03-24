import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: "http://localhost:5001/api", // this is for development
    baseURL: import.meta.env.MODE ==="development"? "http://localhost:5001/api" : "/api", 
    withCredentials:true, //helps in sending the cookie in each and every request
});