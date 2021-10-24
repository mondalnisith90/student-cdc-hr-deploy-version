import axios from 'axios';
import { useHistory } from "react-router";
import { useEffect, useState } from 'react';
import {currentUserDataContext} from "../../App";
import { useContext } from 'react';
import StudentSortlistedProfileCard from './StudentSortlistedProfileCard';

const SortlistedProfiles = ()=>{

    const [hrSortlistedProfileData, setHrSortlistedProfileData] = useState([]);

    const history = useHistory();

    const fetchHrProfileDataFromServer = async ()=>{
        //Fetch hr profile data from server
        try {
            const apiUrl = `/hr/get-profile`;
            // const apiUrl = `http://localhost:8000/hr/get-profile`;
            const serverResponse = await axios.get(apiUrl, {withCredentials: true});
            if(serverResponse.status == 200){
                // console.log("abcde hr sortlisted profile is called.......");
                // console.log(serverResponse.data.sortlistedProfiles)
                setHrSortlistedProfileData(serverResponse.data.sortlistedProfiles);
            }
        } catch (error) {
          setHrSortlistedProfileData([]);
        }
    }

    useEffect(()=>{
        fetchHrProfileDataFromServer();
    }, []);



    const homeButtonClick = ()=>{
        history.push("/");
    }

    return(
        <div className="sortlisted_root_div">
        <div style={{marginTop: "70px"}}>
          <h2 className="text-center" style={{color: "#02b56a"}}>Sortlisted Profiles</h2>
          <hr className="" />
          {
            hrSortlistedProfileData.length==0 ? 
            <div className="text-center mt-5">
            <h3 className="text-danger">Student profiles not found.</h3>
            <button className="btn btn-success mt-3" onClick={homeButtonClick}>Home</button>
            </div> : null
          }
        <div className="container-fluid row p-0 m-0">
        {
            hrSortlistedProfileData.map((studentId, index)=>{
                return(
                    <StudentSortlistedProfileCard studentId={studentId} fetchHrProfileDataFromServer={fetchHrProfileDataFromServer} key={index} />
                )
            })
        }
        </div>
        </div>
        </div>
    );
}


export default SortlistedProfiles;