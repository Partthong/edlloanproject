import axios from 'axios';

const axiosInterceptorInstance = axios.create({
  baseURL: "https://loantrack.edl.com.la",
  // baseURL: "https://localhost:44344",
});



// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
     (config) => {
    // Modify the request config here (add headers, authentication tokens)
        const access_Token = localStorage.getItem('token');

    // If token is present add it to request's Authorization Header
    if (access_Token) {
      if (config.headers) config.headers.Authorization = "Bearer " +  access_Token;

    //   "Authorization", "Bearer " + tokens
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);
// End of Request interceptor



// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstance;
