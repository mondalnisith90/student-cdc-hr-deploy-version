import defaultUser from "../../images/default1.png";
import "../../css/StudentCard.css";
import axios from "axios";
import StudentCVCard from "../student/StudentCVCard";
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


const StudentCard = ({studentData, fetchDataFromServer})=>{

    const studentCardDeleteBtn = async ()=>{
       const value = window.confirm("Are you sure to delete this user?");
       if(value){
        const apiUrl = `/student/delete/${studentData._id}`;
        try {
            const serverResponse = await axios.delete(apiUrl);
            toast.success("Student deleted successfully", reactToastStyle);
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
           <img className="card-img-top img-fluid student_card_image"   style={{width: "100%", height: "260px", objectFit: "fill"}}  src={studentData.profile_pic=="default" ? defaultUser : studentData.profile_pic}  alt="Card image cap" />
           </div>
           {/* <hr/> */}
         
         <div className="card-body text-start"  style={{marginTop: "0px"}} >
           <h5 className="card-title hr_card_text"><b>Name: </b>{studentData.name}</h5>
           <p className="card-text hr_card_text"><b>Type: </b>{studentData.type} </p>
           <p className="card-text hr_card_text"><b>Degree: </b>{studentData.course} in {studentData.branch}</p>
           <p className="card-text hr_card_text" style={{marginTop: "16px"}}><b>Skills:</b> 
           <span>
            {
              studentData.skills ? studentData.skills.map((skill, index)=>{
                return skill + ", "
              }) : "No skill"
            }
           </span> </p>
         
         </div>
         <div className="d-flex justify-content-start align-content-center pl-3 pb-4">
             <div>
               <button href="#" className="btn btn-success" data-bs-toggle="modal" data-bs-target={"#exampleModalstudenthrprofilecard"+studentData._id} >Details</button>
             </div>
             <div>
               <button href="#" className="btn btn-danger ml-3" onClick={studentCardDeleteBtn}>Delete</button>
             </div>
           </div>
         </div>
         <StudentCVCard studentData={studentData} modalId={"exampleModalstudenthrprofilecard"+studentData._id}  />
        </>
    );
}

export default StudentCard;