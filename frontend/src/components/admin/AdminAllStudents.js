import AdminDashboardNav from "./AdminDashboardNav";
import "../../css/AdminAllStudents.css";
import axios from "axios";
import { useState, useEffect } from "react";
import StudentCard from "../student/StudentCard";

const AdminAllStudents = ()=>{
    const [allStudentsData, setAllStudentsdata] = useState([]);
    //To perform searching poeration
    const [studentSearchField, setStudentSearchField] = useState("");
    useEffect( ()=>{
        fetchDataFromServer();
    },[]);


    const fetchDataFromServer = async ()=>{
        const apiUrl = `/student/viewall`;
        // const apiUrl = ` http://localhost:8000/student/viewall`;
        try {
            const serverResponse = await axios.get(apiUrl);
            console.log(serverResponse.data);
            setAllStudentsdata(serverResponse.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const inputFieldChange = (event)=>{
        const fieldValue = event.target.value;
        setStudentSearchField(fieldValue);
    }

    const refreshButtonClick = ()=>{
        fetchDataFromServer();
        setStudentSearchField("");
    }

    const studentSearchFormSubmit = async (event)=>{
        event.preventDefault();
        let searchingValue = "all_documents";
        if(studentSearchField.trim().length>0){
            //When user put something in searching bar
            searchingValue = studentSearchField;
        }
        try {
            const apiUrl = `/student/search/value/${searchingValue}`;
            const serverResponse = await axios.get(apiUrl);
            if(serverResponse.status == 200){
                setAllStudentsdata(serverResponse.data);
            }
        } catch (error) {
            console.log(error.response.data);
        }

    }

    return(
        <>
    <div className="admin_dashboard_root_div">
     <AdminDashboardNav />

     {/* <div className="d-flex justify-content-center mt-3">
     <button type="button" class="btn btn-outline-danger" onClick={refreshButtonClick} style={{marginRight: "8px", fontSize: "16px"}}>Refresh</button>
     <div>
        <form class="form-inline my-2 my-lg-0">
         <input class="form-control mr-sm-2" type="search" placeholder="Search Student..." aria-label="Search" name="studentSearchField" value={studentSearchField} onChange={inputFieldChange} />
         <button class="btn btn-outline-success my-2 my-sm-0" onClick={studentSearchFormSubmit}>Search</button>
       </form>
     </div>
     </div> */}

     <div className="d-flex p-1 justify-content-center align-items-center  flex-lg-row flex-md-row flex-sm-column flex-column" style={{marginTop: "20px"}}>
         <div className="">
           <button type="button" class="btn btn-outline-danger home_refresh_button" onClick={refreshButtonClick} style={{marginRight: "8px", fontSize: "16px"}}>Refresh</button>
         </div>
         <div className="">
         <form class="form-inline my-0 my-lg-0">
         <input class="form-control mr-sm-2" type="search" placeholder="Search Student..." aria-label="Search" onChange={inputFieldChange} name="studentSearchField" value={studentSearchField} />
         <button class="btn btn-outline-success my-2 my-sm-0"  onClick={studentSearchFormSubmit}>Search</button>
       </form>
     </div> 
     </div>


      {
        allStudentsData.length ? null : <p style={{color: "#ee00aa", fontSize: "30px", fontWeight: "600", textAlign: "center", marginTop: "30px"}}>Data not found</p>
      } 
      <hr className="hr_line" />

     <div className="row mt-3  m-0 p-0 container-fluid">
     {
        allStudentsData.map((student, index)=>{
            return(
                <div className="col-lg-3 col-md-6 col-sm-6 col-12 m-auto d-block p-0 d-flex justify-content-center align-items-center my-3 pe-sm-3" key={index}>
                  <StudentCard studentData={student} fetchDataFromServer={fetchDataFromServer} />
                </div>
            )
        })
     }
      
     </div>
    </div>
        </>
    );
}

export default AdminAllStudents;