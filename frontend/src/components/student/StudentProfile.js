import Button from '@material-ui/core/Button';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import profile_image_url from "../../images/default1.png";
import axios from 'axios';
import {currentUserDataContext} from "../../App";
import "../../css/StudentProfile.css";
import Cookies from 'js-cookie';
import SkillsComponent from './studentProfiles/SkillsComponent';
import EducationComponent from './studentProfiles/EducationComponent';
import ProjectsProfile from './studentProfiles/ProjectsProfile';
import WorkExperience from './studentProfiles/WorkExperience';
import LanguageProfile from './studentProfiles/LanguageProfile';
import FieldofInterestProfile from './studentProfiles/FieldofInterestProfile';
import VideoUrlProfile from './studentProfiles/VideoUrlProfile';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
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




const StudentProfile = () => {
   const firebaseStorageRef = firebase.storage().ref();
    const {currentUserData, setCurrentUserData}  = useContext(currentUserDataContext);
    const [updateImageButtonState, setUpdateImageButtonState] = useState(false);
    const [studentData, setStudentData] = useState({});
    const [imageProgressbarState, setImageProgressbarState] = useState(false);
    const [inputFieldData, setInputFieldData] = useState({
      name: "",
      profile_pic: "",
      profile_pic_url: "",
      branch: "",
      course: "",
      email: "",
      phoneNumber: "",
      linkedinLink: "",
      address: "",
      carrierObjective: ""
    });


    const {name, profile_pic, profile_pic_url, branch, course, email, phoneNumber, linkedinLink, address, carrierObjective} = inputFieldData;

    
    const fetchStudentDataFromServer = async ()=>{
      const apiUrl = `/student/search/${currentUserData.userId}`;
      // const apiUrl = `http://localhost:8000/student/search/${currentUserData.userId}`;
      
      try {
        const serverResponse = await axios.get(apiUrl);
        if(serverResponse.status == 200){
          setStudentData(serverResponse.data);
          setInputFieldData({...inputFieldData, profile_pic_url: serverResponse.data.profile_pic!="default"?serverResponse.data.profile_pic : profile_image_url});
        }
      } catch (error) {
        console.log(error.message);
      }
    }


    useEffect( async ()=>{
      fetchStudentDataFromServer();
    }, []);

    useEffect(()=>{
      if(profile_pic){
        setInputFieldData({...inputFieldData, profile_pic_url: URL.createObjectURL(profile_pic)});
        setUpdateImageButtonState(true);
      }
    }, [profile_pic]);







    const inputFieldChange = (event) => {
        const fieldName = event.target.name;
        let fieldValue = event.target.value;
        if(fieldName=="profile_pic"){
          fieldValue = event.target.files[0];
          // console.log("Uploaded profile picture");
          // console.log(fieldValue);
        }
        setInputFieldData({...inputFieldData, [fieldName]: fieldValue});
    }



    const profileEditIconClick = ()=>{
      setInputFieldData({...inputFieldData, name: studentData.name, branch: studentData.branch, course: studentData.course, email: studentData.email, phoneNumber: studentData.phoneNumber, linkedinLink: studentData.linkedinLink, address: studentData.address, carrierObjective: studentData.carrierObjective});
    }



    const profileAddBtnClick = async () => {
        
        try {
            const apiUrl = `/student/update/${currentUserData.userId}`;
            const data = {
             name, branch, course, phoneNumber, linkedinLink, address, carrierObjective
            };
            const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
            if(serverResponse.status == 200){
              fetchStudentDataFromServer();
              toast.success("Profile updated successfully", reactToastStyle);
            }
        } catch (error) {
            toast.error("Profile not update "+error.response.data, reactToastStyle);
        }

    }


    const onSaveImageButtonClick = ()=>{
      // alert("Image save button click.");
      uploadProfilePictureOnFirebse(profile_pic);
      setImageProgressbarState(true);
    }

    const onCancelImageButtonClick = ()=>{
      setUpdateImageButtonState(false);
      setInputFieldData({...inputFieldData, profile_pic_url: studentData.profile_pic!="default"?studentData.profile_pic : profile_image_url, profile_pic: ""});
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
            setImageProgressbarState(false);
            setUpdateImageButtonState(false);
    
          },
          async () => {
            //Get image download url
            const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
            // save user data on server with his/her profile image
            saveProfileImageUrlOnServer(imageUrl);
          }
         )
      } catch (error) {
        setImageProgressbarState(false);
        toast.error("Profile image not update ", reactToastStyle);
        setUpdateImageButtonState(false);
      }
    }


    

    const saveProfileImageUrlOnServer = async (imageUrl)=>{
      //Save firebase profile image link on nodejs server
      try {
        const apiUrl = `/student/update/${currentUserData.userId}`;
        const data = {profile_pic: imageUrl};
        const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
        if(serverResponse.status == 200){
          toast.success("Profile image updated successfully", reactToastStyle);
          setImageProgressbarState(false);
          setUpdateImageButtonState(false);
          //Reload current user data from server
          fetchStudentDataFromServer();
        }
      } catch (error) {
        toast.error("Profile image not update ", reactToastStyle);
        setImageProgressbarState(false);
        setUpdateImageButtonState(false);
      }
    }


    return(
        <>
        <section className="myprofile_root_div d-flex justify-content-center align-items-center">
        <ToastContainer />
        <div className="text-center shadow header_div_style p-0 ">
           <img src={profile_pic_url} alt="" className="myprofile_profile_pic" />
          
           <input accept="image/*" id="icon-button-file" type="file"  style={{display: "none"}} onChange={inputFieldChange} name="profile_pic" />
              <label htmlFor="icon-button-file">
                <IconButton color="secondary" aria-label="upload picture" component="span" >
                <Tooltip title="Change Profile Picture">
                  <CameraAltIcon className="myprofile_camera_icon"   data-toggle="modal" data-target="#exampleModal"/>
                  </Tooltip>
                </IconButton>
              </label>
              {updateImageButtonState ? 
           <>
           <div className="d-flex align-items-center justify-content-center mt-2">
             <div className="mr-3">
              <Button variant="contained" className="update_image_button" onClick={onSaveImageButtonClick}  startIcon={<SaveIcon />} >
                  Save
              </Button>
             </div>
             <div>
               {imageProgressbarState ? <CircularProgress color="primary" className="mr-3" /> : null }
             </div>
             <div>
             <Button variant="contained" color="secondary" className="cancel_image_button" onClick={onCancelImageButtonClick}    startIcon={<CancelIcon />} >
                  Cancel
              </Button>
             </div>
           </div>
           </> : null }





           <h2 className="myprofile_user_name">{studentData.name}<EditIcon className="edit_profile_icon" onClick={profileEditIconClick}  data-toggle="modal" data-target="#exampleModalCenterstudentprofile" /></h2>
             <hr className="hr_line" />
           <div className="row text-start  mt-4">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
             <p><b>Qualification: </b>{studentData.course} in {studentData.branch}</p>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 text-lg-end text-md-end text-sm-start text-start">
              <p><b>Phone Number: </b>{studentData.phoneNumber}</p>
            </div>
           </div>

            <div className="row text-start" style={{marginTop: "-10px"}}>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
            <p><b>Linkedin Link: </b><a href={studentData.linkedinLink} target="_blank" style={{fontSize: "15px"}}>{studentData.linkedinLink}</a></p>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 text-lg-end text-md-end text-sm-start text-start">
              <p><b>Email Id: </b>{studentData.email}</p>
            </div>
           </div>

           <div className="text-start" style={{marginTop: "-10px"}}>
             <p><b>Address:  </b>{studentData.address}</p>
           </div>


              {/* modal */}
          <div className="modal fade text-start" id="exampleModalCenterstudentprofile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Edit Profile</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Student Name*</label>
               <TextField
               name="name"
               value={name}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter your name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Highest Degree name*</label>
               <TextField
               name="course"
               value={course}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter degree name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Highest Degree Spealization*</label>
               <TextField
               name="branch"
               value={branch}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter Spealization"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>


              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Phone Number*</label>
               <TextField
               name="phoneNumber"
               value={phoneNumber}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter phone number"
                fullWidth
                margin="normal"
                type="number"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>


              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Linkedin Profile Link*</label>
               <TextField
               name="linkedinLink"
               value={linkedinLink}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter github link"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Parmanent Address*</label>
               <TextField
               name="address"
               value={address}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter your parmanent address"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Carrier Objective*</label>
               <TextField
               name="carrierObjective"
               value={carrierObjective}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter your carrier objective"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

             </div>
             <div className="modal-footer d-flex justify-content-start align-items-center">
             <div>
             <button type="button" className="btn btn-secondary" data-dismiss="modal"  >Close</button>
             </div>
               <div>
               <button type="button" className="btn btn-primary update_profile_button" onClick={profileAddBtnClick} ><SaveIcon />Save</button>
               </div>
               <div>
               </div>
               
             </div>
           </div>
         </div>
         </div>


           
           <hr className="hr_line"/>

          
            <p style={{textAlign: "start"}}>
           <b>Carrier Objective: </b> <br/> {studentData.carrierObjective}
           </p>
           <hr className="hr_line"/>
           <SkillsComponent  studentSkills = {studentData.skills ? studentData.skills : []} fetchStudentDataFromServer={fetchStudentDataFromServer} />
           <hr className="hr_line mb-4 mt-4"/>
           <EducationComponent studentEducations = {studentData.education ? studentData.education : []} fetchStudentDataFromServer={fetchStudentDataFromServer} />
           <hr className="hr_line mb-4 mt-4"/>
           <ProjectsProfile  studentProjects = {studentData.projects ? studentData.projects : []} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
           <hr className="hr_line mb-4 mt-4"/>
           <WorkExperience  studentWorkExperience = {studentData.workExprience ? studentData.workExprience : []} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
           <hr className="hr_line mb-4 mt-4"/>
           <LanguageProfile  studentLanguages = {studentData.languages ? studentData.languages : []} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
           <hr className="hr_line mb-4 mt-4"/>
           <FieldofInterestProfile  studentFieldOfInterest = {studentData.fieldsOfInterest ? studentData.fieldsOfInterest : []} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
           <hr className="hr_line mb-4 mt-4"/>
           <VideoUrlProfile  studentVideoUrls = {studentData.videoUrl ? studentData.videoUrl : []} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
           <hr className="hr_line mb-4 mt-4"/> 




         </div>
        </section>
        </>
    );
}


export default StudentProfile;