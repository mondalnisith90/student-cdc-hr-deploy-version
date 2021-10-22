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
import profile_image_url from "../../images/default_hr.png";
import axios from 'axios';
import {currentUserDataContext} from "../../App";
import "../../css/HrProfile.css";
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


const HrProfile = () => {
  const firebaseStorageRef = firebase.storage().ref();
  const {currentUserData, setCurrentUserData}  = useContext(currentUserDataContext);
  const [updateImageButtonState, setUpdateImageButtonState] = useState(false);
  const [imageProgressbarState, setImageProgressbarState] = useState(false);
  const [inputFieldsData, setInputFieldsData] = useState({
    name: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    address: "",
    linkedinLink: "",
    profile_pic: "",
    profile_pic_url: profile_image_url
});
  const [hrData, setHrData] = useState({
    hrName: "",
    hrEmail: "",
    hrCompanyName: "",
    hrPhoneNumber: "",
    hrAddress: "",
    hrLinkedinLink: "",
    hrProfile_pic: ""
  });


  const inputFieldChange = (event) => {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;
    console.log("Image change");
    if(fieldName=="profile_pic"){
      console.log("Hr profile image file");
      console.log(event.target.files[0])
      fieldValue = event.target.files[0];
    }
    setInputFieldsData({...inputFieldsData, [fieldName]: fieldValue});
  }

  const {name, email, companyName, phoneNumber, address, linkedinLink, profile_pic, profile_pic_url} = inputFieldsData;
  const { hrName, hrEmail, hrCompanyName, hrPhoneNumber, hrAddress, hrLinkedinLink, hrProfile_pic} = hrData;

  const fetchHrDataFromServer = async () => {
    //Featch HR data from server
    const apiUrl = `/hr/search/${currentUserData.userId}`;
    try {
      const serverResponse = await axios.get(apiUrl, {withCredentials: true});
      if(serverResponse.status == 200){
        console.log("Hr profile fetch data...")
        console.log(serverResponse.data);
        const data = serverResponse.data;
        setHrData({...hrData, hrName: data.name, hrEmail: data.email, hrCompanyName: data.companyName, hrPhoneNumber: data.phoneNumber+"", hrAddress: data.address, hrLinkedinLink: data.linkedinLink, hrProfile_pic: data.profile_pic});
        setInputFieldsData({...inputFieldsData, name: data.name, email: data.email, companyName: data.companyName, phoneNumber: data.phoneNumber+"", address: data.address, linkedinLink: data.linkedinLink, profile_pic_url: data.profile_pic!="default" ? data.profile_pic : profile_image_url});
      }
    } catch (error) {
      console.log(error.message);
    }
  }



  useState(()=>{
    fetchHrDataFromServer();
  }, []);

  useEffect(()=>{
    if(profile_pic){
      setInputFieldsData({...inputFieldsData, profile_pic_url: URL.createObjectURL(profile_pic)});
      setUpdateImageButtonState(true);
    }
  }, [profile_pic]);


  const onSaveImageButtonClick = ()=>{
    // alert("Image save button click.");
    uploadProfilePictureOnFirebse(profile_pic);
    setImageProgressbarState(true);
  }

  const onCancelImageButtonClick = ()=>{
    setUpdateImageButtonState(false);
    setInputFieldsData({...inputFieldsData, profile_pic_url: hrData.hrProfile_pic!="default"?hrData.hrProfile_pic : profile_image_url, profile_pic: ""});
  }


  const uploadProfilePictureOnFirebse = (file)=>{
    //save user profile image on firebase storage
    try {
      const uploadTask = firebaseStorageRef.child(`hr-profile-pictures/${(Date.now()) + (file.name)}`).put(file);
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
      const apiUrl = `/hr/update-profile`;
      const data = {profile_pic: imageUrl};
      const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
      if(serverResponse.status == 200){
        toast.success("Profile image updated successfully", reactToastStyle);
        setImageProgressbarState(false);
        setUpdateImageButtonState(false);
        //Reload current user data from server
        fetchHrDataFromServer();
      }
    } catch (error) {
      toast.error("Profile image not update ", reactToastStyle);
      setImageProgressbarState(false);
      setUpdateImageButtonState(false);
    }
  }



  const inputValidation = ()=>{
    //Check input fields validation
    if(! name.trim() || !email.trim() || ! companyName.trim()  || ! phoneNumber.trim()){
      alert("Please fill input fields properly.");
      return false;
    }else if(phoneNumber.trim().length != 10){
      alert("Phone number must be of 10 digits.");
      return false;
    }
    else{
      return true;
    }
  }

  const profileEditIconClick = ()=>{
    setInputFieldsData({...inputFieldsData, name: hrName, email: hrEmail, companyName: hrCompanyName, phoneNumber: hrPhoneNumber, address: hrAddress, linkedinLink: hrLinkedinLink});
  }




  const hrProfileUpdateBtnClick = async ()=>{

    try {
      if(inputValidation()){
        //when validation is ok
        const apiUrl = `/hr/update-profile`;
        const data = {
          name, companyName, phoneNumber, address, linkedinLink
        }
        const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
        console.log(serverResponse);
        if(serverResponse.status == 200){
          const model = document.getElementById("exampleModalCenter");
          fetchHrDataFromServer();
          toast.success("Profile updated successfully", reactToastStyle);
        }
      }
    } catch (error) {
      toast.error(error.response.data, reactToastStyle);
    }
  }


    return(
      <>
      <section className="myprofile_root_div d-flex justify-content-center">
      <ToastContainer />
      <div className="text-center header_div_style p-4 shadow" style={{backgroundColor: "#fcfcfc"}}>
         <img src={profile_pic_url} alt="" className="myprofile_profile_pic" />
        
         <input accept="image/*" id="icon-button-file" type="file"   onChange={inputFieldChange} name="profile_pic" style={{display: "none"}} />
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


         <h2 className="myprofile_user_name mb-4" style={{color: "#ee00aa"}}>{hrName} <EditIcon className="edit_profile_icon" onClick={profileEditIconClick} data-toggle="modal" data-target="#exampleModalCenter" /></h2>
          <hr/>
         <p style={{textAlign: "start"}}><b>Email Address: </b>{hrEmail}</p>
         <p style={{textAlign: "start"}}><b>Company Name:  </b>{hrCompanyName}</p>
         <p style={{textAlign: "start"}}><b>Phone Number: </b>{hrPhoneNumber}</p>
         <p style={{textAlign: "start"}}><b>Current Address:  </b>{hrAddress}</p>
         <p style={{textAlign: "start"}}><b>Linkedin Link:  </b><a href={hrLinkedinLink} target="_blank" >{hrLinkedinLink}</a></p>


           {/* modal */}
        <div className="modal fade text-start" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>User Name*</label>
             <TextField
             name="name"
             value={name}
             onChange={inputFieldChange}
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter Skills"
              fullWidth
              margin="normal"
              InputLabelProps={{
              shrink: true,
              }} />
            </div>

            <div>
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Email Address*</label>
             <TextField
             name="email"
             disabled
             value={email}
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter Skills"
              fullWidth
              margin="normal"
              InputLabelProps={{
              shrink: true,
              }} />
            </div>

            <div>
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Company Name*</label>
             <TextField
             onChange={inputFieldChange}
             name="companyName"
             value={companyName}
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter Skills"
              fullWidth
              margin="normal"
              InputLabelProps={{
              shrink: true,
              }} />
            </div>

            <div>
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Phone Number*</label>
             <TextField
             onChange={inputFieldChange}
             name="phoneNumber"
             value={phoneNumber}
             type="number"
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter Skills"
              fullWidth
              margin="normal"
              InputLabelProps={{
              shrink: true,
              }} />
            </div>


            <div>
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Current Address</label>
             <TextField
             onChange={inputFieldChange}
             name="address"
             value={address}
             type="text"
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter your current address"
              fullWidth
              margin="normal"
              InputLabelProps={{
              shrink: true,
              }} />
            </div>

            
            <div>
             <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Linkedin Link</label>
             <TextField
             onChange={inputFieldChange}
             name="linkedinLink"
             value={linkedinLink}
             type="text"
              id="standard-full-width"
              style={{ margin: "8px"}}
              placeholder="Enter Linkedin link"
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
             <button type="button" className="btn btn-primary update_profile_button" onClick={hrProfileUpdateBtnClick} ><SaveIcon />Save</button>
             </div>
             <div>
             </div>
             
           </div>
         </div>
       </div>
       </div>

       {/* modal */}

      {/* <Button variant="contained" color="secondary" className="update_profile_button"  data-toggle="modal" data-target="#exampleModalCenter"  startIcon={<EditIcon />} >
       Edit Profile
     </Button> */}
       </div>
      </section>
      </>
    );
}


export default HrProfile;