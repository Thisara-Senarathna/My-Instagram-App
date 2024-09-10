import { useState,createContext, Children, useDebugValue, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Cookies from "js-cookie"
import {jwtDecode} from 'jwt-decode'


const UserContext = createContext();

const UserProvider = ({children}) => {
    const [decodeValues,setDecodeValues] = useState({});
    const [userDetails,setUserDetails] = useState({})
    const [token, setToken] = useState(Cookies.get("token"));

    useEffect(()=>{
        const token = Cookies.get("token");
        if(token){
            const decoded = jwtDecode(token)
            setDecodeValues(decoded);
        }
        else{
            setDecodeValues({});
            setUserDetails({});
        }
        
    },[token])

    // console.log("decoded values:",decodeValues)
    const id= decodeValues?._id;

    useEffect(()=>{
 
            const fetchData = async () => {
                if(id){
                    try{
                    const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}api/user/${id}`);
                        // console.log("userData:",res.data.data);
                        setUserDetails(res.data);
                    }
                    catch(error){
                        console.log(error)
                    }
                }
            };
        fetchData();
    },[id])


    // const updateUserDetails = (newDetails) => {
    //     console.log("userDetails updating");
    //     setUserDetails(prevDetails => ({
    //         ...prevDetails,
    //         ...newDetails,
    //         user: {
    //             ...prevDetails.user,
    //             ...newDetails.user,
    //             following: newDetails.user.following || prevDetails.user.following,
    //             followers: newDetails.user.followers || prevDetails.user.followers
    //         }
    //     }));
    // };

    const updateUserDetails = (newDetails) => {
        setUserDetails(newDetails);
    };

    return(
        <UserContext.Provider value={{userDetails,updateUserDetails,setUserDetails,token,setToken}}>
            {children}
        </UserContext.Provider>
    )



}


export {UserProvider,UserContext}