import axios from 'axios';
import { useEffect, useState } from 'react';
import defaultUser from "../../images/default1.png";
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



const StudentSortlistedProfileCard = ({studentId, fetchHrProfileDataFromServer})=>{
  console.log("My student profile id...");
  console.log(studentId)

    const [studentProfileData, setStudentProfileData] = useState({});

    const fetchStudentProfileDataFromServer = async ()=>{
        const apiUrl = `/student/search/${studentId}`;
        // const apiUrl = `http://localhost:8000/student/search/${studentId}`;
        // const apiUrl = `/student/search/${studentId}`;
        try {
            const serverResponse = await axios.get(apiUrl);
            if(serverResponse.status == 200){
              console.log("My Student data")
              console.log(serverResponse.data)
                setStudentProfileData(serverResponse.data);
            }
        } catch (error) {
            // console.log(error.response.data);
        }
    }

    useEffect(()=>{
        fetchStudentProfileDataFromServer();
    }, [studentId]);


    const sortlistedStudentDeleteButton = async ()=>{
      //Delete sorlisted student from hr sortlisted profiles
      const value = window.confirm("Are you sure to delete this item?");
      if(value){
      try {
        const apiUrl = `/hr/sortlisted-profile/student/delete`;
        const data = {studentId: studentId};
        const serverResponse = await axios.put(apiUrl, data, {withCredentials: true});
        if(serverResponse.status == 200){
          fetchHrProfileDataFromServer();
          toast.success("Item removed successfully", reactToastStyle);
        }
      } catch (error) {
        toast.error("Item not delete", reactToastStyle);
      }
    }
  }


    return(
        <>
        {
          //studentProfileData value is not null i.e. not false then do this. Otherwise return null value
          studentProfileData ? 
          <>
          
        <div className="col-lg-3 col-md-6 col-sm-6 col-12 m-auto d-block my-3 ps-2 d-flex justify-content-center" >
      
        <div className="card shadow " style={{ width: "100%", height: "480px"}} >
           <div className="text-center p-0">
           <img className="card-img-top img-fluid student_card_image"  style={{width: "100%", height: "240px", objectFit: "fill"}} src={studentProfileData.profile_pic=="default" ? defaultUser : studentProfileData.profile_pic}  alt="Card image cap" />
           </div>
           {/* <hr/> */}
         
         <div className="card-body text-start" style={{marginTop: "0px"}}>
           <h5 className="card-title hr_card_text"><b>Name: </b>{studentProfileData.name}</h5>
           {/* <p className="card-text hr_card_text"><b>Type: </b>{studentProfileData.type} </p> */}
           <p className="card-text hr_card_text"><b>Qualification: </b>{studentProfileData.course} in {studentProfileData.branch}</p>

           <p className="card-text hr_card_text" style={{marginTop: "-15px"}}><b>Skills: </b>
             {
                studentProfileData.skills ?   
               studentProfileData.skills.map((skill, index)=>{
                 return(
                   <span>{skill}, </span>
                 )
              }) : null
             }
           </p>
         </div>
         <ToastContainer />
           <div className="d-flex justify-content-start align-content-center pl-3 pb-4">
             <div>
               <button className="btn btn-success" data-bs-toggle="modal" data-bs-target={"#exampleModalstudenthrsortlistedprofilecard"+studentProfileData._id} >Details</button>
             </div>
              <div>
               <button className="btn btn-danger ml-3" onClick={sortlistedStudentDeleteButton}>Delete</button>
             </div>
             <div>    
             </div>
           </div>
           </div>
          </div>
          <StudentCVCard studentData={studentProfileData} modalId={"exampleModalstudenthrsortlistedprofilecard"+studentProfileData._id}  />
        </>   : null
      }
        </>
    );
}

export default StudentSortlistedProfileCard;