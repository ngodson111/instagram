import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom'

//extra imports
import './css/profile.css'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import 'animate.css'

import {UserContext} from '../../App'

const Profile = () => {
    const history = useHistory()
    const [url,setUrl] = useState("")
    const [profilePic,setProfilepic] = useState("")

    const [oldpass,setOldpass] = useState("")
    const [newpass,setNewpass] = useState("")
    const [conpass,setConpass] = useState("")

    const [userdata, setUserdata] = useState([])
    const [postdetails, setPostDetails] = useState([])

    const [followers,setFollowers] = useState([])
    const [following,setFollowing] = useState([])

    const {dispatch} = useContext(UserContext)

    if(!localStorage.getItem('user')) {
        history.push('/signin')
    }
    //fetch profile details
    useEffect(() => {
        fetch('/profiledetails', {
            headers : {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(res2 => {
            setUserdata(res2.response)
            setFollowers(res2.response.followers)
            setFollowing(res2.response.following)
        })
    }, [userdata])
    useEffect(() => {
        fetch('/profile/post', {
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(res2 => {
            setPostDetails(res2.data)
        })
    }, [postdetails])
    //fetch profile details

    //handeling profile upload
    useEffect(() => {
        if(url) {
            let user = JSON.parse(localStorage.getItem('user'))._id
            fetch('/serverside/auth/user/profileupload/'+ user, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    url
                })
            })
            .then(res => res.json())
            .then(res2 => {
                if(res2.message) {
                    localStorage.setItem('user', JSON.stringify(res2.user))
                    document.querySelector('#closeuploadmodal').click()
                    store.addNotification({
                        title:"Notification",
                        message:res2.message,
                        type:"success",
                        container:"top-right",
                        insert:"top",
                        animationIn: ["animated","fadeIn"],
                        animationOut: ["animated","fadeOut"],
                        dismiss:{
                            duration:5000,
                            showIcon:true
                        }
                    })
                }else {
                    document.querySelector('#closeuploadmodal').click()
                    store.addNotification({
                        title:"Notification",
                        message:'Server Respond With Error',
                        type:"danger",
                        container:"top-right",
                        insert:"top",
                        animationIn: ["animated","fadeIn"],
                        animationOut: ["animated","fadeOut"],
                        dismiss:{
                            duration:5000,
                            showIcon:true
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [url])
    const handelProfileUpload = () => {
        let ele = document.querySelector('#uploadphoto')
        ele.click()
        document.querySelector('#uploadphotoform').style.display="block";
    }
    const uploadProfile = () => {
        let data = new FormData()
        data.append('file',profilePic)
        data.append('upload_preset','instagram')
        data.append('cloud_name','ngodsongallery')

        fetch('https://api.cloudinary.com/v1_1/ngodsongallery/image/upload',{
            method:"POST",
            body:data
        })
        .then(res => res.json())
        .then(res2 => {
            document.querySelector('#uploadphotoform').style.display="none";
            setUrl(res2.url)
        })
        .catch(err => {
            console.log(err)
        })
    }
    //handeling profile upload
    const handelLogout = () => {
        document.querySelector('#cancelsetting').click()
        localStorage.clear()
        dispatch({type:"CLEAR"})
    }
    //handel remove current photo
    const handelCurrentremove = () => {
        let user = JSON.parse(localStorage.getItem('user'))._id
        fetch('/serverside/auth/user/profileremove/'+ user , {
            method:"POST",
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then (res => res.json())
        .then (res2 => {
            if(res2.message) {
                localStorage.setItem('user', JSON.stringify(res2.user))
                document.querySelector('#closeuploadmodal').click()
                store.addNotification({
                    title:"Notification",
                    message:res2.message,
                    type:"success",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            }else {
                document.querySelector('#closeuploadmodal').click()
                store.addNotification({
                    title:"Notification",
                    message:'Photo Cannot Be Deleted',
                    type:"danger",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            }
        }) 
    }
    //handel remove current photo

    //handel change password
    const showPasswordchange = () => {
        document.querySelector('#change-password').classList.toggle('showpasswordchange')
    }
    const handelpasswordchange = () => {
        if(!oldpass || !newpass || !conpass) {
            return (
                store.addNotification({
                    title:"Notification",
                    message:"Fields Cannot Be Left Empty",
                    type:"danger",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            )
        }
        if(newpass !== conpass) {
            return (
                store.addNotification({
                    title:"Notification",
                    message:"Please Confirm New Password",
                    type:"danger",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            )
        }
        let userid = JSON.parse(localStorage.getItem('user'))._id
        fetch('/serverside/auth/user/changepassword', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                userid,
                oldpass,
                newpass
            })
        })
        .then (res => res.json())
        .then (res2 => {
            if(!res2.error) {
                localStorage.setItem("user",JSON.stringify(res2.user))
                console.log(res2)
                store.addNotification({
                    title:"Notification",
                    message:"Password Has Been Updated",
                    type:"success",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
                setConpass("")
                setNewpass("")
                setOldpass("")
            }else {
                store.addNotification({
                    title:"Notification",
                    message:res2.error,
                    type:"danger",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    //handel change password

    //delete post
    const DeletePost = (id) => {
        fetch('/profile/postdelete/'+ id, {
            headers : {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(res2 => {
            if(res2.message) {
                return(
                    store.addNotification({
                        title:"Notification",
                        message:res2.message,
                        type:"success",
                        container:"top-right",
                        insert:"top",
                        animationIn: ["animated","fadeIn"],
                        animationOut: ["animated","fadeOut"],
                        dismiss:{
                            duration:5000,
                            showIcon:true
                        }
                    })
                )
            }else {
                store.addNotification({
                    title:"Notification",
                    message:"Cannot Delete Post",
                    type:"danger",
                    container:"top-right",
                    insert:"top",
                    animationIn: ["animated","fadeIn"],
                    animationOut: ["animated","fadeOut"],
                    dismiss:{
                        duration:5000,
                        showIcon:true
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    //delete post

    return (
        <div className="container-fluid mt-lg-5 mt-xl-5 mt-md-5 mt-2" id="profile-section">
            <ReactNotification />
            <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 px-0">
                    <div className="row justify-content-center px-2">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                            <div className="profile-image mt-lg-0 mt-md-0 mt-xl-0 mt-4">
                                {
                                    <img title="Change Profile Picture" data-toggle="modal" data-target="#profilepicmanage" className="img-fluid rounded-circle mx-auto d-block" src={userdata.profilepic} alt=""/>
                                }
                            </div>
                            {/* profile pic manage modal */}
                            <div className="modal fade modal-center setting-modal" id="profilepicmanage">
                                <div className="modal-dialog modal-sm" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body px-0">
                                            <p className="text-center mt-3 mb-3">Change Profile Photo</p>
                                            <hr/>
                                            <p id="filecontainer" onClick={() => handelProfileUpload()} className="text-center text-primary">
                                                Upload Photo
                                            </p>
                                            <div id="uploadphotoform" style={{display:"none"}}>
                                                <input onChange={(e) => setProfilepic(e.target.files[0])} id="uploadphoto" type="file" style={{display:"none"}}/>
                                                <button onClick = {() => uploadProfile()} className="btn btn-sm btn-success mx-auto d-block w-25">Done</button>
                                            </div>
                                            <hr/>
                                            <p onClick={() => handelCurrentremove()} className="text-center text-danger">Remove Current Photo</p>
                                            <hr/>
                                            <p id="closeuploadmodal" className="text-center mb-3" data-dismiss="modal">Cancel</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* profile pic manage modal */}
                        </div>
                        {
                        <div id="profile-title" className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                            <div className="title">
                                <p className="username mt-xl-3 mt-lg-3 mt-md-3 mt-3">@{userdata.username}</p>
                                <button className="ml-3">Edit Profile</button>
                                <i className="ml-3 material-icons" data-toggle="modal" data-target="#Settings">settings</i>
                            </div>
                            <div className="mobilebutton">
                                <button className="w-100">Edit Profile</button>
                            </div>
                            <div className="post-follow-desk">
                                <div className="post">
                                    <span>{postdetails.length} posts</span>
                                </div>
                                <div className="followers ml-xl-5 ml-lg-5 ml-md-5 ml-1">
                                    <span>{followers.length} Followers</span>
                                </div>
                                <div className="following ml-xl-5 ml-lg-5 ml-md-5 ml-1">
                                    <span>{following.length} following</span>
                                </div>
                            </div>
                            <div className="firstname mt-4">
                                <span>{userdata.name}</span>
                            </div>
                        </div>
                        }
                    </div>
                    {/*this is a modal*/}
                    <div className="modal fade modal-center setting-modal" id="Settings">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-body px-0">
                                    <p onClick={() => showPasswordchange()} className="text-center mt-3">Change password</p>
                                    <div id="change-password" className="px-4" style={{display:"none"}}>
                                        <input value={oldpass} onChange={(e) => setOldpass(e.target.value)} className="w-100" type="text" placeholder="Old password"/>
                                        <input value={newpass} onChange={(e) => setNewpass(e.target.value)} className="mt-1 w-100" type="password" placeholder="New password"/>
                                        <input value={conpass} onChange={(e) => setConpass(e.target.value)} className="mt-1 w-100" type="password" placeholder="Confirm password"/>
                                        <button onClick={() => handelpasswordchange()} className="btn btn-sm btn-info mt-2 mx-auto d-block w-25">Change</button>
                                    </div>
                                    <hr/>
                                    <p onClick={() => handelLogout()} className="text-center">Log Out</p>
                                    <hr/>
                                    <p id="cancelsetting" className="text-center mb-3" data-dismiss="modal">Cancel</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*this is a modal*/}
                    <hr className="mt-xl-5 mt-lg-5 mt-md-5 mt-3 px-0" />
                    <p id="divider" className="text-center mb-lg-4 mb-xl-4 mb-md-4"><i className="material-icons">grid_on </i> <span className="ml-3"> Posts</span></p>
                    <div className="container-fluid mb-5" id="gallery-section">
                        <div className="row justify-content-around">
                            {
                            postdetails.map(item => {
                                return (
                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6 mt-2" key={item._id}>
                                        <img src={item.photo} alt="" className="rounded img-fluid" />
                                        <div className="status">
                                            <p className="text-center">
                                                <i className="small material-icons mr-1 text-danger">favorite</i>
                                                <span className="text-white">
                                                    {
                                                        item.like.length
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-center">
                                                <i className="small material-icons mr-1 text-info">comment</i>
                                                <span className="text-white">
                                                    {
                                                        item.comment.length
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-center">
                                                <i onClick={() => DeletePost(item._id)} className="small material-icons mr-1">delete</i>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="foot">
                        <p className="text-xl-right text-md-right text-lg-right text-center">© 2020 INSTAGRAM FROM NARAYAN NEUPANE</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Profile;