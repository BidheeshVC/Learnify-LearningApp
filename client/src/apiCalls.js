import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => { 
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("http://localhost:4000/api/auth/login", userCredentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

        console.log('LOGIN response:---------', res.data);
        // if (res.status === 200) {
        //     localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user data to local storage
        //     console.log("User data saved to local storage after login:", res.data.user);
        // }
        return res; // Return the response for further handling if needed
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
}
export const logoutCall = async (dispatch) => {
    try {
        await axios.post("http://localhost:4000/api/auth/logout");
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user"); // Clear user data from local storage
    } catch (err) {
        console.error("Logout failed:", err);
    }
}