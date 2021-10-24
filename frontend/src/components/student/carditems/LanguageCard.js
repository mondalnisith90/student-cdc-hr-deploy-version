import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import axios from "axios";
import SaveIcon from "@material-ui/icons/Save";
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

const LanguageCard = ({
  languageDetails,
  modelId,
  fetchStudentDataFromServer,
}) => {
  const [studentLanguageDetails, setStudentLanguageDetails] = useState({
    _id: languageDetails._id,
    language: languageDetails.language,
    proficiency: languageDetails.proficiency,
  });

  const inputFieldChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setStudentLanguageDetails({
      ...studentLanguageDetails,
      [fieldName]: fieldValue,
    });
  };

  const { _id, language, proficiency } = studentLanguageDetails;

  const editIconClick = () => {
    setStudentLanguageDetails({
      ...studentLanguageDetails,
      _id: languageDetails._id,
      language: languageDetails.language,
      proficiency: languageDetails.proficiency,
    });
  };

  const languageUpdateBtnClick = async () => {
    if (!language.trim() || !proficiency.trim()) {
      alert("Please fill input fields properly.");
    } else {
      try {
        const apiUrl = `/student/languages/update`;
        const languageData = { language: studentLanguageDetails };
        const serverResponse = await axios.put(apiUrl, languageData, {
          withCredentials: true,
        });
        if (serverResponse.status == 200) {
          fetchStudentDataFromServer();
          toast.success("Language updated successfully", reactToastStyle);
        }
      } catch (error) {
        toast.error(error.response.data, reactToastStyle);
      }
    }
  };

  const deleteBtnIconClick = async () => {
    const value = window.confirm("Are you sure to delete this information");
    if (value) {
      try {
        const apiUrl = `/student/languages/delete`;
        const data = { languageDetails: languageDetails };
        const serverResponse = await axios.put(apiUrl, data, {
          withCredentials: true,
        });
        if (serverResponse.status == 200) {
          fetchStudentDataFromServer();
          toast.success("Language deleted successfully", reactToastStyle);
        }
      } catch (error) {
        toast.error(error.response.data, reactToastStyle);
      }
    }
  };

  return (
    <div className="p-0">
     <ToastContainer />
      <div className="col-lg-12 col-md-12 col-sm-12 col-12 m-auto">
        <div
          className="card my-3 shadow"
          style={{ backgroundColor: "#ebf0ed", border: "3px solid #05a875" }}>
          <div
            className="card-header d-flex justify-content-between"
            style={{ backgroundColor: "#05a875", color: "white" }}>
            <div>
              <h5>{languageDetails.language}</h5>
            </div>

            <div className="d-flex justify-content-center">
              <div className="mx-3">
                <EditIcon
                  style={{ cursor: "pointer" }}
                  onClick={editIconClick}
                  data-toggle="modal"
                  data-target={"#" + modelId}
                />
              </div>
              <div>
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={deleteBtnIconClick}
                />
              </div>
            </div>
          </div>
          <div class="card-body">
            <p class="card-title">
              <b>Proficiency level: </b>
              {languageDetails.proficiency}
            </p>
          </div>
        </div>
      </div>

      {/* modal */}
      <div
        className="modal fade text-start"
        id={modelId}
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Edit Education
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div>
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className=" form-label myprofile_form_label "
                  style={{ fontWeight: "700" }}>
                  Language Name*
                </label>
                <TextField
                  name="language"
                  value={language}
                  onChange={inputFieldChange}
                  id="standard-full-width"
                  style={{ margin: "8px" }}
                  placeholder="Enter language name"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className=" form-label myprofile_form_label "
                  style={{ fontWeight: "700" }}>
                  Proficiency*
                </label>
                <TextField
                  name="proficiency"
                  value={proficiency}
                  onChange={inputFieldChange}
                  id="standard-full-width"
                  style={{ margin: "8px" }}
                  placeholder="Enter language proficiency"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-start align-items-center">
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal">
                  Close
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary update_profile_button"
                  onClick={languageUpdateBtnClick}>
                  <SaveIcon />
                  Save
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;
