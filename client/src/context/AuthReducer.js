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
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return state;
    }
}

export default AuthReducer;