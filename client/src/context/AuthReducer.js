const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            localStorage.setItem("user", JSON.stringify(action.payload));
            console.log("User data saved to local storage:", action.payload);
            return {
                currentUser: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                currentUser: null,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            localStorage.removeItem("user");
            return {
                currentUser: null,
                isFetching: false,
                error: false,
            };
        case "UPDATE":
            localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ Save updated currentUser
            return {
                ...state,
                currentUser: action.payload,
            };
        default:
            return state;
    }
}

export default AuthReducer;