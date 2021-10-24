import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {currentUserDataContext} from "../../../App";
import DeleteIcon from '@material-ui/icons/Delete';
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



const SkillsComponent = ({studentSkills, fetchStudentDataFromServer})=>{

    const {currentUserData, setCurrentUserData} = currentUserDataContext;
    //useState for skill add
    const [newSkill, setNewSkill] = useState("");
    //useState for skill delete
    const [skillName, setSkillName] = useState("");


    const inputFieldChange = (event)=>{
      const fieldValue = event.target.value;
      setNewSkill(fieldValue);
    }

    const inputDeleteSkillFieldChange = (event)=>{
      const fieldValue = event.target.value;
      setSkillName(fieldValue);
    }



    const skillAddBtnClick = async ()=>{
      if(newSkill.trim().length<1){
        alert("Write skill name in input field.");
      }else{
        try {
          const apiUrl = `/student/skills/update`;
          const data = {skill: newSkill};
          const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Skill added successfully", reactToastStyle);
            setNewSkill("");
          }
        } catch (error) {
          toast.error(error.response.data, reactToastStyle);
        }
      }
    }


    const skillDeleteBtnClick = async ()=>{
      if(!skillName.trim()){
        alert("Please fill input field properly.");
      }else{
        try {
          const apiUrl = `/student/skills/delete`;
          const data = {skill: skillName};
          const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Skill deleted successfully", reactToastStyle);
            setSkillName("");
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
          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
            <p style={{textAlign: "start", fontSize: "24px", color: "#ee00aa"}}><b>Skills</b></p>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 d-flex justify-content-between align-items-center" >
          <div className="">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" style={{fontSize: "13px"}}>Add Skill</button>
          </div>
          <div className="text-start">
            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModalCenterdeleteskill" style={{fontSize: "13px"}}>Delete Skill</button>
          </div>
          </div>
         </div>

        <hr />
        
           <div className="row mb-0 text-start">
             {
              studentSkills && studentSkills.length==0 ? <p>No skills found</p> : null
             } 
             {
              studentSkills.map((skill, index)=>{
                return(
                  <div className="col-lg-3 col-md-3 col-sm-4 col-6 text-center" key={index}>
                  <button type="button" class="btn btn-success my-1" style={{fontSize: "15px", width: "110px"}}>{skill}</button>

                    {/* <div style={{backgroundColor: "green", color: "white", borderRadius: "17px", padding: "10px 3px 1px 3px", textAlign: "center"}}><p></p></div> */}
                  </div>
                )
              })
             }
            </div>
             {/* add modal */}
          <div className="modal fade text-start" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Add Skills</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Add Skills</label>
               <TextField
               name="newSkill"
               value={newSkill}
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
             </div>
             <div className="modal-footer d-flex justify-content-start align-items-center">
             <div>
             <button type="button" className="btn btn-secondary" data-dismiss="modal"  >Close</button>
             </div>
               <div>
               <button type="button" className="btn btn-primary update_profile_button" onClick={skillAddBtnClick} ><SaveIcon />Add</button>
               </div>
               <div>
               </div>
             </div>
           </div>
         </div>
         </div>


        {/* Delete modal */}
        <div className="modal fade text-start" id="exampleModalCenterdeleteskill" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Delete Skill</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Skill Name*</label>
               <TextField
               name="skillName"
               value={skillName}
               onChange={inputDeleteSkillFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter skill name"
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
               <button type="button" className="btn btn-danger" onClick={skillDeleteBtnClick} ><DeleteIcon style={{fontSize: "16px !important"}} />Delete</button>
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


export default SkillsComponent;