import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  return (
    <div className="justify-center flex flex-col align-middle container">
      <h2 className="mb-4">Signup</h2>
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
  );
};

export default Signup;
