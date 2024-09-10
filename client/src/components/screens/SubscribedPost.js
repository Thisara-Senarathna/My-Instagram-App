import { useState,useEffect } from "react"
import axiosInstance from "../../axiosInstance";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import M from 'materialize-css';
import { Link } from "react-router-dom";

const SubscribedPost = ()=>{
    const {userDetails} = useContext(UserContext)
    const [allpost,setAllpost] = useState([]);
    const [comment,setComment] = useState("");
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await axiosInstance.get(`${process.env.REACT_APP_API_URL}api/subscribedposts`)
                setAllpost(res.data.posts);
                
            } catch (error) {
                
            }
        };
        fetchData();
    },[])


    const likePost = async (id)=>{
        try {
            
            const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/like`,{postId:id});
            // console.log(userId);
            setAllpost(prevPosts=>
                prevPosts.map(post=>
                    post._id === id ? {...post,likes:[...post.likes,userDetails.user._id]}:post
                )
            )
            // console.log(res.data.postedBy);
            // console.log("successfully liked:");
        } catch (error) {
            console.log(error);
        }
        
    }

    const unLikePost = async (id)=>{
        try {
            const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/unlike`,{postId:id});
            setAllpost(prevPosts=>
                prevPosts.map(post=>
                    post._id === id ? {...post,likes:post.likes.filter(userId=>userId !== userDetails.user._id)}:post
                )
            )
            // console.log("successfully unliked");
        } catch (error) {
            console.log(error);
        }
        
    }


    const submitComment = async(comment,postId)=>{
        try {
            const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/comment`,{
                comment:comment,
                postId:postId,
            });
            // console.log(res.data.comments);
            // console.log("successfully added comment")
            setComment("")
            setAllpost(prevPosts=>
                prevPosts.map(post=>
                    post._id === postId ? {...post,comments:[...post.comments,res.data.comments[res.data.comments.length-1]]} : post
                )
            );
        } catch (error) {
            console.log(error);
        }
    }


    const deletePost = async (id)=>{
        setLoading(true);
        try {
            const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/deletepost`,{postId:id});
            // console.log(res.data.post);
            setAllpost(prevPosts=>
                prevPosts.filter(post=>post._id !== id)
            );
            M.toast({html:"post is deleted successfully",classes:"#ffa726 orange lighten-1"})
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }


    const deleteComment = async (postId,commentId)=>{
        try {
            const res = await axiosInstance.put(`${process.env.REACT_APP_API_URL}api/deletecomment`,{
                postId:postId,
                commentId:commentId
            });
            // console.log(res.data.post);
            setAllpost(prevPosts=>
                prevPosts.map(post=>
                    post._id === postId ? {
                        ...post,
                        comments:post.comments.filter(comment=> comment._id !== commentId )
                    }:post
                )
            )
            M.toast({html:"comment is deleted",classes:"#ffa726 orange lighten-1"})
        } catch (error) {
            console.log(error);
        }
    }


    if (loading) {
        return  <div className="progress">
                    <div className="indeterminate"></div>
              </div>
    }


    return(
        <div>

            {allpost.map(item=>{
                // console.log(item.comments.length);


                return(
                    <div className="card home-card " style={{padding:"5px",fontFamily:"cursive"}} key={item._id}>
                        <h5 style={{fontSize:"25px",}} >
                            <Link to={userDetails && userDetails.user && userDetails.user._id !== item.postedBy._id ? "/profile/"+item.postedBy._id : "/profile"}>
                            {item.postedBy.name} 
                            </Link>
                                {userDetails && userDetails.user &&(item.postedBy._id === userDetails.user._id) && <i style={{float:"right",cursor:"pointer"}} className="material-icons" onClick={()=>{deletePost(item._id)}}>delete</i> }
          
                        </h5>
                        <div className="card-image ">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content ">
                            {/* <i className="material-icons">favorite_border</i> */}  
                            <div className="row">
                                <div className="col s12 m12">
                                    <div className="">
                                        <div className="card-content black-text">

                                            <div style={{display:"flex",justifyContent:"space-between"}}>
                                            {userDetails && userDetails.user && item.likes.includes(userDetails.user._id) ?
                                
                                                <i className="material-icons" style={{cursor:"pointer"}} onClick={()=>{unLikePost(item._id)}}>thumb_down</i>
                                                :
                                                <i className="material-icons" style={{cursor:"pointer"}} onClick={()=>{likePost(item._id)}}>thumb_up</i>
                                            }
                                            <p >{item.likes.length} likes</p>
                                            </div>
                                            
                                            <span className="card-title">{item.title}</span>
                                            <p>{item.body}</p>
                                        </div>
        
                                    </div>
                                </div>
                            </div>

                            {item.comments.map(comment=>{
                                return (
                                    <div className="" style={{padding:"5px"}} key={comment._id}>
                                        <h6>{comment.commentedBy.name} :  <span> {comment.comment}</span>   
                                            {userDetails && userDetails.user && comment.commentedBy._id == userDetails.user._id && <i style={{float:"right",cursor:"pointer"}} className="material-icons" onClick={()=>{deleteComment(item._id,comment._id)}}>delete</i>}
                                        </h6>
                                    </div>
                                )
                            })}

                            <form onSubmit={(e)=>{e.preventDefault(); submitComment(comment,item._id)}}>
                                <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
                                <button  className="btn" type="submit">Add Comment</button> <span style={{float:"right"}}>{item.comments.length} comments</span>
                            </form>
                        </div>
                    </div>
                )
            })}
            
            
        </div>
    )
}

export default SubscribedPost