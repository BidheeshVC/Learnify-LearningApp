import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// const INITIAL_STATE = {

    //     user: {
    //         _id: "67dd701108eea9912339c867",
    //         username: "Kishan",
    //         email: "kishan@gmail.com",
    //         followers: [],
    //         followings: [],
    //         profilePicture: "https://imageio.forbes.com/specials-images/imageserve/68228d64025e4de51504ace2/0x0.jpg?format=jpg&crop=1141,1141,x85,y16,safe&height=416&width=416&fit=bounds",
    //         coverPicture: "https://static.vecteezy.com/system/resources/previews/045/507/231/non_2x/a-boy-looking-in-the-cosmic-sky-for-facebook-cover-editor_template.jpeg?last_updated=1716277969",
    //         isAdmin: false,
    //         desc: "In three words I can sum up everything I've learned about life: It goes on."
    // ,
    //         bio: "",
    //         createdAt: "",
    //         updatedAt: "",
    //     },
    //     isFetching: false,
    //     error: false,

    // user: { 
    //     _id: "67dd6fcb08eea9912339c863",
    //     username: "Bidheesh",
    //     email: "bidheesh@gmail.com",
    //     followers: [],
    //     followings: [],
    //     profilePicture: "https://fifpro.org/media/ovzgbezo/messi_w11_2024.jpg?width=1600&height=1024&rnd=133781565917900000",
    //     coverPicture: "https://pbs.twimg.com/media/Evhxf8yWgAAOFlY.jpg",
    //     isAdmin: false,
    //     desc: "",
    //     bio: "",
    //     createdAt: "",
    //     updatedAt: "",
    // },
    // isFetching: false,
    // error: false,


    // user: {
    //     _id: "67dd6fd708eea9912339c865",
    //     username: "Bodheesh",
    //     email: "bodheesh@gmail.com",
    //     followers: [],
    //     followings: [],
    //     profilePicture: "https://i.pinimg.com/736x/b5/cb/24/b5cb24eceab9fe6b43af7c5a65d4522a.jpg",
    //     coverPicture: "https://www.sportscaveshop.com/cdn/shop/articles/CR7_BANNER.jpg?v=1713850784&width=2048",
    //     isAdmin: false,
    //     desc: "",
    //     bio: "",
    //     createdAt: "",
    //     updatedAt: "",
    // },
    // isFetching: false,
    // error: false,
// };

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};
// console.log("Initial user state from local storage:", INITIAL_STATE.user);

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
            value={{
                currentUser: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

