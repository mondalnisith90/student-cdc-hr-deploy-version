import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

const WorkExperienceCard = ({workExperienceDetails, modelId, fetchStudentDataFromServer})=>{
  

        const [studentWorkExperience, setStudentWorkExperience] = useState({
            _id: workExperienceDetails._id,
            jobTitle: workExperienceDetails.jobTitle,
            companyName: workExperienceDetails.companyName,
            workDesctription: workExperienceDetails.workDesctription,
            companyAddress: workExperienceDetails.companyAddress,
            startingDate: workExperienceDetails.startingDate,
            endingDate: workExperienceDetails.endingDate
          });
      
      
          const inputFieldChange = (event)=>{
            const fieldName = event.target.name;
            const fieldValue = event.target.value;
            setStudentWorkExperience({...studentWorkExperience, [fieldName]: fieldValue});
          }
      
      
          const {_id, jobTitle, companyName, workDesctription, companyAddress, startingDate, endingDate} = studentWorkExperience;
      
      
          const editIconClick = ()=>{
            setStudentWorkExperience(
              {...studentWorkExperience, 
              _id: workExperienceDetails._id,
              jobTitle: workExperienceDetails.jobTitle,
              companyName: workExperienceDetails.companyName,
              workDesctription: workExperienceDetails.workDesctription,
              companyAddress: workExperienceDetails.companyAddress,
              startingDate: workExperienceDetails.startingDate,
              endingDate: workExperienceDetails.endingDate});
          }
          
      
          const experienceUpdateBtnClick = async ()=>{
            if(! jobTitle.trim() || !companyName.trim() || !workDesctription.trim() || !companyAddress.trim() || !startingDate.trim() || !endingDate.trim()){
              alert("Please fill input fields properly.");
            }else{
              try {
                const apiUrl = `/student/work-experiences/update`;
                const workExprienceData = {workExprience: studentWorkExperience};
                const serverResponse = await axios.put(apiUrl, workExprienceData, {withCredentials: true});
                if(serverResponse.status == 200){
                  fetchStudentDataFromServer();
                  alert(".");
                  toast.success("Work experience update successfully", reactToastStyle);
                }
              } catch (error) {
                toast.error(error.response.data, reactToastStyle);
              }
            }
        }


        const deleteBtnIconClick = async ()=>{
            const value = window.confirm("Are you sure to delete this information");
            if(value){
              try {
                  const apiUrl = `/student/work-experiences/delete`;
                  const data = {workExprienceDetails: workExperienceDetails};
                  const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
                  if(serverResponse.status == 200){
                    fetchStudentDataFromServer();
                    toast.success("Work experience deleted successfully", reactToastStyle);
                  }
              } catch (error) {
                  toast.error(error.response.data, reactToastStyle);
              }
            }
          
        }


    return(
        <div className="p-0">
         <ToastContainer />
        <div className="col-lg-12 col-md-12 col-sm-12 col-12 m-auto d-block p-2">
        <div className="card my-3 shadow" style={{backgroundColor: "#ebf0ed", border: "3px solid orange"}}>
          <div className="card-header  d-flex justify-content-between"  style={{backgroundColor: "orange", color: "white"}} >
          <div className="">
           <h5>{workExperienceDetails.jobTitle}</h5>
          </div>
          
          <div className="d-flex justify-content-center">
           <div className="mx-3">
               <EditIcon style={{cursor: "pointer"}}  onClick={editIconClick} data-toggle="modal" data-target={"#"+modelId} />
           </div>
           <div>
               <DeleteIcon style={{cursor: "pointer"}} onClick={deleteBtnIconClick}  />
           </div>
          </div>
          </div>
          <div class="card-body">
            <p class="card-title"><b>Company Name: </b>{workExperienceDetails.companyName}</p>
            <p class="card-title"><b>Work Description: </b>{workExperienceDetails.workDesctription}</p>
            <p class="card-title"><b>Company Address: </b>{workExperienceDetails.companyAddress}</p>
            <p class="card-text"><b>Duration: </b>{workExperienceDetails.startingDate}-{workExperienceDetails.endingDate}</p>
          </div>
        </div>
        </div>


        
           {/* modal */}
           <div className="modal fade text-start" id={modelId} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Edit Education</h5>
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
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Job Description*</label>
               <TextField
               name="workDesctription"
               value={workDesctription}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter job description in short"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={experienceUpdateBtnClick} ><SaveIcon />Save</button>
               </div>
               <div>
               </div>
               
             </div>
           </div>
         </div>
         </div>
        </div>
     );
}

export default WorkExperienceCard;