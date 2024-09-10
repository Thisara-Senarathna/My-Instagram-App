import { Link, useSearchParams,useLocation } from "react-router-dom";
import { useContext, useDebugValue, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import LogoutButton from "./logoutBtn";
import axiosInstance from "../axiosInstance";

const Navbar = () => {
  const { token,userDetails } = useContext(UserContext);
  const [loading,setLoading] = useState(false);
  const [searchTerm,setSearchTerm] = useState("");
  const [searchedUsers,setSearchedUsers] = useState([]);
  const location = useLocation();
  

  // this use for clear the searchTerm when navigating another page
  useEffect(()=>{
    // console.log(location.pathname);
    setSearchTerm("");
  },[location.pathname])

  const searchUser = async()=> {
      if(searchTerm !== ""){
        try {
          const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}api/searchuser`,{
            searchTerm
          });
          // console.log(res.data);
          setSearchedUsers(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      else{
        // console.log("not make a request");
        setSearchedUsers([])
      }
  }

  useEffect(()=>{
    // if(searchTerm){
      searchUser();
    // }
  },[searchTerm])

  const renderList = () => {
    // console.log(token);
    if (token) {
      return [
        <li key="search">
          <input
            id="searchInput"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          {searchedUsers &&  
            <ul className="search-results">
                {searchedUsers?.map(user=>
                  <li key={user._id} className="search-item" onClick={()=>{setSearchTerm("")}}>
                    <Link to={userDetails?.user?._id !== user._id ? "/profile/"+user._id : "/profile"}>{user.name}</Link>
                  </li>
                )}

            </ul>
        }

        </li>
        ,
        <li key="searchicon" className="searchbtn" onClick={(e)=>{document.getElementById('searchInput').focus()}}><i className="material-icons left">search</i></li>,
        <li key="profile">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="create">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="subscribedposts">
        <Link to="/subscribedposts">Following</Link>
      </li>,
        <li key="logout">
          <LogoutButton/>
        </li>
      ];
    } else {
      return [
        <li key="signin">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="signup">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={token ? "/":"/signin"} className="brand-logo left" style={{marginLeft:"20px"}}>
          Instagram
        </Link>
        
        <ul id="nav-mobile" className="right" style={{
          marginRight:"10px"
        }}>
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
