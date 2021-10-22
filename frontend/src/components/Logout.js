import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import {currentUserDataContext} from "../App";
import axios from 'axios';
 

const Logout = ()=> {
  const history = useHistory();
    const {currentUserData, setCurrentUserData} = useContext(currentUserDataContext);
    useEffect( async ()=>{
      if(currentUserData.type == "student"){
        //when student click logout navbar option
        const apiUrl = `/student/logout`;
        const serverResponse = await axios.get(apiUrl, {withCredentials: true});
        if(serverResponse.status == 200){
          setCurrentUserData({...currentUserData, isAlreadyLogin: false, isGranted: false, type: "student", userId: ""});
          setTimeout(() => {
            history.push("/login");
          }, 200);
        }else{
          alert("Logout operation failed, Something went wrong.");
        }
      }else if(currentUserData.type == "hr"){
        //when HR click logout navbar option
        try {
          const apiUrl = `/hr/logout`;
          const serverResponse = await axios.get(apiUrl, {withCredentials: true});
          if(serverResponse.status == 200){
            setCurrentUserData({...currentUserData, isAlreadyLogin: false, isGranted: false, type: "student", userId: ""});
            setTimeout(()=>{
              history.push("/hrlogin");
            }, 200);
          }else{
            alert("Logout operation failed, Something went wrong.");
          }
        } catch (error) {
          
        }
      }else if(currentUserData.type == "admin") {
        //when HR click logout navbar option
        setCurrentUserData({...currentUserData, isAlreadyLogin: false, isGranted: false, type: "student", userId: ""});
        setTimeout(()=>{
          history.push("/admin-login");
        }, 200);

      }else{
        alert("Some error happend in Logout component, Please check it...");
      }
    },[]);

    return (
      <>
      </>);
}

export default Logout;