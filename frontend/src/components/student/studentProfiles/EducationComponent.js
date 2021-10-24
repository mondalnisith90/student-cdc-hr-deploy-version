import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {useState } from 'react';
import EducationCard from '../carditems/EducationCard';
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




const EducationComponent = ({studentEducations, fetchStudentDataFromServer})=>{


    const [education, setEducation] = useState({
      collegeName: "",
      degree: "",
      spealization: "",
      marks: "",
      startingDate: "",
      endingDate: ""
    });


    const inputFieldChange = (event)=>{
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setEducation({...education, [fieldName]: fieldValue});
    }


    const {collegeName, degree, spealization, marks, startingDate, endingDate, dateTime} = education;



    const educationAddBtnClick = async ()=>{
      if(!collegeName.trim() || !degree.trim() || !spealization.trim() || !startingDate.trim() || !endingDate.trim()){
        alert("Write skill name in input field.");
      }else{
        try {
          const apiUrl = `/student/educations/add`;
          const educationData = {education: education};
          const serverResponse = await axios.put(apiUrl, educationData, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Education added successfully", reactToastStyle);
            setEducation({
              collegeName: "",
              degree: "",
              spealization: "",
              marks: "",
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
          <div className="col-lg-6 col-md-6 col-sm-6 col-12">
            <p style={{textAlign: "start", fontSize: "24px", color: "#ee00aa"}}><b>Educations</b></p>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-12 text-start">
            <button type="button" className="btn btn-primary fw-bold" data-toggle="modal" data-target="#exampleModalCentereducation" style={{fontSize: "13px"}}>Add Education</button>
          </div>
         </div>

        <hr />
           <div className="row text-start p-0 m-0">
            {
              studentEducations.map((educationDetails, index)=>{
                return(
                  <EducationCard key={index} modelId={"exampleModalCentereducation"+index} educationDetails={educationDetails} fetchStudentDataFromServer={fetchStudentDataFromServer} />
                )
              })
            }
            </div>

            
             {/* modal */}
          <div className="modal fade text-start" id="exampleModalCentereducation" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={educationAddBtnClick} ><SaveIcon />Save</button>
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


export default EducationComponent;