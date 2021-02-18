import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

//extra import
import './css/message.css'

const Message = () => {
    const history = useHistory()
    const [followers, setFollowers] = useState(JSON.parse(localStorage.getItem('user')).followers)

    return (
        <div className="container-fluid mt-lg-5 mt-xl-5 mt-md-5 mt-2" id="chat">
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12 px-1 py-3">
                    <div className="row justify-content-center px-2">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="follower-box">
                                <div className="follower-title">
                                    <p>Chat</p>
                                </div>
                                <div className="followers-body mt-2">
                                    {
                                        followers.map(item => {
                                            return(
                                                <p key={item._id}>
                                                    <img src={item.profilepic} alt="" className="img-fluid rounded-circle"/>
                                                    <span className="ml-3"> @{item.username}</span>
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                            <div className="chat-box">
                                <div className="chat-title">
                                    <p className="px-3">
                                        <img src="" alt="blank" className="img-fluid rounded-circle"/>
                                        <span className="ml-3"> @ Naranpn</span>
                                    </p>
                                </div>
                                <div className="chat-content">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message