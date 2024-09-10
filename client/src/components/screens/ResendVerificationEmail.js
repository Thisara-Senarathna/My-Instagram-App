import { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';

const ResendVerificationEmail = () => {
    const [email,setEmail] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const verifyemail = async() => {

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#e53935 red darken-1"})
            return
        }

        setLoading(true);
        try {

            // console.log(email);
            const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}api/resendverificationemail`,{
                email
            })
            console.log(res);
            setEmail("");
            M.toast({html:res.data.message,classes:"#2e7d32 green darken-3"})
        } catch (error) {
            if(error.response?.data?.message){
                if(error.response?.data?.state === "success"){
                    M.toast({html:error.response.data.message,classes:"#2e7d32 green darken-3"})
                    navigate('/signin');
                }
                else{
                    console.log(error);
                    M.toast({html:error.response.data.message,classes:"#2e7d32 red darken-3"})
                }
                
            }
            else{
                M.toast({html:"Server error or network issue. try again later",classes:"#2e7d32 red darken-3"})
            }
        }finally{
            setLoading(false);
        }
    }

    if (loading) {
        return  <div className="progress">
                    <div className="indeterminate"></div>
              </div>
    }

    return(
        <div className="mycard">
          <div className="card auth-card">
            <h2 className="title">Instagram</h2>
            <input type="text" placeholder="Enter your email to verify" className="input-text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            
            <button
              className="btn waves-effect #42a5f5 blue lighten-1"
              onClick={verifyemail}
            >
              Verify Email
            </button>

          </div>
        </div>
    )
}

export default ResendVerificationEmail;