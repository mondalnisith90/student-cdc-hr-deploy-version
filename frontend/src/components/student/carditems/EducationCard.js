import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import {useState } from 'react';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
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


const EducationCard = ({educationDetails, modelId, fetchStudentDataFromServer})=>{

    const [myEducation, setmyEducation] = useState({
        _id: educationDetails._id,
        collegeName: educationDetails.collegeName,
        degree: educationDetails.degree,
        spealization: educationDetails.spealization,
        marks: educationDetails.marks,
        startingDate: educationDetails.startingDate,
        endingDate: educationDetails.endingDate
      });
  
  
      const inputFieldChange = (event)=>{
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setmyEducation({...myEducation, [fieldName]: fieldValue});
      }
  
  
      const {_id, collegeName, degree, spealization, marks, startingDate, endingDate} = myEducation;
      
  
      const educationUpdateBtnClick = async ()=>{
        if(!collegeName.trim() || !degree.trim() || !spealization.trim() || !startingDate.trim() || !endingDate.trim()){
          alert("Please fill input fields properly.");
        }else{
          try {
            const apiUrl = `/student/educations/update`;
            const educationData = {education: myEducation};
            const serverResponse = await axios.put(apiUrl, educationData, {withCredentials: true});
            if(serverResponse.status == 200){
              fetchStudentDataFromServer();
              toast.success("Education updated successfully", reactToastStyle);
            }
          } catch (error) {
            toast.error(error.response.data, reactToastStyle);
          }
        }
      }


      const deleteBtnIconClick = async ()=>{
          const value = window.confirm("Are you sure to delete this information")
          if(value){
            try {
                const apiUrl = `/student/educations/delete`;
                const data = {educationDetails: educationDetails};
                const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
                if(serverResponse.status == 200){
                  fetchStudentDataFromServer();
                  toast.success("Education deleted successfully", reactToastStyle);
                }
            } catch (error) {
              toast.error(error.response.data, reactToastStyle);
            }
          }
        
      }




    return(
        <div className="p-0">
         <ToastContainer />
        <div className="col-lg-12 col-md-12 col-sm-12 col-12 m-auto d-block p-0">
        <div className="card my-3 shadow" style={{backgroundColor: "#ebf0ed", border: "3px solid #009431"}}>
          <div className="card-header d-flex justify-content-between"  style={{backgroundColor: "#009431", color: "white"}} >
          <div>
           <h5>{educationDetails.collegeName}</h5>
          </div>
          
          <div className="d-flex justify-content-center">
           <div className="mx-3">
               <EditIcon style={{cursor: "pointer"}} data-toggle="modal" data-target={"#"+modelId} />
           </div>
           <div>
               <DeleteIcon style={{cursor: "pointer"}} onClick={deleteBtnIconClick}  />
           </div>
          </div>
          </div>
          <div class="card-body">
            <p class="card-title"><b>Degree: </b>{educationDetails.degree}</p>
            <p class="card-title"><b>Spelization: </b>{educationDetails.spealization}</p>
            <p class="card-title"><b>Marks: </b>{educationDetails.marks}%</p>
            <p class="card-text"><b>Duration: </b>{educationDetails.startingDate}-{educationDetails.endingDate}</p>
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
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>School/College Name*</label>
               <TextField
               name="collegeName"
               value={collegeName}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter school/college name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Degree*</label>
               <TextField
               name="degree"
               value={degree}
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
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Spealization*</label>
               <TextField
               name="spealization"
               value={spealization}
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
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Marks(in %)</label>
               <TextField
               name="marks"
               value={marks}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter marks"
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
                placeholder="Degree starting date"
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
                placeholder="Degree ending date"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={educationUpdateBtnClick} ><SaveIcon />Save</button>
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

export default EducationCard;