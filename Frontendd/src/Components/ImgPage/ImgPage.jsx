import React, { useEffect, useState } from "react";
import { GiChickenLeg } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { BsBookmarkXFill } from "react-icons/bs";
import { MdPeople } from "react-icons/md";
import { LuClock12 } from "react-icons/lu";
import { GrScorecard } from "react-icons/gr";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { ImSpoonKnife } from "react-icons/im";

import "./ImgPage.css";
import { Link } from "react-router-dom";
import Loader from "../../Asset/Loader/Loader";
import { Flip, toast } from "react-toastify";
import axios from "axios";

const ImgPage = () => {
  const [recipe_data, setRecipe_data] = useState("");
  const [recipe_Card, setRecipe_Card] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  //FETCH CARD FROM API
  const apiKey = "6e95489a0e3c4184812ff4c3f21ea578";

  const fetchCard = async (id) => {
    setLoading(true);
    const api = `https://api.spoonacular.com/recipes/${id}/card?apiKey=${apiKey}`;
    const response = await fetch(api);
    const data = await response.json();
    setRecipe_Card(data);
    console.log("CARD DATA : ", data);
    setLoading(false);
  };

  const fetchItems = async (id) => {
    try {
      setLoading(true);
      const api = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
      const response = await fetch(api);
      const data = await response.json();
      console.log("STR: ", data);
      setRecipe_data(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ADDING TOAST

  const notify = () => {
    let message = null;
    if (!saved) {
      message = "🙌 saved successfully!!";
    } else {
      message = "❌ unsaved successfully!!";
    }
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      transition: Flip,
    });
  };

  // SAVING RECIPE API
  const onSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user._id;
    const recipe_id = recipe_data.id;
    try {
      setLoading(true);
      await axios.post("http://localhost:1715/api/users/saved", {
        user_id,
        recipe_id,
      });
      setLoading(false);
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  // UNSAVING API
  const unSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user._id;
      const recipe_id = recipe_data.id;
      try {
        setLoading(true);
        await axios.post("http://localhost:1715/api/users/unsaved", {
          user_id,
          recipe_id,
        });
        setLoading(false);
        notify();
      } catch (error) {
        return console.error(" Something went wrong tho : ", error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API FOR CHECKING IF RECIPE IS SAVED OR NAAH
  const savedOrNot = async (id) => {
    try {
      const recipe_id = id;
      console.log(recipe_id);
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user._id;
      const savedApi = await axios.post(
        "http://localhost:1715/api/users/checkSaved",
        {
          recipe_id,
          user_id,
        }
      );
      const response = await savedApi.data;
      const data = response.exist;
      console.log(data);
      setSaved(data);
    } catch (error) {
      return console.error("savedOrNot crashed :", error);
    }
  };

  // TOGGLING BUTTON
  const handleToggle = async () => {
    setSaved(!saved);

    if (saved) {
      await unSave();
    }
    if (!saved) {
      // IF RECIPE IS NOT SAVED
      await onSave();
    } else console.log("Some issue here");
  };

  // USEFFECT
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    let id = search.get("recipe_id");
    console.log(id);
    fetchItems(id);
    savedOrNot(id);
    fetchCard(id);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="recipe-detail container mt-1 " style={{ height: "100%" }}>
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
      <div>
        <Link to={"/home"}>
          <button className="border p-2 mb-4 bg-gray-300 rounded-lg cursor-pointer">
            <IoMdArrowRoundBack />
          </button>
        </Link>

        <div className="top-Image flex  justify-center">
          <img src="" alt="'Something good:'" className=" opacity-60 " />
        </div>
        <img
          className="rounded-xl"
          src={recipe_data.image}
          alt={recipe_data.title}
        />
        <p className="mt-1 text-xl retro">{recipe_data.title}</p>
        <div className="flex justify-between">
          <p className="">
            {recipe_data && recipe_data.vegetarian ? (
              <p className="border bg-green-400 rounded-lg p-2">
                <FaLeaf className="h-5 w-5" />
              </p>
            ) : (
              <p className="border bg-red-400 rounded-lg p-2">
                <GiChickenLeg className="h-5 w-5" />
              </p>
            )}
          </p>

          <button
            className={`h-1/2 px-2 py-1  rounded-full flex items-center font-bold`}
            onClick={() => {
              handleToggle();
            }}
          >
            {saved ? (
              <span className="bg-green-200 flex items-center rounded-md p-1">
                Saved
                <BsBookmarkXFill />
              </span>
            ) : (
              <span className="bg-slate-300 flex items-center rounded-md p-1">
                Save
                <BsBookmarkXFill />
              </span>
            )}
          </button>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-between w-[60%] ">
            <p className="flex items-center gap-1 font-bold">
              {recipe_data.servings}
              <MdPeople />
            </p>
            <span>|</span>
            <p className="flex items-center gap-1 font-bold">
              {recipe_data.readyInMinutes}
              <LuClock12 />
            </p>
            <span>|</span>
            <p className="flex items-center gap-1 font-bold">
              {recipe_data.healthScore}
              <GrScorecard />
            </p>
          </div>
        </div>
        <p>
          <div>
            <h2 className="font-thin ">Description:</h2>
            <p
              dangerouslySetInnerHTML={{ __html: recipe_data.summary }}
              className="font-semibold border bg-gray-200 rounded-lg px-1"
            ></p>
          </div>
        </p>
        {/* {sampleArray.map((alpha) => (
          <p>{alpha ? alpha.name : null}</p>
        ))} */}

        <div className="INGREDIENT border p-1 bg-gray-300 rounded-lg">
          <h2>Ingredients:-</h2>

          {recipe_data
            ? recipe_data.extendedIngredients.map((ingredient) => {
                const name = ingredient.original.toUpperCase();
                return (
                  <div className="ingredient-List-Div flex ">
                    <p className="ingredient-List flex items-center gap-1 font-semibold text-sm font-mono mb-2">
                      <FaStar /> {ingredient ? name : null}
                    </p>
                  </div>
                );
              })
            : console.log("error")}
        </div>
        {/* INSTRUCTION */}
        <div className="INGREDIENT border p-1 bg-gray-300 rounded-lg mt-3">
          <h2>INTRUCTIONS:-</h2>

          {recipe_data
            ? recipe_data.analyzedInstructions[0].steps.map((instruction) => {
                const STEP = instruction.step.toUpperCase();
                return (
                  <div className="ingredient-List-Div flex justify-evenly ">
                    <ImSpoonKnife className="w-[30px]" />
                    <p className="ingredient-List flex w-4/5 items-center gap-1 font-semibold text-sm font-mono">
                      {instruction ? STEP : null}
                    </p>
                  </div>
                );
              })
            : console.log("error")}
        </div>
        {recipe_Card ? (
          <div>
            <img src={recipe_Card.url} alt="Imgae was supposed to be here" />
          </div>
        ) : (
          console.log("WOW it crashed as a whole")
        )}
      </div>
    </div>
  );
};

export default ImgPage;
