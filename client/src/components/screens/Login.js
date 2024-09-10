import { useState } from 'react';
import axios from 'axios';
import M from 'materialize-css';
import { Link, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const Login = () => {

  const {setToken} = useContext(UserContext);
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const postData = async()=>{
      
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:"Invalid Email",classes:"#e53935 red darken-1"})
        return
      }
      setLoading(true);
      try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}signin`,{
          email:email,
          password:password
        });
        // console.log("token:",res.data.token)
        Cookie.set("token",res.data.token,{
          expires: 1,
          httpOnly: false,
          secure: true,
          
        });
        setToken(res.data.token)
        M.toast({html:"successfully signed in",classes:"#2e7d32 green darken-3"})
        navigate("/");
        
        
      }catch(error){
        if(error.response?.data?.message){
          if(error.response?.data?.state === "not_verified"){
            console.log(error.response.data.message);
            M.toast({html:error.response.data.message,classes:"#e53935 red darken-1"})
            navigate('/resendverificationemail');
            
          }
          else{
            console.log(error.response.data.message);
            M.toast({html:error.response.data.message,classes:"#e53935 red darken-1"})
          }
        }
        else{
          M.toast({html:"Server error or network issue. try again later",classes:"#2e7d32 red darken-3"})
        }
        
      }
      finally{
        setLoading(false);
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
        <input type="text" placeholder="email" className="input-text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="password" className="input-text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button
          className="btn waves-effect #42a5f5 blue lighten-1"
          onClick={postData}
        >
          Login
        </button>

        <div>
          <h6>Dont't Have an Account?
              <Link to={"/signup"} className='custom-link'> Sign Up</Link>
          </h6>
        </div>
        <p><Link to={"/resetpassword"} className='custom-link'>Forgot password?</Link></p>
      </div>
    </div>
  );
};

export default Login;
