import AdminDashboardNav from "./AdminDashboardNav";
import "../../css/AdminDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import HrCard from "../hr/HrCard";


const AdminAllHR = ()=>{
    const [allHrsData, setAllHrsdata] = useState([]);
    //To perform searching poeration
    const [hrSearchField, setHrSearchField] = useState("");


    useEffect( ()=>{
        fetchDataFromServer();
    },[]);

    const fetchDataFromServer = async ()=>{
        const apiUrl = `/hr/viewall`;
        // const apiUrl = ` http://localhost:8000/hr/viewall`;
        try {
            const serverResponse = await axios.get(apiUrl);
            setAllHrsdata(serverResponse.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const inputFieldChange = (event)=>{
        const fieldValue = event.target.value;
        setHrSearchField(fieldValue);
    }

    const refreshButtonClick = ()=>{
        fetchDataFromServer();
        setHrSearchField("");
    }

    const hrSearchFormSubmit = async (event)=>{
        event.preventDefault();
        let searchingValue = "all_documents";
        if(hrSearchField.trim().length>0){
            //When user put something in searching bar
            searchingValue = hrSearchField;
        }
        try {
            const apiUrl = `/hr/search/value/${searchingValue}`;
            const serverResponse = await axios.get(apiUrl);
            if(serverResponse.status == 200){
                setAllHrsdata(serverResponse.data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return(
        <>
    <div className="admin_dashboard_root_div">
     <AdminDashboardNav style={{paddingTop: "200px"}} />

     {/* <div className="d-flex justify-content-center mt-3">
     <button type="button" class="btn btn-outline-danger" onClick={refreshButtonClick} style={{marginRight: "8px", fontSize: "16px"}}>Refresh</button>
     <div>
        <form class="form-inline my-2 my-lg-0">
         <input class="form-control mr-sm-2" type="search" placeholder="Search HR..." aria-label="Search" name="hrSearchField" value={hrSearchField} onChange={inputFieldChange} />
         <button class="btn btn-outline-success my-2 my-sm-0"  onClick={hrSearchFormSubmit} >Search</button>
       </form>
     </div>
     </div> */}

     <div className="d-flex p-1 justify-content-center align-items-center  flex-lg-row flex-md-row flex-sm-column flex-column" style={{marginTop: "20px"}}>
         <div className="">
           <button type="button" class="btn btn-outline-danger home_refresh_button" onClick={refreshButtonClick} style={{marginRight: "8px", fontSize: "16px"}}>Refresh</button>
         </div>
         <div className="">
         <form class="form-inline my-0 my-lg-0">
         <input class="form-control mr-sm-2" type="search" placeholder="Search HR..." aria-label="Search" onChange={inputFieldChange} name="hrSearchField" value={hrSearchField} />
         <button class="btn btn-outline-success my-2 my-sm-0"  onClick={hrSearchFormSubmit}>Search</button>
       </form>
     </div> 
     </div>


      {
        allHrsData.length ? null : <p style={{color: "#ee00aa", fontSize: "30px", fontWeight: "600", textAlign: "center", marginTop: "30px"}}>Data not found</p>
      }

      <hr className="hr_line" />

     <div className="row mt-2 m-0 p-0 container-fluid ">
     {
        allHrsData.map((Hr, index)=>{
            
            if(Hr.isGranted=="true"){
                return(
                <div className="col-lg-3 col-md-6 col-sm-6 col-12 m-auto d-block p-0  my-3 pe-sm-3 text-center mb-3 d-flex justify-content-center" key={index}>
                  <HrCard HrData={Hr} fetchDataFromServer={fetchDataFromServer} />
                </div>
            )
            }else{
                return null;
            }
            
        })
     }
     </div>
    </div>
        </>
    );
}

export default AdminAllHR;