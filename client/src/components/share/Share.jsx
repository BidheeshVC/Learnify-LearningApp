
import React, { useContext, useRef, useState } from 'react';
import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Share({ triggerRefresh }) {
    const { currentUser } = useContext(AuthContext);
    console.log("currentUser in share component: ", currentUser);
    const desc = useRef("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [showTagModal, setShowTagModal] = useState(false);
    const [tags, setTags] = useState("");
    const [tagsArray, setTagsArray] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmojis, setSelectedEmojis] = useState([]);

    // Common emojis for quick selection
    const commonEmojis = ['😊', '👍', '❤️', '🎉', '😂', '🔥', '✨', '😎', '🙌', '👏'];

    // Function to get user's location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });

                    // Get location name using reverse geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        setLocationName(data.address.suburb || data.address.state_district || data.address.state || "Unknown location");
                    } catch (err) {
                        console.error("Error fetching location name:", err);
                        setLocationName("Location selected");
                    }
                },
                (error) => {
                    showToast("Unable to retrieve your location.", "error");
                }
            );
        } else {
            showToast("Geolocation is not supported by this browser.", "error");
        }
    };

    const handleFilePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast("File size exceeds 5MB limit", "error");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFile(file);
            setError(null);
        } else {
            setPreview(null);
            setFile(null);
            showToast("No file selected", "warning");
        }
    };


    const handleTagsSubmit = () => {
        const tagList = tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        setTagsArray(prev => [...new Set([...prev, ...tagList])]); // Avoid duplicates
        setTags("");
        setShowTagModal(false);
    };

    const removeTag = (index) => {
        setTagsArray(tagsArray.filter((_, i) => i !== index));
    };



    const handleEmojiSelect = (emoji) => {
        // Add emoji to selected emojis array if not already there
        if (!selectedEmojis.includes(emoji)) {
            setSelectedEmojis([...selectedEmojis, emoji]);
        }

        // Add emoji to description field
        if (desc.current) {
            const start = desc.current.selectionStart;
            const end = desc.current.selectionEnd;
            const text = desc.current.value;
            const newText = text.substring(0, start) + emoji + text.substring(end);
            desc.current.value = newText;
            // Set cursor position after the emoji
            desc.current.selectionStart = desc.current.selectionEnd = start + emoji.length;
            desc.current.focus();
        }
    };

    const removeEmoji = (index) => {
        setSelectedEmojis(selectedEmojis.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!desc.current.value.trim() && !file) {
            showToast("Please add text or an image to your post", "warning");
            return false;
        }
        return true;
    };

    const showToast = (message, type = "success") => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                toast.info(message);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setShowEmojiPicker(false)

        if (!validateForm()) return;

        const newPost = {
            userId: currentUser.user._id,
            desc: desc.current.value,
            location: location,
            locationName: locationName,
            tags: tagsArray, // Send tags as an array to backend
            emojis: selectedEmojis // Send selected emojis as an array
        };

        if (file) {
            const formData = new FormData();
            const fileName = Date.now() + file.name;
            formData.append("file", file);

            try {
                const uploadRes = await axios.post('http://localhost:4000/api/upload', formData);
                newPost.img = uploadRes.data.filename;
            } catch (error) {
                console.log("Error uploading file: ", error);
                showToast("Error uploading file", "error");
                return;
            }
        }

        try {
            const createPostRes = await axios.post("http://localhost:4000/api/posts", newPost);
            if (createPostRes.status === 200) {
                triggerRefresh(true);
                // Reset all form fields
                desc.current.value = "";
                setFile(null);
                setPreview(null);
                setLocation(null);
                setLocationName("");
                setTagsArray([]);
                setTags("");
                setSelectedEmojis([]);
                showToast("Post created successfully!");
            } else {
                console.log("Error creating post: ", createPostRes.data);
                showToast("Error creating post: " + createPostRes.data, "error");
            }
        } catch (error) {
            console.log("Error creating post: ", error);
            showToast("Error creating post", "error");
        }
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={currentUser?.user?.profilePicture
                        || "/assets/person/noAvatar.png"} alt="" />
                    <div className="shareUserInfo">
                        <span className="shareUsername">{currentUser?.user?.username}</span>
                        {locationName && <span className="shareLocation">Location: {locationName}</span>}
                    </div>
                </div>
                <textarea
                    placeholder={"What's in your mind " + currentUser?.username + "?"}
                    className="shareInput"
                    ref={desc}
                />


                {/* Display selected tags with remove option */}
                {tagsArray.length > 0 && (
                    <div className="selectedTags">
                        {tagsArray.map((tag, index) => (
                            <span
                                key={index}
                                className="tagBadge"
                                onClick={() => removeTag(index)}
                                title="Click to remove"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}


                {/* Display selected emojis */}
                {selectedEmojis.length > 0 && (
                    <div className="selectedEmojis">
                        {selectedEmojis.map((emoji, index) => (
                            <span
                                key={index}
                                className="emojiTag"
                                onClick={() => removeEmoji(index)}
                                title="Click to remove"
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                )}

                <hr className="shareHr" />
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor='file' className="shareOption">
                            <PermMediaIcon htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText"></span>
                            <input
                                style={{ display: "none" }}
                                type="file" id='file'
                                accept='.png,.jpeg,.jpg,.mp4'
                                onChange={handleFilePreview}
                            />
                        </label>
                        <div className="shareOption" onClick={() => setShowTagModal(true)}>
                            <LabelIcon htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption" onClick={getLocation}>
                            <RoomIcon htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">
                                {locationName ? `Location: ${locationName}` : "Select Location"}
                            </span>
                        </div>
                        <div className="shareOption" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type='submit'>Share</button>
                </form>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="emojiPicker">
                        <div className="emojiPickerHeader">
                            <span>Select Emoji</span>
                            <button onClick={() => setShowEmojiPicker(false)}>×</button>
                        </div>
                        <div className="emojiList">
                            {commonEmojis.map((emoji, index) => (
                                <span
                                    key={index}
                                    className="emojiItem"
                                    onClick={() => handleEmojiSelect(emoji)}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {preview && (
                    <div className="previewContainer">
                        <button className="removePreviewBtn" onClick={() => { setPreview(null); setFile(null); }}>
                            &times;
                        </button>
                        {file && file.type?.startsWith("video/") ? (
                            <video
                                controls
                                src={preview}
                            />
                        ) : (
                            <img
                                alt="Preview"
                                src={preview}
                            />
                        )}
                    </div>
                )}

                {/* Custom Tag Modal */}
                {showTagModal && (
                    <div className="modalOverlay">
                        <div className="customModal">
                            <div className="modalHeader">
                                <h3>Add Tags</h3>
                                <button className="closeModalBtn" onClick={() => setShowTagModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modalBody">
                                <label className="formLabel">Enter tags separated by commas</label>
                                <input
                                    type="text"
                                    className="formInput"
                                    placeholder="tag1, tag2, tag3"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                                {/* Popular tag suggestions */}
                                <div className="tagSuggestions">
                                    <span>Popular Tags:</span>
                                    <div className="suggestionsList">
                                        {['coding', 'travel', 'food', 'music', 'sports'].map((tag) => (
                                            <span
                                                key={tag}
                                                className="tagSuggestion"
                                                onClick={() => {
                                                    const currentTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
                                                    if (!currentTags.includes(tag)) {
                                                        setTags(tags ? `${tags}, ${tag}` : tag);
                                                    }
                                                }}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modalFooter">
                                <button
                                    className="modalBtn cancelBtn"
                                    onClick={() => setShowTagModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="modalBtn submitBtn"
                                    onClick={handleTagsSubmit}
                                >
                                    Add Tags
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* React Toastify Container */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </div>
    );
}



// import React, { useContext, useRef, useState } from 'react';
// import "./share.css";
// import PermMediaIcon from "@mui/icons-material/PermMedia";
// import LabelIcon from "@mui/icons-material/Label";
// import RoomIcon from "@mui/icons-material/Room";
// import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

// import axios from "axios";
// import { AuthContext } from '../../context/AuthContext';

// export default function Share({ triggerRefresh }) {
//     const { currentUser } = useContext(AuthContext);

//     console.log("currentUser in share component: ", currentUser);

//     const desc = useRef("");
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [error, setError] = useState(null);

//     const handleFilePreview = (e) => {
//         const file = e.target.files[0];
//         console.log("Selected file: ", file);

//         if (file) {
//             const reader = new FileReader();

//             reader.onloadend = () => {
//                 setPreview(reader.result); // Now this will only set after file is read
//             };

//             reader.readAsDataURL(file);
//             setFile(file);
//             setError(null);
//         } else {
//             setPreview(null);
//             setFile(null);
//             setError("No file selected");
//         }
//     };




//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const newPost = {
//             userId: currentUser.user._id,
//             desc: desc.current.value,
//         };

//         if (file) {
//             const formData = new FormData();
//             const fileName = Date.now() + file.name;
//             formData.append("file", file);

//             try {
//                 const uploadRes = await axios.post('http://localhost:4000/api/upload', formData);
//                 newPost.img = uploadRes.data.filename; // <-- Use returned name
//             } catch (error) {
//                 console.log("Error uploading file: ", error);
//             }
//         }

//         try {
//             const createPostRes = await axios.post("http://localhost:4000/api/posts", newPost);
//             if (createPostRes.status === 200) {
//                 console.log("Post created successfully: ", createPostRes.data);
//                 triggerRefresh(true); // Trigger refresh in parent component
//                 desc.current.value = ""; // Clear the input field
//                 alert("Post created successfully!");
//             } else {
//                 console.log("Error creating post: ", createPostRes.data);
//                 alert("Error creating post: " + createPostRes.data);
//             }
//         } catch (error) {
//             console.log("Error creating post: ", error);
//         }
//     };

//     return (
//         <div className="share">
//             <div className="shareWrapper">
//                 <div className="shareTop">
//                     <img className="shareProfileImg" src={currentUser?.profilePicture} alt="" />
//                     <input
//                         placeholder={"What's in your mind " + currentUser?.username + "?"}
//                         className="shareInput"
//                         ref={desc}
//                     />
//                 </div>
//                 <hr className="shareHr" />
//                 <form className="shareBottom" onSubmit={submitHandler}>
//                     <div className="shareOptions">
//                         <label htmlFor='file' className="shareOption">
//                             <PermMediaIcon htmlColor="tomato" className="shareIcon" />
//                             <span className="shareOptionText"></span>
//                             <input
//                                 style={{ display: "none" }}
//                                 type="file" id='file'
//                                 accept='.png,.jpeg,.jpg,.mp4'
//                                 onChange={(e) => { setFile(e.target.files[0]); handleFilePreview(e) }} />
//                         </label>
//                         <div className="shareOption">
//                             <LabelIcon htmlColor="blue" className="shareIcon" />
//                             <span className="shareOptionText">Tag</span>
//                         </div>
//                         <div className="shareOption">
//                             <RoomIcon htmlColor="green" className="shareIcon" />
//                             <span className="shareOptionText">Location</span>
//                         </div>
//                         {/* <div className="shareOption">
//                             <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
//                             <span className="shareOptionText">Feelings</span>
//                         </div> */}
//                     </div>
//                     <button className="shareButton" type='submit'>Share</button>
//                 </form>
//                 {error && <div className="error">{error}</div>}

//                 {preview && (
//                     <>

//                         <div className="previewContainer">
//                         <button className="removePreviewBtn" onClick={() => { setPreview(null); setFile(null); }}>
//                             &times;
//                         </button>
//                             {file.type.startsWith("video/") ? (
//                                 <video
//                                     style={{ width: "100%", height: "auto" }}
//                                     controls
//                                     src={preview}
//                                 />
//                             ) : (
//                                 <img
//                                     style={{ width: "100%", height: "auto" }}
//                                     alt="Preview"
//                                     src={preview}
//                                 />
//                             )}
//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// }



// import React, { useContext, useRef, useState } from 'react';
// import "./share.css";
// import PermMediaIcon from "@mui/icons-material/PermMedia";
// import LabelIcon from "@mui/icons-material/Label";
// import RoomIcon from "@mui/icons-material/Room";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import { AuthContext } from '../../context/AuthContext';

// export default function Share({ triggerRefresh }) {
//     const { currentUser } = useContext(AuthContext);
//     const desc = useRef("");
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [error, setError] = useState(null);
//     const [location, setLocation] = useState(null);
//     const [locationName, setLocationName] = useState("");
//     const [showTagModal, setShowTagModal] = useState(false);
//     const [tags, setTags] = useState("");
//     const [toast, setToast] = useState({
//         show: false,
//         message: "",
//         type: "success" // success, warning, error
//     });

//     // Function to get user's location
//     const getLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ latitude, longitude });

//                     // Get location name using reverse geocoding
//                     try {
//                         const response = await fetch(
//                             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//                         );
//                         const data = await response.json();
//                         console.log("Location data:", data);
//                         setLocationName(data.address.suburb || data.address.state_district || data.address.state || "Unknown location");
//                     } catch (err) {
//                         console.error("Error fetching location name:", err);
//                         setLocationName("Location selected");
//                     }
//                 },
//                 (error) => {
//                     showToast("Unable to retrieve your location.", "error");
//                 }
//             );
//         } else {
//             showToast("Geolocation is not supported by this browser.", "error");
//         }
//     };

//     const handleFilePreview = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check file size (limit to 5MB)
//             if (file.size > 5 * 1024 * 1024) {
//                 showToast("File size exceeds 5MB limit", "error");
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//             setFile(file);
//             setError(null);
//         } else {
//             setPreview(null);
//             setFile(null);
//             showToast("No file selected", "warning");
//         }
//     };

//     const handleTagsSubmit = () => {
//         const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         console.log("Tags submitted: ", tagList);
//         const formattedTags = tagList.map(tag => `#${tag}`).join(' ');
//         console.log( "Formatted tags: ", formattedTags);

//         // Append tags to the description
//         if (desc.current.value) {
//             desc.current.value = `${desc.current.value} ${formattedTags}`;
//         } else {
//             desc.current.value = formattedTags;
//         }

//         setShowTagModal(false);
//         // setTags("");
//     };

//     const validateForm = () => {
//         if (!desc.current.value.trim() && !file) {
//             showToast("Please add text or an image to your post", "warning");
//             return false;
//         }
//         return true;
//     };

//     const showToast = (message, type = "success") => {
//         setToast({
//             show: true,
//             message,
//             type
//         });

//         // Auto hide toast after 3 seconds
//         setTimeout(() => {
//             setToast(prev => ({ ...prev, show: false }));
//         }, 3000);
//     };
// console.log("verigy tag state", tags)
//     console.log("verigy location state", location)
//         console.log("verigy desc state", desc.current.value)

//     const submitHandler = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         const newPost = {
//             userId: currentUser.user._id,
//             desc: desc.current.value,
//             location: location,
//             locationName: locationName
//         };

//         if (file) {
//             const formData = new FormData();
//             const fileName = Date.now() + file.name;
//             formData.append("file", file);

//             try {
//                 const uploadRes = await axios.post('http://localhost:4000/api/upload', formData);
//                 newPost.img = uploadRes.data.filename;
//             } catch (error) {
//                 console.log("Error uploading file: ", error);
//                 showToast("Error uploading file", "error");
//                 return;
//             }
//         }

//         try {
//             const createPostRes = await axios.post("http://localhost:4000/api/posts", newPost);
//             if (createPostRes.status === 200) {
//                 triggerRefresh(true);
//                 desc.current.value = "";
//                 setFile(null);
//                 setPreview(null);
//                 setLocation(null);
//                 setLocationName("");
//                 showToast("Post created successfully!");
//                 setTags("");
//             } else {
//                 console.log("Error creating post: ", createPostRes.data);
//                 showToast("Error creating post: " + createPostRes.data, "error");
//             }
//         } catch (error) {
//             console.log("Error creating post: ", error);
//             showToast("Error creating post", "error");
//         }
//     };

//     return (
//         <div className="share">
//             <div className="shareWrapper">
//                 <div className="shareTop">
//                     <img className="shareProfileImg" src={currentUser?.profilePicture || "/assets/person/noAvatar.png"} alt="" />
//                     <div className="shareUserInfo">
//                         <span className="shareUsername">{currentUser?.username}</span>
//                         {locationName && <span className="shareLocation">Location: {locationName}</span>}
//                     </div>
//                 </div>
//                 <textarea
//                     placeholder={"What's in your mind " + currentUser?.username + "?"}
//                     className="shareInput"
//                     ref={desc}
//                 />
//                 <hr className="shareHr" />
//                 <form className="shareBottom" onSubmit={submitHandler}>
//                     <div className="shareOptions">
//                         <label htmlFor='file' className="shareOption">
//                             <PermMediaIcon htmlColor="tomato" className="shareIcon" />
//                             <span className="shareOptionText">Photo/Video</span>
//                             <input
//                                 style={{ display: "none" }}
//                                 type="file" id='file'
//                                 accept='.png,.jpeg,.jpg,.mp4'
//                                 onChange={handleFilePreview}
//                             />
//                         </label>
//                         <div className="shareOption" onClick={() => setShowTagModal(true)}>
//                             <LabelIcon htmlColor="blue" className="shareIcon" />
//                             <span className="shareOptionText">Tag</span>
//                         </div>
//                         <div className="shareOption" onClick={getLocation}>
//                             <RoomIcon htmlColor="green" className="shareIcon" />
//                             <span className="shareOptionText">
//                                 {locationName ? `Location: ${locationName}` : "Select Location"}
//                             </span>
//                         </div>
//                     </div>
//                     <button className="shareButton" type='submit'>Share</button>
//                 </form>

//                 {preview && (
//                     <div className="previewContainer">
//                         <button className="removePreviewBtn" onClick={() => { setPreview(null); setFile(null); }}>
//                             &times;
//                         </button>
//                         {file && file.type?.startsWith("video/") ? (
//                             <video
//                                 controls
//                                 src={preview}
//                             />
//                         ) : (
//                             <img
//                                 alt="Preview"
//                                 src={preview}
//                             />
//                         )}
//                     </div>
//                 )}

//                 {/* Custom Toast Component */}
//                 {toast.show && (
//                     <div className={`customToast ${toast.type}`}>
//                         <div className="toastContent">
//                             <span>{toast.message}</span>
//                             <button onClick={() => setToast(prev => ({ ...prev, show: false }))}>
//                                 &times;
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Custom Tag Modal */}
//                 {showTagModal && (
//                     <div className="modalOverlay">
//                         <div className="customModal">
//                             <div className="modalHeader">
//                                 <h3>Add Tags</h3>
//                                 <button className="closeModalBtn" onClick={() => setShowTagModal(false)}>
//                                     &times;
//                                 </button>
//                             </div>
//                             <div className="modalBody">
//                                 <label className="formLabel">Enter tags separated by commas</label>
//                                 <input
//                                     type="text"
//                                     className="formInput"
//                                     placeholder="tag1, tag2, tag3"
//                                     value={tags}
//                                     onChange={(e) => setTags(e.target.value)}
//                                 />
//                             </div>
//                             <div className="modalFooter">
//                                 <button
//                                     className="modalBtn cancelBtn"
//                                     onClick={() => setShowTagModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="modalBtn submitBtn"
//                                     onClick={handleTagsSubmit}
//                                 >
//                                     Add Tags
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }