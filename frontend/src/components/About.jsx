import Cookies from 'js-cookie';


const About = ()=>{
  console.log("Cookies values are");
  console.log(document.cookie.match("user_type"))
  console.log(Cookies.get("user_type"))
    return(
        <>
        <div style={{marginTop: "150px"}}>
          <h1 className="text-center" >About Us Page</h1>
        </div>
        </>
    );
}


export default About;