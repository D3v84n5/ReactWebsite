import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';

const AppContext = React.createContext()

const getFavoritesFromLocalStorage = () =>{
    let favorites = localStorage.getItem("favorites");

    if(favorites){
        favorites = JSON.parse(localStorage.getItem("favorites"))
    }
    else{
        favorites = []
    }

    return favorites;
}




const AppProvider = ({ children }) => {

    const allMealsUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const data = 'https://randomuser.me/api/';

    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

    const fetchMeals = async (url) => {
        setLoading(true)
        try {
            // const response = await axios(url)
            const { data } = await axios(url)

            if (data.meals) {
                setMeals(data.meals);
            }
            else {
                setMeals([]);
            }
        }
        catch (error) {
            console.log(error.response);
        }
        setLoading(false)
    }

    // const fetchData = async() =>{
    //     try{
    //         const response = await fetch('https://randomuser.me/api/')
    //         const data = await response.json();
    //         // console.log(data);
    //     }
    //     catch(error){
    //         console.log(error);
    //     }
    // }

    const fetchRandomMeal = () => {
        fetchMeals(randomMealUrl)
    }

    const closeModal = () =>{
        setShowModal(false);
    }

    const addToFavorites = (idMeal) =>{
        const alreadyFavorite = favorites.find(meal => meal.idMeal === idMeal)
        if(alreadyFavorite) return;
        
        const meal = meals.find(meal => meal.idMeal === idMeal)
        const updateFavorites = [...favorites,meal];
        setFavorites(updateFavorites);
        localStorage.setItem("favorites",JSON.stringify(updateFavorites))
    }
    
    const removeFromFavorites = (idMeal) =>{
        const updatedFavorites = favorites.filter(meal => meal.idMeal !== idMeal);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites",JSON.stringify(updatedFavorites))
    }


    useEffect(() => {
        fetchMeals(allMealsUrl)

    }, []);

    const selectMeal = (idMeal , favouriteMeal ) =>{

        let meal;
        if(favouriteMeal){
            meal = favorites.find( (meal) => meal.idMeal === idMeal)
        }
        else{
            meal = meals.find( (meal) => meal.idMeal === idMeal)
        }
        setSelectedMeal(meal);
        setShowModal(true);
    }
    

    useEffect(() => {
        if (!searchTerm) {
            return
        }
        fetchMeals(`${allMealsUrl}${searchTerm}`)
    }, [searchTerm])

    return (
        <AppContext.Provider value={{ loading, meals, setSearchTerm, fetchRandomMeal  , showModal , selectedMeal , selectMeal
        ,closeModal , addToFavorites , removeFromFavorites , favorites  }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}


export { AppContext, AppProvider }