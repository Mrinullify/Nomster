import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { Bounce, Flip, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import "./Profile.css";

const Profile = () => {
  // USESTATE FOR STORING FETCHED USER DATA
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatarPic, setAvatarPic] = useState(
    "https://th.bing.com/th/id/R.548a659c2b06a877516d3c998f5b0939?rik=kASD%2fB5sokpJfw&pid=ImgRaw&r=0"
  );
  const [choosenImage, setChoosenImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingDoneForName, setIsEditingDoneForName] = useState(false);
  const [isEditingDoneForEmail, setIsEditingDoneForEmail] = useState(false);
  const [modalOverlay, setModalOverlay] = useState(false);

  // FETCH USER DETAILS
  const fetchUserdata = async (user_id) => {
    const nameAndEmailResponse = await axios.post(
      "http://localhost:1715/api/users/profileDetails",
      {
        user_id,
      }
    );
    const nameAndEmailData = await nameAndEmailResponse.data;
    setUserName(nameAndEmailData.name);
    setUserEmail(nameAndEmailData.email);
    if (nameAndEmailData.avatarPic) {
      setAvatarPic(nameAndEmailData.avatarPic);
    }
  };

  // HANDLE EDIT NAME
  const handleEditName = () => {
    setIsEditingName(!isEditingName);
    setIsEditingDoneForName(!isEditingDoneForName);
    console.log(isEditingName);
  };

  // HANDLE EDIT EMAIL
  const handleEditEmail = () => {
    setIsEditingEmail(!isEditingEmail);
    setIsEditingDoneForEmail(!isEditingDoneForEmail);
    console.log(isEditingEmail);
  };

  //   ONCHANGE FOR SETTING REFRESHING NEW VALUE
  const handleOnChangeName = (e) => {
    setUserName(e.target.value);
  };

  //   ONCHANGE FOR SETTING REFRESHING NEW VALUE
  const handleOnChangeEmail = (e) => {
    setUserEmail(e.target.value);
  };

  //NOTIFY TOAST FOR CHANGING EMAIL OR NAME YO
  const notifyName = () => {
    toast.success("Name successfully changed :)", {
      position: "top-right",
      autoClose: 3000,
      transition: Flip,
    });
  };

  //NOTIFY TOAST FOR CHANGING EMAIL OR NAME YO
  const notifyEmail = () => {
    toast.success("Email successfully changed :)", {
      position: "top-right",
      autoClose: 3000,
      transition: Flip,
    });
  };

  //NOTIFY TOAST FOR WRONG EMAIL OR NAME YO
  const notifyWrongEmail = () => {
    toast.error("Wrong Syntax For Email", {
      position: "top-right",
      autoClose: 3000,
      transition: Bounce,
    });
  };

  //NOTIFY TOAST FOR WRONG EMAIL OR NAME YO
  const notifyWrongName = () => {
    toast.error("Name can't be empty", {
      position: "top-right",
      autoClose: 3000,
      transition: Bounce,
    });
  };

  // FUNC FOR SAVING NEW NAME IN THE DATABASE
  const saveNewName = async () => {
    if (userName === "") {
      notifyWrongName();
      return;
    }
    let token = JSON.parse(localStorage.getItem("user"));
    const user_id = token._id;
    try {
      const nameChangingRitual = await axios.post(
        "http://localhost:1715/api/users/saveNewName",
        {
          userName,
          user_id,
        }
      );
      const response = nameChangingRitual.data;
      console.log(response);
      notifyName();
    } catch (error) {
      console.error(" Some error in the saveNewNAME func :", error);
    }
  };

  // FUNC FOR SAVING NEW NAME IN THE DATABASE
  const saveNewEmail = async () => {
    if (
      !userEmail.includes("@gmail.com") ||
      userEmail.trim() === "@gmail.com" ||
      userEmail.includes(" ")
    ) {
      notifyWrongEmail();
      return;
    }
    let token = JSON.parse(localStorage.getItem("user"));
    const user_id = token._id;
    try {
      const emailChangingRitual = await axios.post(
        "http://localhost:1715/api/users/saveNewEmail",
        {
          userEmail,
          user_id,
        }
      );
      const response = emailChangingRitual.data;
      console.log(response);
      notifyEmail();
    } catch (error) {
      console.error(" Some error in the saveNewEMAIL func :", error);
    }
  };

  //   POP-UP MODAL FOR IMAGE CHANGE
  const ImageModal = () => {
    const imageUrls = [
      "https://th.bing.com/th/id/R.548a659c2b06a877516d3c998f5b0939?rik=kASD%2fB5sokpJfw&pid=ImgRaw&r=0",
      "https://cdn3.iconfinder.com/data/icons/flat-classy-users-1/256/Male_SkinTone2_HairStyle2-512.png",
      "https://th.bing.com/th/id/R.6715b54491ab54da46108c1b752bb00c?rik=rFiGC81X2zDO1g&pid=ImgRaw&r=0",
      "https://th.bing.com/th/id/OIP.jn7kldQfLoUFHXQ-G2nyuwAAAA?rs=1&pid=ImgDetMain",
    ];

    const saveAvatar = async () => {
      if (!choosenImage) return;
      let token = JSON.parse(localStorage.getItem("user"));
      const userId = token._id;
      try {
        await axios.post("http://localhost:1715/api/users/savingAvatar", {
          userId,
          imageUrl: choosenImage,
        });
        setAvatarPic(choosenImage);
        setModalOverlay(false);
        setChoosenImage(null);
      } catch (error) {
        console.error("Error saving avatar:", error);
      }
    };

    return (
      <>
        <div
          className={
            modalOverlay
              ? "inline-block  top-0 z-[2] left-0 absolute  w-screen h-screen overflow-auto bg-black opacity-40"
              : "hidden"
          }
        ></div>
        <div
          className="modal-Content m-[15%] bg-white border-cyan-100 h-[70%] w-[80%] absolute z-[5] rounded-xl"
          style={{
            top: "50%",
            left: "35%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button className="modal-ClosingButton absolute right-2 top-2">
            <IoMdClose onClick={() => setModalOverlay(!modalOverlay)} />
          </button>

          <div className="modal-Title mt-4 text-center border bg-gradient-to-r from-lime-300 to-blue-300 ">
            Choose your Avatar
          </div>
          <div className="modal-Images flex flex-wrap gap-2 ml-[4px] mt-3 justify-center">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="avatar option"
                className={`w-[120px] h-[120px] object-cover rounded-lg cursor-pointer border-4 transition-all duration-200 ${
                  choosenImage === url
                    ? "border-blue-500 scale-105 shadow-lg"
                    : "border-transparent"
                }`}
                onClick={() => setChoosenImage(url)}
              />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={saveAvatar}
              className="bg-green-400 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold text-white transition-colors"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </>
    );
  };

  // USEEFFECT FOR FETCHING ID
  useEffect(() => {
    const fetchId = new URLSearchParams(window.location.search);
    // console.log(fetchId.get("userId"));
    const user_id = fetchId.get("userId");
    fetchUserdata(user_id);
  }, []);

  return (
    <div className="profile-Div relative">
      <div
        className="overlay -z-10 "
        style={{
          height: "100%",

          width: "100%",

          background: `url("https://static.vecteezy.com/system/resources/previews/026/395/220/original/seamless-food-pattern-doodle-food-background-vector.jpg")`,
          position: "absolute",
          /* background-repeat: no-repeat; */
          "background-size": "cover",
          opacity: 0.07,
        }}
      ></div>
      <div className="top-body ">
        <div className="img-Div flex flex-col relative items-center">
          <Link to={"/home"} className="absolute m-2 top-1 left-1">
            <button className="border p-2 mb-4 bg-gray-300 rounded-lg cursor-pointer">
              <IoMdArrowRoundBack />
            </button>
          </Link>
          <img
            className="bg-cover "
            src="https://th.bing.com/th/id/OIP.jzIqbXGwb2BR3Jy_dxna1wHaDt?rs=1&pid=ImgDetMain"
            alt="landscape-banner"
          />
          <img
            className="h-auto w-[45%] z-[2] mt-[-56px] rounded-full object-cover"
            src={avatarPic}
            alt="Avatar"
          />
          <div
            className={`ml-28 mt-[-14px] h-5 w-5 z-[3] ${
              isEditing ? "" : "hidden"
            }  `}
            onClick={() => {
              setModalOverlay(!modalOverlay);
              console.log("button clicked");
            }}
          >
            <FaPen />
          </div>
          <button
            className="p-1 mt-4 border bg-orange-200 font-semibold rounded-lg w-[40%]"
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="details-Div flex flex-col justify-center items-center w-[95%] ml-25 mt-3">
        <p className="ml-8 font-semibold flex items-center">
          Name:
          <input
            value={userName ? userName : ""}
            onChange={handleOnChangeName}
            type="text"
            className="bg-slate-200 rounded-lg ml-1 p-1"
            about="name"
            readOnly={!isEditingName}
          />
          <FaPen
            className={`ml-1 ${isEditing ? "inline-block" : "hidden"}`}
            onClick={handleEditName}
          />
          <TiTick
            className={`${
              isEditingDoneForName ? "inline-block" : "hidden"
            }  h-8 w-8 border p-1 ml-1 rounded-lg bg-green-200`}
            onClick={saveNewName}
          />
        </p>
        <p />
        <p className="ml-8 font-semibold flex items-center">
          Email:
          <input
            value={userEmail ? userEmail : ""}
            onChange={handleOnChangeEmail}
            type="text"
            className="bg-slate-200 rounded-lg ml-1 p-1"
            about="email"
            readOnly={!isEditingEmail}
          />
          <FaPen
            className={`ml-1 ${isEditing ? "inline-block" : "hidden"} `}
            onClick={handleEditEmail}
          />
          <TiTick
            className={`${
              isEditingDoneForEmail ? "inline-block" : "hidden"
            }  h-8 w-8 border p-1 ml-1 rounded-lg bg-green-200`}
            onClick={saveNewEmail}
          />
        </p>
        <br />
      </div>
      {modalOverlay ? <ImageModal /> : ""}
    </div>
  );
};

export default Profile;
