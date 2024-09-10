import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import axios,{AxiosInstance} from "axios";
import Cookies from 'js-cookie';

const token = Cookies.get("token");

const axiosInstance = axios.create({
    baseURL:`${process.env.REACT_APP_API_URL}/`,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
    }
})

axiosInstance.interceptors.request.use((config)=>{
    const token = Cookies.get("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error)=> {
    return Promise.reject(error);
})


export default axiosInstance;