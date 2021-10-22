import { NavLink } from "react-router-dom";

const AdminDashboardNav = ()=>{
    return(
        <>
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
            <li className="nav-item active mr-3">
              <NavLink className="nav-link" exact to="/admin/dashboard/all-students">All Student <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item active ml-3">
              <NavLink className="nav-link" exact to="/admin/dashboard/all-hr">All HR <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item active ml-3">
              <NavLink className="nav-link" exact to="/admin/dashboard/hr-request">HR Requests <span className="sr-only">(current)</span></NavLink>
            </li>
            {/* <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li> */}
          </ul>
        </div>
        </nav>
        </>
    );
}

export default AdminDashboardNav;