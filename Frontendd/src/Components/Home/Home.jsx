import React, { useEffect, useState } from "react";
import { BsBookmarkPlusFill, BsSearch } from "react-icons/bs";
import { FaFireAlt } from "react-icons/fa";
import { CiPizza, CiSaveDown2 } from "react-icons/ci";
import { LuCupSoda } from "react-icons/lu";
import { CiBowlNoodles } from "react-icons/ci";
import { PiBowlFoodDuotone } from "react-icons/pi";
import { LuClock12 } from "react-icons/lu";
// import { useNavigate } from "react-router-dom";

import "./Home.css";
import { Link } from "react-router-dom";
import Loader from "../../Asset/Loader/Loader";

const Home = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate();

  // api work will be done here to fetchItems =e
  const apiKey = "6e95489a0e3c4184812ff4c3f21ea578";
  const fetchItems = async (query) => {
    try {
      const api = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`;
      const response = await fetch(api);
      const data = await response.json();
      setRecipes(data.results);
      console.log(data);
    } catch (err) {
      console.log("Unable to search recipe", err);
    }
  };

  //FETCH TRENDING DATA
  const fetchTrending = async () => {
    try {
      const api = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;
      setLoading(true);
      const response = await fetch(api);
      const data = await response.json();
      // setRecipes(data.recipes);
      console.log(data);
      setLoading(false);
      return data.recipes[0];
    } catch (err) {
      console.log("Unable to search recipe", err);
    }
  };

  const tenTimes = async () => {
    let storage = [];
    for (let index = 0; index < 1; index++) {
      storage.push(await fetchTrending());
      console.log(storage);
    }
    setRecipes(storage);
  };

  const handleKeyPress = async (fetchItems, query) => {
    setLoading(true);
    await fetchItems(query);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Use effect
  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("user"));
    if (storedToken) {
      setUser(storedToken);
    }
    tenTimes();

    // to change active class in category options
    const categoryContainer = document.querySelector(".categories");

    categoryContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("boxes")) {
        const allBoxes = document.querySelectorAll(".boxes");
        allBoxes.forEach((box) => {
          box.classList.remove("active");
        });
        e.target.classList.add("active");
      }
    });
  }, []);

  return (
    <>
      <div className="container p-1 home-page">
        <div className="overlay w-screen h-screen opacity-10"></div>
        <div className="top-body flex justify-evenly">
          <Link
            className="img-div"
            to={`/profile?userId=${user ? user._id : "wow_id"}`}
          >
            <img
              src="https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg?w=740"
              alt="Loading.."
              className="avatarImg"
            />
          </Link>
          <div className="mt-2 mr-auto">
            <p className="kablammo scale-150">Nomster</p>
          </div>
          <Link
            to={`/saved?userName=${user ? user.name : ""}&userId=${
              user ? user._id : ""
            }`}
            className="saved-div cursor-pointer rounded-full"
          >
            <CiSaveDown2 className="saved-button h-7 w-7" />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="middle-body container">
            <div
              className="name-div font-thin"
              style={{ fontSize: "13px", fontWeight: "500" }}
            >
              Hello, {user && user.name} !
            </div>

            <div className="brand-line font-bold">
              Make your own food, <br /> stay at{" "}
              <span style={{ color: "red" }}>Home</span>
            </div>

            <div className="search-bar-div">
              <div className="search-icon-div">
                <BsSearch className="absolute search-icon" />
              </div>
              <input
                style={{ paddingLeft: "15%" }}
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder="Search any recipe"
                className="search-bar"
              />
              <button
                className="bam-search rounded-full flex justify-center items-center"
                onClick={(e) => handleKeyPress(fetchItems, search)}
              >
                <PiBowlFoodDuotone className="h-7 w-7 " />
              </button>
            </div>

            <div className="categories">
              <div className="category-box">
                <div onClick={tenTimes} className="boxes active">
                  <FaFireAlt className="trending-icon active" />
                </div>
                <p className="category-name">Trending</p>
              </div>

              <div className="category-box">
                <div
                  onClick={(e) => {
                    fetchItems("american");
                  }}
                  className="boxes"
                >
                  <CiPizza className="trending-icon" />
                </div>
                <p className="category-name">Western</p>
              </div>

              <div className="category-box">
                <div
                  onClick={(e) => {
                    fetchItems("drinks");
                  }}
                  className="boxes"
                >
                  <LuCupSoda className="trending-icon" />
                </div>
                <p className="category-name ml-2">Drinks</p>
              </div>

              <div className="category-box">
                <div
                  onClick={(e) => {
                    fetchItems("chinese");
                  }}
                  className="boxes"
                >
                  <CiBowlNoodles className="trending-icon" />
                </div>
                <p className="category-name ms-1">Chinese</p>
              </div>
            </div>

            <div className="container popular-recipes">
              <div>
                <h4>Popular Recipes</h4>
              </div>

              <div className="img-section-1">
                {recipes &&
                  recipes.map((recipe) => {
                    return (
                      recipe && (
                        <Link
                          to={"/recipe-details?recipe_id=" + recipe.id}
                          // onClick={() =>
                          //   console.log("/recipe-details?recipe_id=" + recipe.id)
                          // }
                          key={recipe.id}
                          className="img-div no-underline text-gray-600"
                        >
                          <img
                            className="img-1"
                            src={recipe.image}
                            alt={recipe.title}
                          />
                          <div className="name-div flex-col justify-between">
                            <p className="recipe-name">{recipe.title}</p>
                            <div className="ready-in flex items-center justify-evenly">
                              {recipe.readyInMinutes}
                              <LuClock12 />
                            </div>
                            <BsBookmarkPlusFill />
                          </div>
                        </Link>
                      )
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
