import { NavLink } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import "../../css/Signup.css";
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from '../../Firebase/Firebasecofig';



const reactToastStyle = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    };

const SignUp = ()=>{
    const firebaseStorageRef = firebase.storage().ref();
    const history = useHistory();

    const [inputFormData, setInputFormData] = useState({
        name: "",
        profile_pic: "default",
        branch: "",
        course: "",
        email: "",
        password: "",
        phoneNumber: "",
        type: "student"
    });

    const [progressbarState, setProgressbarState] = useState(false);


    const inputFieldChange = (event) => {
        const fieldName = event.target.name;
        let fieldValue = event.target.value;
        if(fieldName=="profile_pic"){
            fieldValue = event.target.files[0];
        }
        setInputFormData({...inputFormData, [fieldName]: fieldValue});
    }


    const {name, profile_pic, branch, course, email, password, phoneNumber} = inputFormData;

    const studentSignupFormSubmit = async (event) => {
        event.preventDefault();
        setProgressbarState(true);
        if(profile_pic!="default"){
            uploadProfilePictureOnFirebse(profile_pic);
        }else{
            saveSignupProfileDataOnServer("default");
        }
    }


    const saveSignupProfileDataOnServer = async (imageUrl)=>{
        const apiUrl = `/student/signup`;
        try {
            setProgressbarState(true);
            const data = {
                name, profile_pic: imageUrl, branch, course, email, password, phoneNumber, type: "student"
            }
            const serverResponse = await axios.post(apiUrl, data);
            if(serverResponse.status==201){
                setProgressbarState(false);
                setInputFormData({name: "", profile_pic: "default", branch: "", course: "", email: "", password: "", phoneNumber: ""});
                toast.success("Registration successfull.", reactToastStyle);
                setTimeout(()=>{
                    history.push("/login");
                }, 2000);
            }
        } catch (error) {
            setProgressbarState(false);
            console.log("Error mt "+error.response.data)
            toast.error(error.response.data, reactToastStyle);
        }
      }

    
    const uploadProfilePictureOnFirebse = (file)=>{
        //save user profile image on firebase storage
        try {
          const uploadTask = firebaseStorageRef.child(`student-profile-pictures/${(Date.now()) + (file.name)}`).put(file);
          uploadTask.on("state_changed",
           (snapshot)=>{
             //for handeling upload progress
            },
            (error) => {
              console.log(error.message);
              saveSignupProfileDataOnServer("default");

      
            },
            async () => {
              //Get image download url
              const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
              saveSignupProfileDataOnServer(imageUrl);
            }
           )
        } catch (error) {
          saveSignupProfileDataOnServer("default");
        }
      }


 





    return(
        <>
          <div className="signup_root_div">
           <div className="signup_main_div">
            <h2 style={{color: "#05e374", fontStyle: "italic", textAlign: "center"}}>Student Registration</h2>
            <ToastContainer />
            <hr className="hr_line" />
            <div className="signup_form_div">
            <form action="POST" className="signup" onSubmit={studentSignupFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label form_input_label">Name*</label>
                    <input type="text" placeholder="Enter name" className="form-control signup_form_input" id="exampleInputEmail1" aria-describedby="emailHelp" name="name" required value={name} onChange={inputFieldChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputBranch" className="form-label form_input_label">Branch*</label>
                    <input type="text" placeholder="Enter branch name" className="form-control signup_form_input" id="exampleInputEmail1" aria-describedby="emailHelp" name="branch" required  value={branch} onChange={inputFieldChange}  />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputCourse" className="form-label form_input_label">Course*</label>
                    <input type="text"  placeholder="Enter course name" className="form-control signup_form_input" id="exampleInputEmail1" aria-describedby="emailHelp" name="course" required  value={course} onChange={inputFieldChange}  />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputProfilePic" className="form-label form_input_label">Profoile Picture</label>
                    <input type="file" accept="image/*"  name="profile_pic" onChange={inputFieldChange} className="form-control signup_form_input" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail" className="form-label form_input_label">Email address*</label>
                    <input type="email" autoComplete="off" placeholder="Enter email address"  className="form-control signup_form_input" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" required  value={email} onChange={inputFieldChange}  />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label form_input_label" required value="">Password*</label>
                    <input type="password" autoComplete="off"  placeholder="Enter password"  className="form-control signup_form_input" id="exampleInputPassword1" name="password"  value={password} onChange={inputFieldChange}  />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPhone" className="form-label form_input_label">Phone Number*</label>
                    <input type="number" placeholder="Enter phone number" className="form-control signup_form_input" id="exampleInputPhone" aria-describedby="emailHelp" name="phoneNumber"  value={phoneNumber} onChange={inputFieldChange}  required />
                </div>
                <div className="d-flex justify-content-start align-items-center" style={{width: "500px"}}>
                <div>
                <button type="submit" className="btn btn-success mt-0"><PersonAddIcon className="mr-1"/>SignUp</button>
                </div>
                <div style={{width: "60px"}} className="ml-3 mr-4">
                {
                  progressbarState ? <CircularProgress style={{color: "green"}} /> : null
                }
                </div>
                <div>
                  <NavLink exact to="/login" ><p className=" mt-2">Already have an Account?</p></NavLink>
                </div>
                </div>
            </form>
            </div>
            </div>
            </div>
        </>
    );
}
export default SignUp;