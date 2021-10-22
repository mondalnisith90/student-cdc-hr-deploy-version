import axios from "axios";
import { useState, useEffect } from "react";
import HomeStudentCard from "./HomeStudentCard";
import { useContext } from "react";
import {currentUserDataContext} from "../../App";
import LinearProgress from '@material-ui/core/LinearProgress';


const Home = ()=>{
    const {currentUserData, setCurrentUserData} = useContext(currentUserDataContext);
    const [allStudentsData, setAllStudentsData] = useState([]);
    //This will be a temporary array for filling orginial data
    //This is important when hr is logined in. In other cases like student or admin logined in this is not necessary.
    const [hrSortlistedProfileData, setHrSortlistedProfileData] = useState([]);
    //To perform searching poeration
    const [studentSearchField, setStudentSearchField] = useState("");
    const [linearProgressbarState, setLinearProgressbarState] = useState(false);
    const fetchAllStudentsFromServer = async ()=>{
        const apiUrl = `/student/viewall`;
        try {
            setLinearProgressbarState(true);
            const serverResponse = await axios.get(apiUrl);
            if(serverResponse.status == 200){
                setLinearProgressbarState(false);  
                setAllStudentsData(serverResponse.data);
            }
        } catch (error) {
            setLinearProgressbarState(false);  
            console.log(error.message);
        }
    }



    const fetchHrProfileDataFromServer = async ()=>{
        //Fetch HR profile data
        //Fetch hr profile from server
          try {
            //   setLinearProgressbarState(true);
              const apiUrl = `/hr/get-profile`;
              const serverResponse = await axios.get(apiUrl, {withCredentials: true});
              if(serverResponse.status == 200){
                //   setLinearProgressbarState(false);
                  setHrSortlistedProfileData(serverResponse.data.sortlistedProfiles);
              }
          } catch (error) {
            // setLinearProgressbarState(false);  
            setHrSortlistedProfileData([]);
          }
    }

    useEffect(()=>{
        fetchAllStudentsFromServer();
        fetchHrProfileDataFromServer();
    }, []);





    const refreshButtonClick = ()=>{
        fetchAllStudentsFromServer();
        fetchHrProfileDataFromServer();
        setStudentSearchField("");
    }

    const inputFieldChange = (event)=>{
        const fieldValue = event.target.value;
        setStudentSearchField(fieldValue);
       
    }

   

    const searchFormSubmit = async (event)=>{
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
                setAllStudentsData(serverResponse.data);
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    return(
        <>
    <div className="home_root_div">
     <div className="d-flex justify-content-center" style={{marginTop: "80px"}}>
         {/* <div style={{marginTop: "4px", marginRight: "5px", backgroundColor: "#d60056", color: "white", padding: "8px", fontSize: "16px", borderRadius: "8px", cursor: "pointer"}}>Refresh</div> */}
         <button type="button" class="btn btn-outline-danger" onClick={refreshButtonClick} style={{marginRight: "8px", fontSize: "16px"}}>Refresh</button>
         <div>
        <form class="form-inline my-2 my-lg-0" onSubmit={searchFormSubmit}>
         <input class="form-control mr-sm-2" type="search" placeholder="Search Student..." aria-label="Search" onChange={inputFieldChange} name="studentSearchField" value={studentSearchField} />
         <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
       </form>
     </div>
      
     </div>
     <hr/>
     <div style={{height: "3px"}}>
      {linearProgressbarState ? <LinearProgress color="secondary" /> : null }
      </div>
      {
        allStudentsData.length ? null : <p style={{color: "#ee00aa", fontSize: "30px", fontWeight: "600", textAlign: "center"}}>Data not found</p>
      }  
     <div className="row mt-4 container-fluid ">
     {
        allStudentsData.map((student, index)=>{
            return(
                <div className="col-lg-3 col-md-3 col-sm-6 col-12 m-auto text-center mb-4 d-flex justify-content-center" key={index}>
                  <HomeStudentCard studentData={student} modalId={"exampleModalstudenthomecard"+student._id} hrSortlistedProfileData={hrSortlistedProfileData} fetchHrProfileDataFromServer={fetchHrProfileDataFromServer} />
                </div>
            )
        })
     }
      
     </div>
    
    </div>
        </>
    );
}

export default Home;