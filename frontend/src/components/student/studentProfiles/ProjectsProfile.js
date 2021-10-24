import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {currentUserDataContext} from "../../../App";
import ProjectCard from "../carditems/ProjectCard";
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



const ProjectsProfile = ({studentProjects, fetchStudentDataFromServer})=>{


    const {currentUserData, setCurrentUserData} = currentUserDataContext;
    const [project, setProject] = useState({
      projectName: "",
      description: "",
      projectUrl: "",
      startingDate: "",
      endingDate: ""
    });


    const inputFieldChange = (event)=>{
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setProject({...project, [fieldName]: fieldValue});
    }


    const {projectName, description, projectUrl, startingDate, endingDate} = project;



    const projectAddBtnClick = async ()=>{
      if(!projectName.trim() || !description.trim() || !startingDate.trim() || !endingDate.trim()){
        alert("Please fill all the fields properly.");
      }else{
        try {
          const apiUrl = `/student/projects/add`;
          const projectData = {project: project};
          const serverResponse = await axios.put(apiUrl, projectData, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Project added successfully", reactToastStyle);
            setProject({
              projectName: "",
              description: "",
              projectUrl: "",
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
          <div className="col-6">
            <p style={{textAlign: "start", fontSize: "24px", color: "#ee00aa"}}><b>Projects</b></p>
          </div>
          <div className="col-6 text-start">
            <button type="button" className="btn btn-primary fw-bold" data-toggle="modal" data-target="#exampleModalCenterprojects" style={{fontSize: "13px"}}>Add Project</button>
          </div>
         </div>

        <hr style={{marginTop: "-6px"}}/>
           <div className="row m-0 p-0 text-start">
            {
              studentProjects.map((projectDetails, index)=>{
                return(
                  <>
                    <ProjectCard key={index} projectDetails={projectDetails} modelId={"exampleModalCenterprojects"+projectDetails._id} fetchStudentDataFromServer={fetchStudentDataFromServer}  />
                  </>
                )
              })
            }
            </div>
             {/* modal */}
          <div className="modal fade text-start" id="exampleModalCenterprojects" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Projects</h5>
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
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Project Url</label>
               <TextField
               name="projectUrl"
               value={projectUrl}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter url"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={projectAddBtnClick} ><SaveIcon />Save</button>
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


export default ProjectsProfile;