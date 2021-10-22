import { NavLink } from "react-router-dom";
import { useContext } from "react";
import {currentUserDataContext} from "../App";
import PostAddIcon from '@material-ui/icons/PostAdd';
import "../css/Navbar.css";

const Navbar=()=>{

    const {currentUserData, setCurrentUserData} = useContext(currentUserDataContext);
    // console.log(currentUserData.name)

return(
    <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <img src="" alt="" />
                <NavLink className="navbar-brand" exact to="/" style={{fontWeight: "700", color: "#ee00aa"}}>Student-CDC-HR</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse text-centre" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item nav_list_item">
                            <NavLink className="nav-link active navbar_navlink" activeClassName="navlink_active" aria-current="page" exact to="/">Home</NavLink>
                        </li>
                        <li className="nav-item nav_list_item">
                            <NavLink className="nav-link active navbar_navlink" activeClassName="navlink_active" aria-current="page" exact to="/contact">Contact</NavLink>
                        </li>
                        <li className="nav-item nav_list_item">
                            <NavLink className="nav-link active navbar_navlink" activeClassName="navlink_active" aria-current="page" exact to="/about">About</NavLink>
                        </li>

                        {
                            currentUserData.isAlreadyLogin ? 
                                            <li className="nav-item nav_list_item">
                                                <NavLink className="nav-link active navbar_navlink" activeClassName="navlink_active" aria-current="page"  exact to={currentUserData.type == "admin" ? "/admin/dashboard" :  currentUserData.type == "student" ? "/student/profile" : "/hr/profile"} >{currentUserData.type == "admin" ? "Dashboard" : "My Profile"}</NavLink>
                                            </li> : null
                        }


                        {
                        currentUserData.type=="hr" && currentUserData.isGranted=="true" ? 
                    <li>
                        <NavLink className="nav-link active navbar_navlink" aria-current="page" exact to="/hrsortlisted-profiles" activeClassName="navlink_active">
                        <PostAddIcon style={{color: "green", marginTop: "-5px", cursor: "pointer" , fontSize: "30px", marginLeft: "30px"}}/>Sortlisted Profiles
                        </NavLink>
                        
                    </li> : null  }

                        {
                            currentUserData.isAlreadyLogin ? 
                            <li className="nav-item nav_list_item">
                              <NavLink className="nav-link active navbar_navlink" activeClassName="navlink_active" aria-current="page" exact to="/logout">Log Out</NavLink>
                            </li>
                            : <>
                             <li className="nav-item dropdown nav_list_item">
                            <NavLink className="nav-link dropdown-toggle navbar_navlink" activeClassName="navlink_active" exact to="/abc" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sign Up
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink className="dropdown-item" exact to ="/signup">Student</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><NavLink className="dropdown-item" exact to="/hrsignup">HR</NavLink></li>

                            </ul>
                        </li>

                     

                        <li className="nav-item dropdown nav_list_item">
                            <NavLink className="nav-link dropdown-toggle" exact to="/bss" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Log In
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink className="dropdown-item" exact to="/login">Student</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><NavLink className="dropdown-item" exact to="/hrlogin">HR</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><NavLink className="dropdown-item" exact to="/admin-login">ADMIN</NavLink></li>

                            </ul>
                        </li>
                       
                        </>
                    }

                    {
                        currentUserData.isAlreadyLogin ? 
                        <li className="nav-item nav_list_item">
                            <NavLink className="nav-link disabled text-black navbar_navlink" aria-current="page" exact to="#" >{currentUserData.name} ({currentUserData.type})</NavLink>
                        </li> : null
                    }  

                    </ul>
                </div>
            </div>
        </nav>
    </>
);
}
export default Navbar;