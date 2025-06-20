import "./sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import GroupIcon from "@mui/icons-material/Group";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import { Users } from "../../dummyData";
import CloseFriend from "../closefriend/CloseFriend";
import { Link } from "react-router-dom";
import { MoreHorizontal, MoreVertical } from "lucide-react";



export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                            <RssFeedIcon className="sidebarIcon" />
                            <span className="sidebarListItemText">Feed</span>
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                        <ChatIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Chats</span>
                    </li>
                    <li className="sidebarListItem">
                        <PlayCircleFilledOutlinedIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                        <GroupIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Groups</span>
                    </li>
                    <Link to="/savedposts">
                        <li className="sidebarListItem">
                            <BookmarkIcon className="sidebarIcon" />
                            <span className="sidebarListItemText">Saved</span>
                        </li>
                    </Link>
                    <li className="sidebarListItem">
                        <HelpOutlineIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                        <WorkOutlineIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                        <EventIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <Link to="courses">
                        <li className="sidebarListItem">
                            <SchoolIcon className="sidebarIcon" />
                            <span className="sidebarListItemText">Courses</span>
                        </li>
                    </Link>
                    <li className="sidebarListItem">
                        <MoreHorizontal className="sidebarIcon" />
                        <span className="sidebarListItemText">Show More</span>
                    </li>
                </ul>
                {/* <button className="sidebarButton">Show More</button> */}
                <hr className="sidebarHr" />
                {/* <ul className="sidebarFriendList">
                    {Users.map((u) => (
                        <CloseFriend key={u.id} user={u} />
                    ))}
                </ul> */}
            </div>
        </div>
    );
}