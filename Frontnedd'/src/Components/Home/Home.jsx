import React, { useEffect, useState } from "react";
import { BsBookmarkPlusFill, BsSearch } from "react-icons/bs";
import { FaFireAlt } from "react-icons/fa";
import { CiPizza, CiSaveDown2 } from "react-icons/ci";
import { LuCupSoda } from "react-icons/lu";
import { CiBowlNoodles } from "react-icons/ci";
import "./../Home/Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  // Use state for search-bar

  // api work will be done here to fetchItems =e
  const apiKey = "462715fc87e54c26b16e3daf509152c6";
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

  const fetchTrending = async () => {
    try {
      const api = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

      const response = await fetch(api);
      const data = await response.json();
      setRecipes(data.recipes);
      console.log(data);
    } catch (err) {
      console.log("Unable to search recipe", err);
    }
  };

  const handleKeyPress = (func, query) => {
    func(query);
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
  }, []);

  return (
    <>
      <div className="container p-1 home-page">
        <div className="top-body">
          <div className="img-div">
            <img
              src="https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg?w=740"
              alt="Loading.."
              className="avatarImg"
            />
          </div>

          <div className="saved-div">
            <CiSaveDown2 className="saved-button" />
          </div>
        </div>

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
            <input
              className="bam-search"
              type="button"
              onClick={(e) => handleKeyPress(fetchItems, search)}
              value="bam"
            />
          </div>

          <div className="categories">
            <div className="category-box">
              <div onClick={fetchTrending} className="boxes">
                <FaFireAlt className="trending-icon" />
              </div>
              <p className="category-name">Trending</p>
            </div>

            <div className="category-box">
              <div onClick={() => fetchItems("american")} className="boxes">
                <CiPizza className="trending-icon" />
              </div>
              <p className="category-name">Western</p>
            </div>

            <div className="category-box">
              <div className="boxes">
                <LuCupSoda
                  onClick={() => fetchItems("drinks")}
                  className="trending-icon"
                />
              </div>
              <p className="category-name ml-2">Drinks</p>
            </div>

            <div className="category-box">
              <div className="boxes">
                <CiBowlNoodles
                  onClick={() => fetchItems("chinese")}
                  className="trending-icon"
                />
              </div>
              <p className="category-name ms-1">Chinese</p>
            </div>
          </div>

          <div className="container popular-recipes">
            <div>
              <h4>Popular Recipes</h4>
            </div>

            <div className="img-section-1">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="img-div">
                  <img
                    className="img-1"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                  <div className="name-div">
                    <p className="recipe-name">{recipe.title}</p>
                    <div className="ready-in">45 min</div>
                    <BsBookmarkPlusFill />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
