import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/vprofile.css'
import momemt from 'moment'

//extra imports
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import 'animate.css'

const Vprofile = () => {
    const history = useHistory()

    if(!localStorage.getItem('user')) {
        history.push('/signin')
    }
    if(!localStorage.getItem('vprofile')) {
        history.push('/')
    }

    const [profileDetails, setDetails] = useState([])
    const [postDetails, setPostdetails] = useState([])

    const [followers,setFollowers] = useState([])
    const [following,setFollowing] = useState([])
    //fetching user details
    useEffect(() => {
        let id = localStorage.getItem('vprofile')
        fetch('/serverside/profiledetails/'+ id, {
            headers: {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then (res => res.json())
        .then(res2 => {
            setDetails(res2.user)
            setFollowers(res2.user.followers)
            setFollowing(res2.user.following)
        })
        .catch(err => {
            console.log(err)
        })
    },[profileDetails])
    useEffect(() => {
        let id = localStorage.getItem('vprofile')
        fetch('/serverside/postdetails/'+ id, {
            headers: {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then (res => res.json())
        .then(res2 => {
            setPostdetails(res2.post)
        })
        .catch(err => {
            console.log(err)
        })
    },[postDetails])
    //fetching user details

    //goto profile
    const gotoProfile = (id) => {
        localStorage.setItem('vprofile',id)
        history.push('/visitprofile')
    }
    //goto profile

    //follow
    const follow = (id) => {
        document.querySelector('#follow').disabled = true
        if(followers.filter(i => i.id === JSON.parse(localStorage.getItem('user'))._id).length > 0) {
            return null
        }
        fetch('serverside/follow/'+ id, {
            headers: {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then (res => res.json())
        .then(res2 => {
            if(res2.user) {
                localStorage.setItem("user",JSON.stringify(res2.user))
                document.querySelector('#follow').disabled = false
            }else {
                console.log(res2.error)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    //follow
    //unfollow
    const unfollow = (id) => {
        if(followers.filter(i => i.id === JSON.parse(localStorage.getItem('user'))._id).length > 0) {
            document.querySelector('#unfollow').disabled = true
            fetch('serverside/unfollow/'+ id, {
                headers: {
                    "Authorization":"Bearer "+ localStorage.getItem('jwt')
                }
            })
            .then (res => res.json())
            .then(res2 => {
                if(res2.user) {
                    localStorage.setItem("user",JSON.stringify(res2.user))
                    document.querySelector('#unfollow').disabled = false
                }else {
                    console.log(res2.error)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
    //unfollow

    return (
        <div className="container-fluid mt-lg-5 mt-xl-5 mt-md-5 mt-2" id="vprofile">
            <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 px-0">
                    <div className="row justify-content-center px-2">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                            <div className="vprofile-image mt-lg-0 mt-md-0 mt-xl-0 mt-4">
                                {
                                    <img title="Profile Picture" className="img-fluid rounded-circle mx-auto d-block" src={profileDetails.profilepic} alt=""/>
                                }
                            </div>
                        </div>
                        <div id="vprofile-title" className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                            <div className="title">
                                <p className="username mt-xl-3 mt-lg-3 mt-md-3 mt-3">@{profileDetails.username}</p>
                                {
                                    followers.filter(i => i.id === JSON.parse(localStorage.getItem('user'))._id).length > 0
                                    ?
                                    <button id="unfollow" onClick={() => unfollow(profileDetails._id)} className="ml-3">Unfollow</button>
                                    :
                                    <button id="follow" onClick={() => follow(profileDetails._id)} className="ml-3">Follow</button>
                                }
                            </div>
                            <div className="post-follow-desk">
                                <div className="post">
                                    <span>{postDetails.length} posts</span>
                                </div>
                                <div className="followers ml-xl-5 ml-lg-5 ml-md-5 ml-1">
                                    <span>{followers.length} Followers</span>
                                </div>
                                <div className="following ml-xl-5 ml-lg-5 ml-md-5 ml-1">
                                    <span>{following.length} following</span>
                                </div>
                            </div>
                            <div className="firstname mt-4">
                                <span>{profileDetails.name}</span>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-xl-5 mt-lg-5 mt-md-5 mt-3 px-0" />
                    <p id="divider" className="text-center mb-lg-4 mb-xl-4 mb-md-4"><i className="material-icons">grid_on </i> <span className="ml-3"> Posts</span></p>
                    {/*gallery*/}
                    <div className="container-fluid mb-5" id="gallery-section">
                        <div className="row justify-content-around">
                            {
                                postDetails.map(item => {
                                    return (
                                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6 mt-2" key = {item._id}>
                                            <img data-toggle="modal" data-target={`#otherpost`+item._id} src={item.photo} alt="" className="rounded img-fluid" />
                                            {/* modal */}
                                            <div className="modal fade modal-center otherpost-modal" id={`otherpost`+item._id}>
                                                <div className="modal-dialog modal-lg" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <p className="text-right" data-dismiss="modal">&times;</p>
                                                        </div>
                                                        <div className="modal-body px-0">
                                                            <div className="container-fluid">
                                                                <div className="row justify-content-center">
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                                                        <img 
                                                                            src={item.photo}   
                                                                            alt=""
                                                                            style={{
                                                                                width:"100%",
                                                                                height:"100%"
                                                                            }}
                                                                            className="img-fluid rounded"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-2">
                                                                        <div className="title">
                                                                            <img src={item.postedby.profilepic} className="rounded-circle" alt=""/>
                                                                            <p className="ml-3"><span className="username">@{item.postedby.username}</span><br/><span>{momemt(item.time).fromNow()}</span></p>
                                                                        </div>
                                                                        <div className="other-content">
                                                                            <hr/>
                                                                            <div className="liked">
                                                                                <i className="mr-2 material-icons text-danger">favorite</i>
                                                                                <p> {item.like.length} people</p>
                                                                            </div>
                                                                            <div className="comment">
                                                                                {
                                                                                    item.comment.map(i => {
                                                                                        return (
                                                                                            <p className="mt-2">
                                                                                                <img src={i.profilepic} alt="" className="rounded-circle img-fluid"/>
                                                                                                {
                                                                                                    i.username === JSON.parse(localStorage.getItem('user')).username
                                                                                                    ?
                                                                                                    <span className="ml-2">@{i.username} : {i.comment}</span>
                                                                                                    :
                                                                                                    <span onClick={() => gotoProfile(item.postedby._id)} className="ml-2">@{i.username} : {i.comment}</span>
                                                                                                }
                                                                                            </p>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* modal */}
                                        </div>
                                        
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/*gallery*/}
                    <div className="foot">
                        <p className="text-xl-right text-md-right text-lg-right text-center">© 2020 INSTAGRAM FROM NARAYAN NEUPANE</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vprofile;