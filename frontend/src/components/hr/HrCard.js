import defaultUser from "../../images/default_hr.png";
import "../../css/HrCard.css";
import axios from "axios";
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

const StudentCard = ({HrData, fetchDataFromServer})=>{

    const hrCardDeleteBtn = async ()=>{
       const value = window.confirm("Are you sure to delete this user?");
       if(value){
        const apiUrl = `/hr/delete/${HrData._id}`;
        try {
            const serverResponse = await axios.delete(apiUrl);
            toast.success("HR deleted successfully", reactToastStyle);
            fetchDataFromServer();
            
        } catch (error) {
          toast.error(error.response.data, reactToastStyle);
        }                
       }
    }

    return(
        <>
          <ToastContainer />
           <div className="card shadow" style={{ width: "100%", height: "520px" }} >
           <div className="text-center p-0">
           <img className="card-img-top img-fluid student_card_image"  style={{width: "100%", height: "240px", objectFit: "fill"}}  src={HrData.profile_pic=="default" ? defaultUser : HrData.profile_pic}  alt="Card image cap" />
           </div>
           {/* <hr/> */}
         
         <div className="card-body text-start">
           <h5 className="card-title hr_card_text"><b>Name: </b>{HrData.name}</h5>
           <p className="card-text hr_card_text"><b>Type: </b> {HrData.type}</p>
           <p className="card-text hr_card_text"><b>Email Id: </b> {HrData.email}</p>
           <p className="card-text hr_card_text" style={{marginTop: "-8px"}}><b>Company Name: </b> {HrData.companyName}</p>
           <p className="card-text hr_card_text"><b>Phone Number: </b> {HrData.phoneNumber} </p>
           <div className="d-flex justify-content-start align-content-center  pl-0 pb-3">
             <div>
               <button href="#" className="btn btn-success">Details</button>
             </div>
             <div>
               <button href="#" className="btn btn-danger ml-3" onClick={hrCardDeleteBtn}>Delete</button>
             </div>
           </div>
         </div>
         </div>
        </>
    );
}

export default StudentCard;