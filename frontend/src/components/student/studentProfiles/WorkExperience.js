import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {currentUserDataContext} from "../../../App";
import WorkExperienceCard from "../carditems/WorkExperienceCard";
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



const WorkExperience = ({studentWorkExperience, fetchStudentDataFromServer})=>{


    const {currentUserData, setCurrentUserData} = currentUserDataContext;
    const [workExperience, setWorkExperience] = useState({
      jobTitle: "",
      companyName: "",
      workDesctription: "",
      companyAddress: "",
      startingDate: "",
      endingDate: ""
    });


    const inputFieldChange = (event)=>{
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setWorkExperience({...workExperience, [fieldName]: fieldValue})
    }


    const {jobTitle, companyName, workDesctription, companyAddress, startingDate, endingDate} = workExperience;



    const workExperienceAddBtnClick = async ()=>{
      if(!jobTitle.trim() || !companyName.trim() || !workDesctription.trim() || !companyAddress.trim() || !startingDate.trim() || !endingDate.trim()){
        alert("Please fill all the fields properly.");
      }else{
        try {
          const apiUrl = `/student/work-experiences/add`;
          const workExperienceData = {workExprience: workExperience};
          const serverResponse = await axios.put(apiUrl, workExperienceData, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Work experience added successfully", reactToastStyle);
            setWorkExperience({
              jobTitle: "",
              companyName: "",
              workDesctription: "",
              companyAddress: "",
              startingDate: "",
              endingDate: ""
            });
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
          <p style={{textAlign: "start", color: "#ee00aa", fontSize: "22px"}}><b>Work Experiences</b> </p>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 text-start">
            <button type="button" className="btn btn-primary fw-bold" data-toggle="modal" data-target="#exampleModalCenterworkexperience" style={{fontSize: "13px"}}>Add Experience</button>
          </div>
         </div>
        <hr/>

           <div className="row mt-0 text-start">
           {
            studentWorkExperience && studentWorkExperience.length==0 ? <p>No Work Experience</p> : null
           }

            {
              
              studentWorkExperience.map((object, index)=>{
                return(
                   <WorkExperienceCard workExperienceDetails={object} modelId={"MyId"+object._id} fetchStudentDataFromServer={fetchStudentDataFromServer} key={index} />
                )
              })
            }
            </div>
             {/* modal */}
          <div className="modal fade text-start" id="exampleModalCenterworkexperience" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Work Experiences</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Job Title*</label>
               <TextField
               name="jobTitle"
               value={jobTitle}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter job title"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Company Name*</label>
               <TextField
               name="companyName"
               value={companyName}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter company name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Work Description*</label>
               <TextField
               name="workDesctription"
               value={workDesctription}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter work description"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>


              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Company Address*</label>
               <TextField
               name="companyAddress"
               value={companyAddress}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter company address"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>


              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Starting Date*</label>
               <TextField
               name="startingDate"
               value={startingDate}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Job starting date"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>


              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Ending Date*</label>
               <TextField
               name="endingDate"
               value={endingDate}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Job ending date"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={workExperienceAddBtnClick} ><SaveIcon />Save</button>
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


export default WorkExperience;