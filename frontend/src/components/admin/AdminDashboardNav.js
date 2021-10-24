import { NavLink } from "react-router-dom";
import "../../css/AdminDashboardNav.css";

const AdminDashboardNav = ()=>{
    return(
        <>
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className=" " id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
            <li className="nav-item active mr-3 nav_list_item">
              <NavLink className="nav-link navbar_navlink_admin"  activeClassName="navlink_active_admin" exact to="/admin/dashboard/all-students">All Student <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item ml-3 nav_list_item">
              <NavLink className="nav-link navbar_navlink_admin"  activeClassName="navlink_active_admin" exact to="/admin/dashboard/all-hr">All HR <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item ml-3 nav_list_item">
              <NavLink className="nav-link navbar_navlink_admin"  activeClassName="navlink_active_admin" exact to="/admin/dashboard/hr-request">HR Requests <span className="sr-only">(current)</span></NavLink>
            </li>
          </ul>
        </div>
        </nav>
        </>
    );
}

export default AdminDashboardNav;