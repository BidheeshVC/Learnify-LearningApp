import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// const INITIAL_STATE = {
//     user: {
//         _id: "67dd6fcb08eea9912339c863",
//         username: "Bidheesh",
//         email: "bidheesh@gmail.com",
//         followers: [],
//         followings: [],
//         profilePicture: "https://fifpro.org/media/ovzgbezo/messi_w11_2024.jpg?width=1600&height=1024&rnd=133781565917900000",
//         coverPicture: "https://pbs.twimg.com/media/Evhxf8yWgAAOFlY.jpg",
//         isAdmin: false,
//         desc: "",
//         bio: "",
//         createdAt: "",
//         updatedAt: "",
//     },
//     isFetching: false,
//     error: false,
// };
const INITIAL_STATE = {
    user: {
        _id: "67dd6fd708eea9912339c865",
        username: "Bodheesh",
        email: "bodheesh@gmail.com",
        followers: [],
        followings: [],
        profilePicture: "https://i.pinimg.com/736x/b5/cb/24/b5cb24eceab9fe6b43af7c5a65d4522a.jpg",
        coverPicture: "https://www.sportscaveshop.com/cdn/shop/articles/CR7_BANNER.jpg?v=1713850784&width=2048",
        isAdmin: false,
        desc: "",
        bio: "",
        createdAt: "",
        updatedAt: "",
    },
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
            value={{
                 currentUser: state.user, 
                 isFetching: state.isFetching, 
                 error: state.error,
                 dispatch,}}>
            {children}
        </AuthContext.Provider>
    );
};

