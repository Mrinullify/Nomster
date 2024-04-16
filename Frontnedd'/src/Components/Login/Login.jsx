import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const loggedInUser = await axios.post(
        "http://localhost:1715/api/users/login",
        {
          email,
          password,
        }
      );

      const { user, token } = loggedInUser.data;

      // setting in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("data", loggedInUser.data);

      await axios.post("http://localhost:1715/api/users/tokenIsValid", {
        token,
      });
      console.log("Token is Verified");

      console.log("Token saved");

      navigate("/home");
    } catch (error) {
      console.error("naah man something wrong with the token creation");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="justify-center flex flex-col align-middle container">
      <h2 className="mb-4">Login</h2>
      <input
        type="email"
        onChange={handleEmailChange}
        value={email}
        placeholder="Enter your Email here"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password here"
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

export default Login;
