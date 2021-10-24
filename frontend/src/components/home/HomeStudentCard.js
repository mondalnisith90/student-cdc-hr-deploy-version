import defaultUser from "../../images/default1.png";
import "../../css/StudentCard.css";
import axios from "axios";
import {currentUserDataContext} from "../../App";
import { useContext } from "react";
import { useEffect, useState } from "react";
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


const HomeStudentCard = ({studentData, modalId, hrSortlistedProfileData, fetchHrProfileDataFromServer})=>{

    const {currentUserData, setCurrentUserData} = useContext(currentUserDataContext);
    const [isThisStudentProfileAlreadySelectedByHr, setIsThisStudentProfileAlreadySelectedByHr] = useState(false);
    useEffect(()=>{
      if(hrSortlistedProfileData){
        hrSortlistedProfileData.map((studentId, index)=>{
          if(studentId == studentData._id){
            setIsThisStudentProfileAlreadySelectedByHr(true);
          }
        });
      }
    });
    

    const detailsButtonClick = async ()=>{
    }

    const addProfileButtonClick = async ()=>{
      try {
        //When hr add a student profile on his/her add to cart items
        if(currentUserData.type=="hr" && currentUserData.isGranted=="true"){
          const apiUrl = `/hr/add-student-profile`;
          // const apiUrl = `http://localhost:8000/hr/add-student-profile`;
          const data = {
            studentId: studentData._id
          }
          const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
          if(serverResponse.status == 200){
            fetchHrProfileDataFromServer();
            toast.success("Profile added successfully", reactToastStyle);
          }
        }else{
          alert("You are not authorized to add student profile.");
        }
      } catch (error) {
        alert(error.message);
      }
    }

    return(
        <>
           <ToastContainer />
           <div className="card shadow"   style={{ width: "100%", height: "530px"}} >
           <div className="text-center p-0">
           <img className="card-img-top img-fluid student_card_image" style={{width: "100%", height: "280px", objectFit: "fill"}} src={studentData.profile_pic=="default" ? defaultUser : studentData.profile_pic}  alt="Card image cap" />
           </div>
           {/* <hr/> */}
         
         <div className="card-body text-start">
           <h5 className="card-text hr_card_text"><b>Name: </b>{studentData.name} {currentUserData.userId==studentData._id? <span style={{color: "#ee00aa"}}> (your Profile)</span> : null}</h5>
           {/* <p className="card-text hr_card_text"><b>Type: </b>{studentData.type} </p> */}
           <p className="card-text hr_card_text"><b>Qualification: </b>{studentData.course} in {studentData.branch}</p>
           <p className="card-text hr_card_text" style={{marginTop: "-150px !important"}}><b>Skills: </b>
             {
               studentData.skills.map((skill, index)=>{
                 return(
                   <span>{skill}, </span>
                 )
              })
             }
           </p>
          
         </div>
         <div className="d-flex justify-content-start align-content-center pl-3 pb-3">
             <div>
               <button className="btn btn-success home_details_button" data-bs-toggle="modal" data-bs-target={"#"+modalId} onClick={detailsButtonClick}>Details</button>
             </div>
             <div>
             {
                currentUserData.isGranted=="true" && currentUserData.type=="hr" ? isThisStudentProfileAlreadySelectedByHr ? <button className="btn btn-primary ml-3 disabled">Selected</button> : <button className="btn btn-primary ml-3" style={{backgroundColor: "#e60597", border: "0px"}} onClick={addProfileButtonClick}>Select Profile</button> : null
             }
               
             </div>
           </div>
         </div>

         <StudentCVCard studentData={studentData} modalId={modalId}  />
          

        </>
    );
}

export default HomeStudentCard;