import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setJWTToken from "../SecurityUtils/setJwtToken";
import jwt_decode from "jwt-decode";

export const createNewUser = (newUser, history) => async dispatch => {
    try{
        await axios.post("/api/users/register", newUser);
        history.push("/login");
        dispatch({
            type: GET_ERRORS,
            payload: {}
        })
    }catch(error){
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data,
        })
    }
};

export const login = Loginrequest => async dispatch => {
    // post => login request

    try {
        const rest = await axios.post("api/users/login", Loginrequest);
        //extract the token from the rest.data
        const {token} = rest.data;

        //store the token in localstorage
        localStorage.setItem("jwtToken", token);
        //set our token in the header **********
        setJWTToken(token);
        //decode the token in react to get the user details
        const decoded = jwt_decode(token)
        //dispatch to our security reducer
        dispatch({
            type: SET_CURRENT_USER,
            payload: decoded
        })

    }catch(err){
        dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        })
    }
}

export const logout = () => dispatch => {
    localStorage.removeItem("jwtToken") // remove token from localstorage
    setJWTToken(false) // to remove the token from header 
    dispatch({
        type: SET_CURRENT_USER,
        payload: {}
    })
}