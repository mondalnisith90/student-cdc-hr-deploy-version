import axios from 'axios';
import {useState, useContext} from 'react';
import {currentUserDataContext} from "../../App";
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import "../../css/Login.css";
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { NavLink } from 'react-router-dom';


const reactToastStyle = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    };

const Login = () => {


    const {currentUserData, setCurrentUserData}  = useContext(currentUserDataContext);
    const history = useHistory();

    const [inputFormData, setInputFormData] = useState({
        email: "",
        password: ""
    });
    const [progressbarState, setProgressbarState] = useState(false);

    // console.log(currentUserData)

    const inputFieldChange = (event) => {
       const fieldName = event.target.name;
       const fieldValue = event.target.value;
        setInputFormData({...inputFormData, [fieldName]: fieldValue});
    }

    const {email, password} = inputFormData;
     

    const studentLoginFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setProgressbarState(true);
            const apiUrl = `/student/signin`;
            // const apiUrl = `http://localhost:8000/student/signin`;
            const serverResponse = await axios.post(apiUrl, inputFormData, {withCredentials: true});
            if(serverResponse.status == 200){
                setProgressbarState(false);
                const data = serverResponse.data;
                //set cookies in client side
                Cookies.set("user_type", "student", {expires: 60});
                setCurrentUserData({...currentUserData, isAlreadyLogin: true, userId: data._id, name: data.name, profile_pic: data.profile_pic, type: data.type});
                toast.success("Login successfull", reactToastStyle);
                setTimeout(()=>{
                    history.push("/");
                }, 2000);
            } 
        } catch (error) {
            setProgressbarState(false);
            setCurrentUserData({...currentUserData, isAlreadyLogin: false});
            toast.error(error.response.data, reactToastStyle);
        }
    }

    return (
    <>
    <section className="login_root_div d-flex justify-content-center align-items-center">
    <ToastContainer />
     <div className=" login_main_div shadow">
      <h2 style={{color: "#e6054c", fontStyle: "italic", textAlign: "center", marginTop: "20px"}}>Student Login</h2>
      <hr/> 
      
     <form action="POST" className="login w-100" onSubmit={studentLoginFormSubmit}>
     <div className="login_form_div p-3" style={{marginLeft: "-80px"}}>
      <div className="mb-3 ">
          <label for="exampleInputEmail1 " className="form-label form_input_label"><EmailIcon className="login_icon"/>Email address*</label>
          <input type="email" placeholder="Enter email address" className="form-control login_form_input" id="exampleInputEmail1" name="email" value={email} onChange={inputFieldChange} aria-describedby="emailHelp"/>
      </div>
      <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label form_input_label"><LockIcon className="login_icon" />Password*</label>
          <input type="password" placeholder='Enter password' className="form-control login_form_input" name="password" value={password} onChange={inputFieldChange} id="exampleInputPassword1"/>
      </div>


      <div className="row" >
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 d-flex justify-content-start align-items-center pb-3 ps-3">
      <div>
      <button type="submit" className="btn btn-success mt-1" style={{backgroundColor: "#04bf62", border: "0px"}}>Login<ExitToAppIcon className="ml-1"/></button>
      </div>
      <div style={{width: "60px"}} className="ml-3 mr-4">
      {
        progressbarState ? <CircularProgress style={{color: "green"}} /> : null
      }
      </div>
      </div>
      <div  className="col-lg-6 col-md-12 col-sm-12 col-12 mt-md-1 mt-sm-1 mt-1 text-start">
        <NavLink exact to="/signup" ><p className=" mt-2">New User? Create Account</p></NavLink>
      </div>

      </div>

      </div>
      
    </form>
    </div>
    </section>

    </>
    );
}
export default Login;