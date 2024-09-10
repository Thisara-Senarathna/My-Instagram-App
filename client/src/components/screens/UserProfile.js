import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../axiosInstance';
import { useParams } from 'react-router-dom';


const UserProfile = () => {
    const { userDetails,updateUserDetails } = useContext(UserContext);
    const [profileDetails,setProfileDetails] = useState(null);
    const [loading,setLoading] = useState(false);
    const [userPosts,setUserPosts] = useState([]);
    const {userId} = useParams();

    useEffect(()=>{
        // setLoading(true);
        const fetchData = async ()=>{
        //   console.log(userId)
          if(userDetails){
            try {
              const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}api/user/${userId}`);
              setProfileDetails(res.data);
              // console.log(res.data);

              const filteredPost = res.data.posts.filter(post=> !post.is_delete)
              setUserPosts(filteredPost);
              // setLoading(false);
            } catch (error) {
              console.log(error);
              // setLoading(false);
            }
          }
        };
        fetchData();
      },[userId,userDetails])


      const follow = async()=>{
        try {
          const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/follow`,{
            followId:userId
          });
          // console.log(res.data);
          // setProfileDetails(prevState=>{
          //   return ({
          //     ...prevState,
          //     user:{
          //       ...prevState.user,
          //       followers:[...prevState.user.followers,res.data.follower._id]
          //     }
          //   })
          // })
          setProfileDetails(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                followers: [...prevState.user.followers, res.data.following._id]
            }
          }));
          updateUserDetails({
            ...userDetails,
            user:{
              ...userDetails.user,
              following:[...userDetails.user.following,userId]
            }
          })
        } catch (error) {
          console.log(error)
        }
      }

      const unfollow = async()=>{
        try {
          const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/unfollow`,{
            followId:userId
          });
          // setProfileDetails(prevState=>{
          //   const filteredData = prevState.user.followers.filter(id=> id != res.data.follower._id);
          //   return ({
          //     ...prevState,
          //     user:{
          //       ...prevState.user,
          //       followers:filteredData
          //     }
          //   })
          // })
          setProfileDetails(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                followers: prevState.user.followers.filter(id => id !== res.data.following._id)
            }
          }));
          updateUserDetails({
            ...userDetails,
            user:{
              ...userDetails.user,
              following:[...userDetails.user.following.filter(id=> id !== userId)]
            }
          })
          // console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }


    
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
                style={{ width: "200px", height:"200px", borderRadius: "50%" }}
                src={profileDetails?.user?.profilePic}
              />
            </div>
            <div>
              <h4>{profileDetails && profileDetails.user && profileDetails.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  width: "300px",
                  justifyContent: "space-between",
                }}
              >
                <h6> {userPosts.length} Posts </h6>
                <h6> {profileDetails && profileDetails.user && profileDetails.user.followers.length} Followers </h6>
                <h6> {profileDetails && profileDetails.user && profileDetails.user.following.length} Following </h6>
              </div>

              {profileDetails && profileDetails.user && profileDetails.user.followers.includes(userDetails && userDetails.user && userDetails.user._id) ?
               <button style={{float:"left",marginTop:"70px"}} className="btn" onClick={unfollow}>Unfollow</button>
               :
               <button style={{float:"left",marginTop:"70px",marginRight:"10px"}} className="btn" onClick={follow}>follow</button>
              }

            </div>
          </div>
    
          <div className="gallery" >
    
                {userPosts.map(post=>{
                  return(
                    <img key={post._id} className="item" src={post.photo}/>
                  )
                })}
          </div>
        </div>
      );

}


export default UserProfile;