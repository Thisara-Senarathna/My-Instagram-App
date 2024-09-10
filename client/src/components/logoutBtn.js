import { useContext } from "react"
import { UserContext } from "../context/userContext"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"


const LogoutButton = () => {
    const {setToken,setUserDetails} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout =()=>{
        Cookies.remove("token")
        setToken(null)
        setUserDetails(null);
        navigate("/signin")
    }

    return(
        <button className="btn #e53935 red darken-1" 
         onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;