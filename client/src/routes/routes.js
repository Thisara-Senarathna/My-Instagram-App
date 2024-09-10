//routes.js
import {Route,Routes} from 'react-router-dom'
import Home from '../components/screens/Home';
import Signin from '../components/screens/Login';
import Signup from '../components/screens/Signup';
import Profile from '../components/screens/Profile';
import CreatePost from '../components/screens/CreatePost';
import Cookie from 'js-cookie'
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import UserProfile from '../components/screens/UserProfile';
import SubscribedPost from '../components/screens/SubscribedPost';
import ResetPassword from '../components/screens/ResetPassword';
import NewPassword from '../components/screens/NewPassword';
import EmailVerification from '../components/screens/EmailVerification';
import ResendVerificationEmail from '../components/screens/ResendVerificationEmail';

const Approutes = ()=>{
  const navigate = useNavigate()
  const location = useLocation();
  useEffect(()=>{
    const token = Cookie.get("token");
    const path = location.pathname
    // console.log(token)
    // console.log(path)
    // console.log(location.pathname)
    if(!token){
        if(path=== '/signup'){
          navigate('/signup');
        }
        else if(path === '/resetpassword'){
          navigate('/resetpassword')
        }
        else if(path.startsWith('/newpassword')){
          navigate(`${path}`);
        }
        else if(path.startsWith('/emailverification')){
          navigate(`${path}`);
        }
        else if(path === '/resendverificationemail'){
          navigate('/resendverificationemail');
        }
        else{
          navigate("/signin");
        }
        
    }
    
  },[location.pathname])
    return(
        <>
      <Routes>
        <Route exact path='/' element={<Home/>} /> 
        <Route path='/signin' element={<Signin/>} /> 
        <Route path='/signup' element={<Signup/>} /> 
        <Route exact path='/profile' element={<Profile/>} /> 
        <Route path='/create' element={<CreatePost/>} /> 
        <Route path='/profile/:userId' element={<UserProfile/>} /> 
        <Route path='/subscribedposts' element={<SubscribedPost/>} /> 
        <Route path='/resetpassword' element={<ResetPassword/>} /> 
        <Route path='/newpassword/:token' element={<NewPassword/>} /> 
        <Route path='/emailverification/:token' element={<EmailVerification/>} /> 
        <Route path='/resendverificationemail' element={<ResendVerificationEmail/>} /> 

        
RR
      </Routes>
        </>
    )
}

export default Approutes