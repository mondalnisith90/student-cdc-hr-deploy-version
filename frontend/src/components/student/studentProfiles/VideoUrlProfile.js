import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import VideoProfileCard from '../carditems/VideoProfileCard';
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



const VideoUrlProfile = ({studentVideoUrls, fetchStudentDataFromServer})=>{

    const [studentVideoUrl, setStudentVideoUrl] = useState({
      subject: "",
      videoUrl: ""
    });


    const inputFieldChange = (event)=>{
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setStudentVideoUrl({...studentVideoUrl, [fieldName]: fieldValue});
    }


    const {subject, videoUrl} = studentVideoUrl;


    const videoURLAddBtnClick = async ()=>{
      if(!subject.trim() || !videoUrl.trim()){
        alert("Please fill all input fields properly.");
      }else{
        try {
          const apiUrl = `/student/video-url/add`;
          const data = {videoUrl: studentVideoUrl};
          const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchStudentDataFromServer();
            toast.success("Link save successfully", reactToastStyle);
            setStudentVideoUrl({
              subject: "",
              videoUrl: ""
            });
          }
        } catch (error) {
          toast.error(error.response.data, reactToastStyle);
        }
      }
    }

    // const videoDeleteIconClick = ()=>{

    // }




    return(
        <>
        <div>
        <ToastContainer />
        <div className="row m-auto">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <p style={{textAlign: "start", fontSize: "24px", color: "#ee00aa"}}><b>Video Links</b></p>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 text-start">
            <button type="button" className="btn btn-primary fw-bold" data-toggle="modal" data-target="#exampleModalCentervideourl" style={{fontSize: "13px"}}>Add Video</button>
          </div>
         </div>
        <hr />
           <div className="row mt-0 text-center p-2">
             {
              studentVideoUrls && studentVideoUrls.length==0 ? <p>No video links</p> : null
             } 
             {
              studentVideoUrls.map((video, index)=>{
               
              
                return(
                  <VideoProfileCard ky={index} videoDetails={video} fetchStudentDataFromServer={fetchStudentDataFromServer} />
                )
              })
             }
            </div>
             {/* modal */}
          <div className="modal fade text-start" id="exampleModalCentervideourl" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title" id="exampleModalLongTitle">Video Links</h5>
               <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
             <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Video Subject*</label>
               <TextField
               name="subject"
               value={subject}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter video subject"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }} />
              </div>

              <div>
               <label htmlFor="exampleFormControlTextarea1" className=" form-label myprofile_form_label " style={{fontWeight: "700"}}>Video Links*</label>
               <TextField
               name="videoUrl"
               value={videoUrl}
               onChange={inputFieldChange}
                id="standard-full-width"
                style={{ margin: "8px"}}
                placeholder="Enter video url"
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
               <button type="button" className="btn btn-primary update_profile_button" onClick={videoURLAddBtnClick} ><SaveIcon />Add</button>
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


export default VideoUrlProfile;