import M from 'materialize-css';
import {  useState } from 'react';
import { useParams,useNavigate,Link} from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const EmailVerification = ()=>{
    const navigate = useNavigate();
    const {token} = useParams();
    const [state,setState] = useState("verifing");
    const verifyEmail = async()=>{
            try {
                const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}api/verifyemail` , {
                    token
                })
                console.log("success verify",res)
                M.toast({html:"Email verified successfully",classes:"#2e7d32 green darken-3"});
                setState("success");
            } catch (error) {

                if(error.response?.data?.message){
                    console.log(error);
                    setState(error.response.data.state);
                    console.log(state);
                    if(error.response.data.state === "success"){
                        M.toast({html:error.response.data.message,classes:"#e53935 green darken-1"})
                    }
                    else{
                        M.toast({html:"session has expired",classes:"#e53935 red darken-1"})
                        setState("failed");
                    }
                    
                }
                else{
                    M.toast({html:"Server error or network issue. try again later",classes:"#2e7d32 red darken-3"});
                    setState("failed");
                }
                
            }
    }

    if(state==="success"){
        navigate("/signin");
    }


    return(
        <>  
            <div
            style={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
            }}>

            {state === "verifing" && 
                <div >
                    <h3>Click Follow button to verify your email!</h3>
                    <p>After verify your email. you can login</p>
                    <button className='btn' onClick={verifyEmail}>Verify Email</button>
             </div>
            }   

            {state === "loading" && 
                <div className="progress">
                    <div className="indeterminate"></div>
             </div>
            }

            {state === "failed" && 
                <div >
                    <h2>Email Verification failed!</h2>
                    <p>We could not verify your email. Please try again or contact support if the issue persists.</p>
                    <Link to={'/resendverificationemail'}>
                    <button className='btn'> Resend Verification Email</button>
                    </Link>
             </div>
            }


            </div>
        </>
    )
}
export default EmailVerification;