import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
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

const VideoProfileCard = ({videoDetails, fetchStudentDataFromServer})=>{

    const videoDeleteIconClick = async ()=>{
        const value = window.confirm("Are you sure to delete this information.");
        if(value){
        try {
            const apiUrl = `/student/video-url/delete`;
            const data = {
                videoDeatils: videoDetails
            }
            const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
            if(serverResponse.status == 200){
                fetchStudentDataFromServer();
                toast.success("Video deleted successfully", reactToastStyle);
            }
        } catch (error) {
            toast.error("Video not delete. Error: "+error.message, reactToastStyle);
        }
    }
      }

    return(
            <div className="col-12 card shadow p-2 my-1 d-flex justify-content-between flex-row">
             <ToastContainer />
             <div className="text-start">
               <p style={{fontWeight: "700", marginTop: "8px"}} className="text-start">{videoDetails.subject}</p>
               <p className="text-start">Video Link: <a target="_blank" href={videoDetails.videoUrl}>{videoDetails.videoUrl}</a></p>
             </div>
             <div>
               <DeleteIcon style={{color: "#eb0273", cursor: "pointer"}} onClick={videoDeleteIconClick} />
             </div>
            </div>
    );
}

export default VideoProfileCard;