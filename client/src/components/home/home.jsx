import React, { useState, useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom'

//importing extra
import './css/home.css'
import moment from 'moment'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import 'animate.css'

const Home = () => {
    const history = useHistory()
    const [photo,setPhoto] = useState("")
    const [title,setTitle] = useState("")
    const [Url,setUrl] = useState("")

    const [allpost, setAllpost] = useState([])
    const [userdata, setUserdata] = useState([])

    const [comment,setComment] = useState([])

    useEffect(() => {
        if(!localStorage.getItem('user')) {
            history.push('/signin')
        }
    },[history])
    
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
        })
        //disable next
    }, [userdata])
    //handeling post upload
    useEffect(() => {
        if(Url) {
            let time = moment()
            fetch('/serverside/post/createpost' , {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    Url,
                    title,
                    time
                })
            })
            .then(res => res.json())
            .then(res2 => {
                if(res2.message) {
                    document.querySelector('#marker').innerHTML = `Insert Photo`
                    document.querySelector('#plus').style.display = "block"
                    document.querySelector('#minus').style.display = "none"
                    setTitle("")
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
        //disable next
    },[Url, title])
    const handeluploadPost = () => {
        document.querySelector('#upload-post').click()
    }
    const handelFilechange = (e) => {
        setPhoto(e.target.files[0])
        document.querySelector('#marker').innerHTML = `1 Selected`
        document.querySelector('#plus').style.display = "none"
        document.querySelector('#minus').style.display = "block"
    }
    const handelPostSubmit = () => {
        if(!photo) {
            return (
                store.addNotification({
                    title:"Notification",
                    message:"Please Select A Photo",
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
        let data = new FormData()
        data.append('file',photo)
        data.append('upload_preset','instagram')
        data.append('cloud_name','ngodsongallery')

        fetch('https://api.cloudinary.com/v1_1/ngodsongallery/image/upload',{
            method:"POST",
            body:data
        })
        .then(res => res.json())
        .then(res2 => {
            setUrl(res2.url)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const cancleUpload = () => {
        setPhoto("")
        document.querySelector('#marker').innerHTML = `Insert Photo`
        document.querySelector('#plus').style.display = "block"
        document.querySelector('#minus').style.display = "none"
    }
    //handeling post upload

    //handel like and unlike
    const handelLike = (id) => {
        fetch('/post/like/' + id , {
            headers : {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(res2 => {
            console.log(res2.message)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const handelDislike = (id) => {
        fetch('/post/unlike/'+ id , {
            headers : {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(res2 => {
            console.log(res2.message)
        })
        .catch(err => {
            console.log(err)
        })
    }
    //handel like and unlike

    //fetchpost 
    useEffect(() => {
        fetch('/post/allpost', {
            headers : {
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then (res => res.json())
        .then (res2 => {
            setAllpost(res2.data.reverse())
        })
    }, [allpost, title])
    //fetchpost 

    //handel comments
    const handelComment = (id) => {
        if( comment === '' ) {
            return (
                store.addNotification({
                    title:"Notification",
                    message:"Cannot Post Empty Comment",
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
        fetch('/post/comment', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                id,
                comment
            })
        })
        .then(res => res.json())
        .then(res2 => {
            if(res2.message) {
                setComment("")
            }
        })
        .catch(err => {
            console.log(err)
        }) 
    }
    //handel comments

    //goto profile
    const gotoProfile = (id) => {
        localStorage.setItem('vprofile',id)
        history.push('/visitprofile')
    }
    //goto profile
    return (
        <div className="container-fluid mt-3 mb-5 p-0" id="body-wrapper">
            <ReactNotification />
            <div className="row justify-content-center">
                <div className="col-xl-6 col-mg-6 col-md-6 col-sm-12 col-12">
                    <div className="create-body">
                        <div className="create-title px-3">
                            <p className="mt-3">Create a post</p>
                        </div>
                        <div className="create-content">
                            {
                                <Link to="/profile"><img className="rounded-circle img-fluid mr-4" src={userdata.profilepic} alt=""/></Link>
                            }
                            <textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your Mind ?" className="w-100" cols="30" rows="3"></textarea>
                        </div>
                        <div className="create-footer">
                            <div className="photo">
                                <i id="plus" onClick={() => handeluploadPost()} className="material-icons mr-2 text-success">add_circle</i>
                                <i style={{display:"none"}} id="minus" onClick={() => cancleUpload()} className="material-icons mr-2">cancel</i>
                                <span id="marker">Insert Photo</span>
                            </div>
                            <input onChange={(e) => handelFilechange(e)} id="upload-post" style={{display:"none"}} type="file"/>
                            <button onClick={() => handelPostSubmit()} className="btn btn-sm btn-success h-75 mt-1">Post</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-xl-5 mt-lg-5 mt-md-5 mt-3">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    {
                        allpost.map(item => {
                            return (
                                <div className="post-body mb-3" key={item._id}>
                                    <div className="post-title px-4">
                                        <img className="rounded-circle img-fluid" src={item.postedby.profilepic} alt=""/>
                                        <p className="mt-3 ml-3">
                                            {
                                                item.postedby.username === JSON.parse(localStorage.getItem('user')).username
                                                ?
                                                    <span>{item.postedby.username}</span>
                                                :
                                                    <span onClick={() => gotoProfile(item.postedby._id)}>{item.postedby.username}</span>
                                            }
                                        </p>
                                    </div>
                                    <div className="post-pic p-0">
                                        <img src={item.photo} alt="" className="img-fluid"/>
                                    </div>
                                    <div className="post-likcom">
                                        <div>
                                            {
                                                item.like.filter(x => x.id === JSON.parse(localStorage.getItem('user'))._id).length > 0  
                                                ?
                                                <i id={`dislike`+item._id} onClick={() => handelDislike(item._id)} className="material-icons text-danger">favorite</i>
                                                :
                                                <i id={`like`+item._id} onClick={() => handelLike(item._id)} className="material-icons">favorite_border</i>
                                            }
                                        </div>
                                        <a href={item.photo}><i className="material-icons ml-3">get_app</i></a>
                                    </div>
                                    <div className="post-desc">
                                        {   
                                            item.title !== null ?
                                            <p>{item.title}</p>
                                            :
                                            null
                                        }
                                        { 
                                            item.like.length > 0 
                                            ? 
                                                <p>Liked By <b>{item.like.length} people </b><span className="ml-3" data-toggle="modal" data-target={`#likes`+item._id}>see more</span></p>
                                            : 
                                                <p>No Likes</p>
                                        }
                                        {/* modal starts for like */}
                                        <div className="modal fade modal-center like-modal" id={`likes`+item._id}>
                                            <div className="modal-dialog modal-sm" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-body px-0">
                                                        <p className="text-center">Likes</p>
                                                        <hr/>
                                                        <p className="mx-3">
                                                            {
                                                                item.like.map(i => {
                                                                    return (
                                                                        <li key={i._id} className="mt-2">
                                                                            <img className="img-fluid rounded-circle" src={i.profilepic} alt=""/>
                                                                            {
                                                                                i.username === JSON.parse(localStorage.getItem('user')).username
                                                                                ?
                                                                                <span className="ml-3">@{i.username}</span>
                                                                                :
                                                                                <span data-dismiss="modal" onClick={() => gotoProfile(i.id)} className="ml-3">@{i.username}</span>
                                                                            }
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </p>
                                                        <hr/>
                                                        <p className="text-center" data-dismiss="modal">Cancel</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* modal starts for like */}
                                    </div>
                                    <div className="post-comment">
                                        {
                                            item.comment.length > 0 
                                            ?
                                            <p><span data-toggle="modal" data-target={`#comments`+item._id} className="ml-2">View all {item.comment.length} Comments</span></p>
                                            :
                                            <p>No Comments</p>
                                        }
                                        {/* modal starts for like */}
                                        <div className="modal fade modal-center comment-modal" id={`comments`+item._id}>
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-body px-0">
                                                        <p className="text-center">Comments</p>
                                                        <hr/>
                                                        <p className="px-xl-3 px-lg-3 px-md-3 px-2">
                                                            {
                                                                item.comment.map(i => {
                                                                    return (
                                                                    <li key={i._id}>
                                                                        <img className="img-fluid rounded-circle" src={i.profilepic} alt=""/>
                                                                        {
                                                                            i.username === JSON.parse(localStorage.getItem('user')).username
                                                                            ?
                                                                            <span className="ml-3">@{i.username} : {i.comment}</span>
                                                                            :
                                                                            <span data-dismiss="modal" onClick={() => gotoProfile(i.id)} className="ml-3">@{i.username} : {i.comment}</span>
                                                                        }
                                                                    </li>
                                                                    )
                                                                })
                                                            }
                                                        </p>
                                                        <hr/>
                                                        <p className="text-center" data-dismiss="modal">Cancel</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* modal starts for like */}
                                    </div>
                                    <div className="post-time">
                                        <p>
                                            {
                                                moment(item.time).fromNow()
                                            }
                                        </p>
                                    </div>
                                    <hr/>
                                    <div className="post-commentinput mb-3">
                                        <input value={comment} onChange={(e) => setComment(e.target.value) } type="text" className="w-100" placeholder="Add a comment..."/>
                                        <button onClick={() => handelComment(item._id)}>Post</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
 
export default Home;