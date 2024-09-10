import { useState } from 'react';
import axios from 'axios';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
import cloudinary from '../../config/cloudinaryConfig';
import Cookie from 'js-cookie'
import axiosInstance from '../../axiosInstance';

const CreatePost = () => {

  const [title,setTitle] = useState("")
  const [body,setBody] = useState("")
  const [image,setImage] = useState("")
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const uploadImage = async (file)=>{

    const formData = new FormData();
    formData.append('file',file);
    formData.append('upload_preset','insta-clone');

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`,formData);
      console.log(res.data.url)
      return res.data.url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const imageUrl = await uploadImage(image);

    try {
      if(!imageUrl){
        M.toast({ html: 'Image is not uploaded', classes: "#c62828 red darken-3" });
        return
      }
      const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}createpost`,{
          title,
          body,
          pic:imageUrl,
        }
      );
      console.log(res.data.message);
      navigate('/');
      M.toast({html:res.data.message , classes:"#2e7d32 green darken-3"});

    } catch (error) {
      if(error.response?.data?.message){
        console.log(error);
        M.toast({html:error.response.data.message,classes:"#e53935 red darken-1"})
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
    <>
      <div className="card input-field"
      style={{
        maxWidth:"500px",
        margin:"30px auto",
        padding:"20px",
        textAlign:"center"
      }}
      >
        <input type="text" placeholder="title" value={title} onChange={(e)=> setTitle(e.target.value)}/>
        <input type="text" placeholder="body" value={body} onChange={(e)=> setBody(e.target.value)}/>
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect #42a5f5 blue lighten-1" onClick={handleSubmit}>
          Submit post
        </button>
      </div>
    </>
  );
};

export default CreatePost;
