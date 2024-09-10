import { useState } from 'react';
import M from 'materialize-css';
import { Link,useParams,useNavigate} from 'react-router-dom';
import axiosInstance from '../../axiosInstance';




const NewPassword = ()=> {
    const {token} = useParams();
    // console.log(token);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const updatePassword = async ()=> {
        if(password !== confirmPassword){
            M.toast({html:"Entered passwords does not match",classes:"#2e7d32 orange darken-3"})
        }
        else{
            setLoading(true);
            try {
                // console.log(email);
                const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}api/newpassword`,{
                    password,
                    token
                })
                // console.log(res.data);
                M.toast({html:res.data.message,classes:"#2e7d32 green darken-3"});
                navigate('/signin');
            }catch (error) {
                console.log(error);
                M.toast({html:"password not updated",classes:"#2e7d32 red darken-3"});
            }finally{
                setLoading(false);
            }
        }
    }

    if (loading) {
        return  <div className="progress">
                    <div className="indeterminate"></div>
              </div>
    }

    return (
        <div className="mycard">
          <div className="card auth-card">
            <h2 className="title">Instagram</h2>
            <input type="password" placeholder="Enter new password" className="input-text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <input type="password" placeholder="confirm the password" className="input-text" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            
            <button
              className="btn waves-effect #42a5f5 blue lighten-1"
              onClick={updatePassword}
            >
              Update Password
            </button>

          </div>
        </div>
      );
}

export default NewPassword;