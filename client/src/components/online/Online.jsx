import React from 'react'
import './online.css'


export default function Online({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <>
            <li className='rightbarFriend'>
                <div className='rightbarProfileImgContainer'>
                    <img className='rightbarProfileImg' src={user?.profilePicture || "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"} alt='' />
                    <span className='rightbarOnline'></span>
                </div>
                <span className='rightbarUsername'>{user.username}</span>
            </li>
        </>
    )
}
