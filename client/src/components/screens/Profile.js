import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../axiosInstance';
import axios from 'axios';
import cloudinary from '../../config/cloudinaryConfig';


const Profile = () => {
  const { userDetails,updateUserDetails} = useContext(UserContext);
  const [myposts,setMyposts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [imageFile,setImageFile] = useState("");

  useEffect(()=>{
    // setLoading(true);
    const fetchData = async ()=>{
      
      // console.log(userId)

      if(userDetails?.user?._id){
        try {
          const userId = userDetails.user._id;
          const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}api/myposts/${userId}`);
          setMyposts(res.data.myposts);
          // setLoading(false)
        } catch (error) {
          console.log(error);
          // setLoading(false);
        }
      }
    };
    fetchData();
  },[userDetails])


  const uploadImage = async (file)=>{
    if(imageFile){
      setLoading(true)
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
      finally{
        setLoading(false);
      }
    }
    else{
      // return null;
    }
  }

  useEffect(()=>{
    const updatePic = async()=> {
      const url = await uploadImage(imageFile);
      // console.log(url);
      if(url){
        try {
          const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/updateprfilepic`,{
            profilePic:url,
          });
          // console.log(res.data.profilePic);
          const newProPic = res.data.profilePic;
          updateUserDetails({
            ...userDetails,
            user:{
              ...userDetails.user,
              profilePic:newProPic
            }
          })

          // console.log("profile pic updated successfullly");
        } catch (error) {
          console.log({error});
        }
      }
      else{
        // console.log("Photo is not uploaded")
      }
      
      
  };
  updatePic();
  },[imageFile])

  if (loading) {
    return  <div className="progress">
                <div className="indeterminate"></div>
          </div>
  }

  return (
    <div style={{maxWidth:"550px",margin:"0px auto"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 5px",
          paddingBottom:"10px",
          borderBottom:"solid 1px"
        }}
      >
        <div className="profile-image">
          <img
            style={{ width: "200px",height:"200px", borderRadius: "50%" }}
            src={userDetails?.user?.profilePic}
          />
          <div className="file-field input-field">
              <div className="btn">
                <span >Update pic</span>
                <input type="file" onChange={(e)=>setImageFile(e.target.files[0])}/>
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
          </div>
        </div>
        
        <div>
          <h4>{userDetails?.user?.name}</h4>
          <div
            style={{
              display: "flex",
              width: "300px",
              justifyContent: "space-between",
            }}
          >
            <h6> {myposts.length} Posts </h6>
            <h6> {userDetails?.user?.followers?.length} Followers </h6>
            <h6> {userDetails?.user?.following?.length} Following </h6>
          </div>
          
          

        </div>
      </div>

      <div className="gallery" >

            {myposts.map(item=>{
              return(
                <img key={item._id} className="item" src={item.photo}/>
              )
            })}

            {/* <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/>
            <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/>
            <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/>
            <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/>
            <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/>
            <img className="item" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"/> */}
      </div>
    </div>
  );
};

export default Profile;
