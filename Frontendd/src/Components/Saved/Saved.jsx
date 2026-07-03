import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./Saved.css";
import { AiTwotoneShop } from "react-icons/ai";
import { AiTwotonePlusCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { LuClock12 } from "react-icons/lu";
import { BsBookmarkPlusFill } from "react-icons/bs";
import Loader from "../../Asset/Loader/Loader";

const Saved = () => {
  // USESTATE FOR SAVING RECIPE ID EVERYTIME
  const [recipeId, setRecipeId] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch ID BASED ON USER ID
  const fetchId = async (id) => {
    try {
      setLoading(true);
      const savedRecipes = await axios.post(
        "http://localhost:1715/api/users/savedRecipes",
        { id }
      );
      const response = savedRecipes.data;
      console.log("Response after api searched for id's is : ", response);
      setRecipeId(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipe IDs: ", error);
    }
  };

  // Fetch DATA BASED ON ID
  const apiKey = "6e95489a0e3c4184812ff4c3f21ea578";
  const fetchData = async (recipeIdArray) => {
    try {
      setLoading(true);
      const dataArray = [];
      for (let index = 0; index < recipeIdArray.length; index++) {
        const singularId = recipeIdArray[index];
        const api = `https://api.spoonacular.com/recipes/${singularId}/information?apiKey=${apiKey}`;
        const response = await fetch(api);
        const data = await response.json();
        dataArray.push(data);
      }
      console.log(
        "Data after fetching data: ",
        "for ids: ",
        recipeIdArray,
        dataArray
      );
      setRecipeData(dataArray);
      setLoading(false);
    } catch (error) {
      console.error("Error while fetching data: ", error);
    }
  };

  // USEEFFECT FOR RETRIEVING ID
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const id = search.get("userId");
    console.log("The Id of user is: ", id);
    fetchId(id);
  }, []);

  useEffect(() => {
    if (recipeId.length > 0) {
      fetchData(recipeId);
    }
  }, [recipeId]);

  return (
    <div className="saved-Page container">
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
      <div className="main-Body">
        <div className="saved-Title flex justify-center items-center border-black border-l-4 border-r-4 border-b-4 rounded-xl  bg-yellow-100">
          <AiTwotoneShop className="h-12 w-12" />
          <h2 className="prism bg-slate-600 text-white p-2 rounded-2xl mt-2">
            SAVED
          </h2>
          <AiTwotonePlusCircle className="h-12 w-12" />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="img-section-1 flex justify-between flex-wrap mt-4">
            {recipeData &&
              recipeData.map((recipe) => {
                return (
                  recipe && (
                    <Link
                      to={"/recipe-details?recipe_id=" + recipe.id}
                      // onClick={() =>
                      //   console.log("/recipe-details?recipe_id=" + recipe.id)
                      // }
                      key={recipe.id}
                      className="img-div no-underline text-gray-600 w-[45%] bg-slate-300 p-2 rounded-2xl"
                    >
                      <img
                        className="img-1 h-auto w-full object-cover rounded[30px]"
                        src={recipe.image}
                        alt={recipe.title}
                      />
                      <div
                        className="name-div flex-col justify-between font-bold text-[13px] mb-3
}"
                      >
                        <p className="recipe-name mt-[2px] mb-[1px]">
                          {recipe.title}
                        </p>
                        <div className="flex justify-between">
                          <div className="ready-in flex items-center justify-evenly border mb-[6px] rounded-[10px] w-[30%] font-bold text-[12px] bg-green-300">
                            {recipe.readyInMinutes}
                            <LuClock12 />
                          </div>
                          <BsBookmarkPlusFill className="scale-150 mr-2 mt-3" />
                        </div>
                      </div>
                    </Link>
                  )
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
