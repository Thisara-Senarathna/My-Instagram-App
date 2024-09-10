import '../../App.css'
import { useState } from 'react';
import axios from 'axios';
import M from 'materialize-css';
import { useNavigate,Link } from 'react-router-dom';
import cloudinary from '../../config/cloudinaryConfig';

const Signup = () => {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const navigate = useNavigate();
  const [imageFile,setImageFile] = useState("");
  const [loading,setLoading] = useState(false);
  // const {url,setUrl} = useState("");

  const uploadImage = async (file)=>{
    if(imageFile){
      const formData = new FormData();
      formData.append('file',file);
      formData.append('upload_preset','insta-clone');

      try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`,formData);
        // console.log(res.data.url)
        return res.data.url;
      } catch (error) {
        console.log(error);
        // return null;
      }
    }
    else{
      // return null;
    }
  }

  const postData = async()=>{
    
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:"Invalid Email",classes:"#e53935 red darken-1"})
        return
      }

      setLoading(true);
      const url = await uploadImage(imageFile);
      // console.log(url);

      try{
        const res= await axios.post(`${process.env.REACT_APP_API_URL}signup`,{
          name:name,
          email:email,
          password:password,
          profilePic:url
        })
          // console.log("Res::",res.data.message);
          M.toast({html:res.data.message,classes:"#2e7d32 green darken-3"})
          navigate("/signin")

      }catch(error){
        if(error.response?.data?.message){
          console.log(error);
          M.toast({html:error.response.data.message,classes:"#e53935 red darken-1"}); 
        }
        else{
          console.log(error);
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

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2 className="title">Instagram</h2>
        <input type="text" placeholder="name" className="input-text" value={name} onChange={(e)=>setName(e.target.value)}/>
        <input type="text" placeholder="email" className="input-text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="password" className="input-text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Profile pic</span>
            <input type="file" onChange={(e)=>setImageFile(e.target.files[0])}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect #42a5f5 blue lighten-1" onClick={postData}>
          Signup
        </button>
        <div>
          <h6>Have an Account?
              <Link to={"/signin"} className='custom-link'> Log in</Link>
          </h6>
        </div>

      </div>
    </div>
  );
};

export default Signup;
