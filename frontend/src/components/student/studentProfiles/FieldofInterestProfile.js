import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {currentUserDataContext} from "../../../App";
import { ToastContainer, toast } from 'react-toastify';


const reactToastStyle = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    };



const FieldofInterestProfile = ({studentFieldOfInterest, fetchStudentDataFromServer})=>{

    const {currentUserData, setCurrentUserData} = currentUserDataContext;
    const [fieldOfInterest, setFieldOfInterest] = useState("");


    const inputFieldChange = (event)=>{
      const fieldValue = event.target.value;
      setFieldOfInterest(fieldValue);
    }



    const languageAddBtnClick = async ()=>{
      if(!fieldOfInterest.trim()){
        alert("Please fill all input fields properly.");
      }else{
        try {
          const apiUrl = `/student/field-of-interest/add`;
          const data = {fieldOfInterest: fieldOfInterest};
          const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Data added successfully", reactToastStyle);
            setFieldOfInterest("");
          }
        } catch (error) {
          toast.error(error.response.data, reactToastStyle);
        }
      }
    }



    return(
        <>
        <div>
        <ToastContainer />
        <div className="row m-auto">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <p style={{textAlign: "start", fontSize: "24px", color: "#ee00aa"}}><b>Field of Interests</b></p>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 text-start">
            <button type="button" className="btn btn-primary fw-bold" data-toggle="modal" data-target="#exampleModalCenterfieldofinterest" style={{fontSize: "13px"}}>Add Interest</button>
          </div>
         </div>

        <hr />

           <div className="row mt-0 text-start p-2">
             {
              studentFieldOfInterest && studentFieldOfInterest.length==0 ? <p>Add your interests</p> : null
             } 
             {
              studentFieldOfInterest.map((fieldsOfInterest, index)=>{

                const videoDeleteIconClick = async ()=>{
                   const value = window.confirm("Are you sure to delete this information.");
                   if(value){
                   try {
                       const apiUrl = `/student/field-of-interest/delete`;
                       const data = {fieldsOfInterest: fieldsOfInterest};
                       const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
                       if(serverResponse.status == 200){
                           fetchStudentDataFromServer();
                           toast.success("Data deleted successfully", reactToastStyle);
                       }
                   } catch (error) {
                       toast.error(error.response.data, reactToastStyle);
                   }
                   }
                 }

                return(
                  <div className="col-12 card shadow p-2 my-1 d-flex justify-content-between flex-row"  key={index}>
                    <div><p style={{fontWeight: "600", marginTop: "8px"}}>{fieldsOfInterest}</p></div>
                    <div>
                      <DeleteIcon style={{color: "#eb0273", cursor: "pointer"}} onClick={videoDeleteIconClick} />
                    </div>
                  </div>
                )
              })
             }
            </div>
             {/* modal */}
          <div className="modal fade text-start" id="exampleModalCenterfieldofinterest" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Field of Interest</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Add your fields of Interests*</label>
               <TextField
               name="fieldOfInterest"
               value={fieldOfInterest}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Fields of interests"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={languageAddBtnClick} ><SaveIcon />Add</button>
               </div>
               <div>
               </div>
               
             </div>
           </div>
         </div>
         </div>
        </div>
        </>
    );
}


export default FieldofInterestProfile;