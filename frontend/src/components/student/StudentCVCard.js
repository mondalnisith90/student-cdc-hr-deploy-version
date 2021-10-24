import "../../css/StudentCVCard.css";
import defaultUser from "../../images/default1.png";
import {currentUserDataContext} from "../../App";
import { useContext } from "react";



const StudentCVCard = ({studentData, modalId})=>{

    const {currentUserData, setCurrentUserData} = useContext(currentUserDataContext);

    return(
        <>
          {/* <!--Student details Modal --> */}
          <div className="modal fade" id={modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
               <div className="modal-dialog modal-lg">
                 <div className="modal-content">
                   <div className="modal-header">
                       {/* <h4 className="modal-title" id="exampleModalLabel">Resume</h4> */}
                      
                    <div className="row m-auto " style={{width: "70rem"}}>
                      <div className="col-lg-4 col-md-4 col-sm-12 col-12 text-start">
                        <img className=" img-fluid student_cv_profile_image"  src={studentData.profile_pic=="default" ? defaultUser : studentData.profile_pic} alt="profile image"  />
                      </div>
                      <div className="col-lg-8 col-md-8  col-sm-12 col-12">
                       <h3 className="resume_student_name">{studentData.name}</h3>
                       <p className="student_heading_text" style={{marginTop: "-5px"}}><b>Email Id: </b> {currentUserData.isAlreadyLogin ? studentData.email : "########@gmail.com"}</p>
                       <p className="student_heading_text"  style={{marginTop: "-15px"}}><b>Phone No: </b>{currentUserData.isAlreadyLogin ? studentData.phoneNumber : "##########"}</p>
                       <p className="student_heading_text"  style={{marginTop: "-15px"}}><b>Degree: </b>{currentUserData.isAlreadyLogin ? `${studentData.course} in ${studentData.branch}` : "###########"}</p>
                       {
                        studentData.linkedinLink=="none" ? null : <p className="student_heading_text"  style={{marginTop: "-15px"}}><b>Linkedin: </b><a href={currentUserData.isAlreadyLogin ? studentData.linkedinLink : "#"} target="_blank">{currentUserData.isAlreadyLogin ? studentData.linkedinLink : "##########"}</a></p>
                       }
                       {
                        studentData.address=="none" ? null : <p className="student_heading_text"  style={{marginTop: "-15px"}}><b>Address: </b>{currentUserData.isAlreadyLogin ? studentData.address : "##########"}</p>
                       }
                      </div>
                    </div>
                   </div>
                   <div className="modal-body">
                     <div>
                      <div className="carrier_objective_div">
                        <p className="resume_subheading">Carrier Objective:-</p>
                         <p className="carrier_objective_text">{studentData.carrierObjective}</p>
                      </div>
                     </div>
                     <hr/>

                     <p className='resume_subheading'>Skills:-</p>
                      <div className="row m-auto text-start">
                      {
                       studentData.skills ? studentData.skills.map((skill, index)=>{
                            return(
                                <div className="col-lg-3 col-md-3 col-sm-4 col-6 my-2" style={{textTransform: "capitalize", fontSize: "14px", fontWeight: "bold"}} key={index}>{skill}</div>
                            )
                        }) : null
                      }
                      </div>
                      <hr/>

                     <p className='resume_subheading'>Education:-</p>
                     <div className="row m-auto">
                     {
                       studentData.education ? studentData.education.map((edu, index)=>{
                            return(
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-12 mb-1" key={index}>
                                <div className="text-start">
                                  <p className="college_name_text">{edu.collegeName}</p>
                                  <p className="education_text"><b>Degree: </b>{edu.degree}</p>
                                  <p className="education_text"><b>Spelization: </b>{edu.spealization}</p>
                                  <p className="education_text"><b>Duration: </b>From {edu.startingDate} to {edu.endingDate}</p>
                                </div>
                      </div>
                            )
                        }) : null
                     }
                    

                      </div>
                      <hr/>

                    <p className='resume_subheading'>Projects:-</p>
                     <div className="row mt-2 m-auto">
                     {
                       studentData.projects ? studentData.projects.map((project, index)=>{
                            return(
                                <div className="col-12 mb-3" key={index}>
                                <div className="text-start">
                                  <p className="project_name_text">{project.projectName}</p>
                                  <p className="project_text"><b>Description: </b><br/><span style={{padding: "5px"}}>{project.description}</span></p>
                                  <p className="project_text"><b>Duration: </b>From {project.startingDate} to {project.endingDate}</p>
                                  <p className="project_text"><b>Link: </b><a href={project.projectUrl} alt="_blank">{project.projectUrl}</a></p>
                                </div>
                                 </div>
                            )
                        }) : null
                     }
                      </div>
                      <hr/>


                     <p className='resume_subheading'>Work Experiences:-</p>
                     <div className="row mt-2 m-auto">

                     {
                        studentData.workExprience ? studentData.workExprience.map((experience, index)=>{
                             return(
                                <div className="col-12 mb-3">
                                <div className="text-start">
                                  <p className="work_experience_name_text">{experience.jobTitle}</p>
                                  <p className="work_experience_text"><b>Work Description: </b><br/><span style={{padding: "5px"}}>{experience.workDesctription}</span></p>
                                  <p className="work_experience_text"><b>Company Name: </b>{experience.companyName}</p>
                                  <p className="work_experience_text"><b>Company Address: </b>{experience.companyAddress}</p>
                                  <p className="work_experience_text"><b>Duration: </b>From {experience.startingDate} to {experience.endingDate}</p>
                                </div>
                                </div>
                             )
                         }) : null
                     }
                      </div>
                      <hr/>

                     <p className='resume_subheading'>Languages:-</p>
                     <div className="row m-auto">
                     {
                        studentData.languages ?   studentData.languages.map((language, index)=>{
                             return(
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-1">
                                 <div className="text-start">
                                   <p className="language_name_text">{language.language}</p>
                                   <p className="language_text"><b>Proficiency Level: </b>{language.proficiency}</p>
                                   </div>
                                  </div>
                             )
                         }) : null
                     }
                     
                     
                      </div>
                      <hr/>

                      <p className='resume_subheading'>Fields of Interest:-</p>
                      <div className="row m-auto text-start">
                      {
                        studentData.fieldsOfInterest ?  studentData.fieldsOfInterest.map((interest, index)=>{
                              return(
                                <div className="col-lg-4 col-md-4 col-sm-6 col-6" key={index}><p className="field_of_interest">{interest}</p></div>
                              )
                          }) : null
                      }
                      </div>
                      <hr/>


                      <p className='resume_subheading'>Video Links:-</p>
                     <div className="row m-auto">
                     {
                        studentData.videoUrl ? studentData.videoUrl.map((video, index)=>{
                             return(
                                <div className="col-6 mb-1">
                                <div className="text-start">
                                  <p className="video_name_text">{video.subject}</p>
                                  <p className="video_text"><b>Video Link: </b><a href={video.videoUrl} target="_blank">{video.videoUrl}</a></p>
                                 </div>
                                </div>
                             )
                         }) : null
                     }
                      
    
                      </div>
                      <hr/>

                      <h4 className="thankyou_text">Thank You</h4>
                   </div>
                   <div className="modal-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                   </div>
                 </div>
               </div>
             </div>
        </>
    );
}

export default StudentCVCard;