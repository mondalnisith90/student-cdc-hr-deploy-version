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


const ProjectCard = ({projectDetails, modelId, fetchStudentDataFromServer})=>{


  const [studentProject, setStudentProject] = useState({
       _id: projectDetails._id,
       projectName: projectDetails.projectName,
       description: projectDetails.description,
       projectUrl: projectDetails.projectUrl,
       startingDate: projectDetails.startingDate,
       endingDate: projectDetails.endingDate
  });
  
  
      const inputFieldChange = (event)=>{
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setStudentProject({...studentProject, [fieldName]: fieldValue});
      }

      // console.log("Project card items");
      // console.log(projectDetails)
  
  
      const {_id, projectName, description, projectUrl, startingDate, endingDate} = studentProject;

      const editIconBtnClick = ()=>{
             setStudentProject({...studentProject,
             _id: projectDetails._id,
             projectName: projectDetails.projectName,
             description: projectDetails.description,
             projectUrl: projectDetails.projectUrl,
             startingDate: projectDetails.startingDate,
             endingDate: projectDetails.endingDate});
      }
      
  
      const projectUpdateBtnClick = async ()=>{
        if(!projectName.trim() || !description.trim() || !projectUrl.trim() || !startingDate.trim() || !endingDate.trim()){
          alert("Please fill input fields properly.");
        }else{
          try {
            const apiUrl = `/student/projects/update`;
            const projectData = {project: studentProject};
            const serverResponse = await axios.put(apiUrl, projectData, {withCredentials: true});
            if(serverResponse.status == 200){
              fetchStudentDataFromServer();
              toast.success("Project updated successfully", reactToastStyle);
            }
          } catch (error) {
            toast.error(error.response.data, reactToastStyle);
          }
        }
      }


      const deleteBtnIconClick = async ()=>{
          const value = window.confirm("Are you sure to delete this project")
          if(value){
            try {
                const apiUrl = `/student/projects/delete`;
                const data = {projectDetails: projectDetails};
                const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
                if(serverResponse.status == 200){
                  fetchStudentDataFromServer();
                  toast.success("Project deleted successfully", reactToastStyle);
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
         <div class="card my-3 shadow" style={{backgroundColor: "#ebf0ed", border: "3px solid #e00476"}}>
           <div class="card-header d-flex justify-content-between"  style={{backgroundColor: "#e00476", color: "white"}} >
           <div>
             <h5>{projectDetails.projectName}</h5>
          </div>
          <div className="d-flex justify-content-center">
           <div className="mx-3">
               <EditIcon style={{cursor: "pointer"}} data-toggle="modal" onClick={editIconBtnClick} data-target={"#"+modelId} />
           </div>
           <div>
               <DeleteIcon style={{cursor: "pointer"}} onClick={deleteBtnIconClick}  />
           </div>
          </div>

           </div>
           <div class="card-body">
             <p class="card-title"><b>Description: </b>{projectDetails.description}</p>
             <p class="card-title"><b>Project Link: </b><a href={projectDetails.projectUrl}>{projectDetails.projectUrl}</a></p>
             <p class="card-text"><b>Duration: </b>{projectDetails.startingDate}-{projectDetails.endingDate}</p>
           </div>
         </div>
         </div>


        
           {/* modal */}
           <div className="modal fade text-start" id={modelId} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Edit Project</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Project Name*</label>
               <TextField
               name="projectName"
               value={projectName}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter project name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Project Description*</label>
               <TextField
               name="description"
               value={description}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter project description"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Project Link*</label>
               <TextField
               name="projectUrl"
               value={projectUrl}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter project link"
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
                placeholder="Project starting date"
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
                placeholder="Project ending date"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={projectUpdateBtnClick} ><SaveIcon />Save</button>
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

export default ProjectCard;