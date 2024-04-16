const setAuthToken = (token, user) => {
  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Token found and set");
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Token not found");
  }
};

module.exports = setAuthToken;
