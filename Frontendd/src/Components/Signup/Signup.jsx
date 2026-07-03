import React, { useState } from "react";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOverlay, setModalOverlay] = useState(false);
  const [choosenImage, setChoosenImage] = useState(null);

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const signedUpUser = await axios.post(
        "http://localhost:1715/api/users/signup",
        {
          name,
          email,
          password,
        }
      );
      // Extract token and user data from the response
      const { token, user } = signedUpUser.data;

      // Save token and user data to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("User signed up successfully : ", signedUpUser.data);
      navigate("/login");
    } catch (error) {
      console.log("Sorry unable to store details of user: ", error);
    }
  };

  //   POP-UP MODAL FOR IMAGE CHANGE
  const ImageModal = () => {
    const imageUrls = [
      "https://th.bing.com/th/id/R.548a659c2b06a877516d3c998f5b0939?rik=kASD%2fB5sokpJfw&pid=ImgRaw&r=0",
      "https://cdn3.iconfinder.com/data/icons/flat-classy-users-1/256/Male_SkinTone2_HairStyle2-512.png",
      "https://th.bing.com/th/id/R.6715b54491ab54da46108c1b752bb00c?rik=rFiGC81X2zDO1g&pid=ImgRaw&r=0",
      "https://th.bing.com/th/id/R.61a94316e8fc9f5572c547d331705d44?rik=D2jG9dtHCmeuMg&riu=http%3a%2f%2fgetdrawings.com%2fcliparts%2fpug-dog-clipart-39.png&ehk=NKsmf4YuUR%2flGfF9bPdIhhtGNNxUsOJ2fei%2bIxanKyY%3d&risl=&pid=ImgRaw&r=0",
    ];

    return (
      <>
        <div className="inline-block h-[100%] w-[100%] bg-black top-0 left-0 absolute opacity-40 z-[2]"></div>
        <div
          className="modal-Content  bg-white rounded-xl h-[65%] absolute w-[90%] z-[5] "
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50% , -50%)",
          }}
        >
          <button className="modal-ClosingButton absolute right-2 top-2">
            <IoMdClose
              className="size-5"
              onClick={() => setModalOverlay(!modalOverlay)}
            />
          </button>
          <div className="text-center mt-8 font-semibold bg-fuchsia-200">
            Choose an Avatar
          </div>

          <div className="modal-Images flex flex-wrap gap-1 ml-[4px] mt-11 ">
            {imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt=""
                className={`bg-slate-300 rounded-lg object-cover ${
                  choosenImage === imageUrl
                    ? "transform scale-110 shadow-2xl shadow-black duration-1000" // duration nahi chadh raha ispe
                    : ""
                }`}
                onClick={() => handleImageChange(imageUrl)}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={editingImage}
              className="mt-14 bg-green-300 px-5 py-1.5 rounded-lg font-semibold text-lg"
            >
              Save
            </button>
          </div>
        </div>
      </>
    );
  };

  // Animation when choosing an image
  const handleImageChange = (imageUrl) => {
    setChoosenImage(imageUrl);
    console.log(imageUrl);
  };

  // API for saving the choosed url in the database
  const editingImage = async () => {
    if (!choosenImage) return console.log("No image selected");
    const userString = localStorage.getItem("user");
    if (!userString) return console.log("NO user token found");
    const user = JSON.parse(userString);
    if (!user) return console.log("No user data or invalid data");
    const userId = user._id;
    try {
      await axios.post(
        "http://localhost:1715/api/users/savingAvatar",
        {
          userId,
          imageUrl: choosenImage,
        }
      );
      setModalOverlay(false);
      console.log("Avatar saved successfully:", choosenImage);
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
  };

  return (
    <div className="signup-Div h-screen w-screen relative">
      <div
        className="overlay h-[100%] w-[100%] -z[-10] "
        style={{
          background: `url("https://static.vecteezy.com/system/resources/previews/026/395/220/original/seamless-food-pattern-doodle-food-background-vector.jpg")`,
          opacity: 0.07,
          position: "absolute",
          objectFit: "cover",
          // backgroundRepeat: "repeat-y",
          // bottom: "5px",
        }}
      ></div>

      <div className="signup-body flex justify-center flex-col align-middle container h-[90%] w-[100%]">
        <div className="img-Div flex justify-center relative">
          <img
            src={
              choosenImage ||
              "https://th.bing.com/th/id/R.548a659c2b06a877516d3c998f5b0939?rik=kASD%2fB5sokpJfw&pid=ImgRaw&r=0"
            }
            alt=""
            className="h-44 w-44 rounded-full object-cover"
          />
          <FaPen
            className="absolute right-20 bottom-2 size-5 cursor-pointer"
            onClick={() => setModalOverlay(!modalOverlay)}
          />
        </div>
        <h2 className="mb-4 mt-7 text-center">Signup</h2>
        <input
          onChange={handleNameChange}
          value={name}
          type="text"
          placeholder="Enter your Name here"
        />
        <input
          onChange={handleEmailChange}
          value={email}
          type="email"
          placeholder="Enter your Email here"
        />
        <input
          onChange={handlePasswordChange}
          value={password}
          type="password"
          placeholder="Enter your password here"
        />
        <input
          onChange={handleConfirmPasswordChange}
          value={confirmPassword}
          type="password"
          placeholder="Confirm password"
        />
        <button
          onClick={onSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Submit
        </button>
      </div>

      {modalOverlay ? <ImageModal /> : ""}
    </div>
  );
};

export default Signup;
