import React, { useState } from 'react'
import {Link} from 'react-router-dom'

//importing extra
import Text from './img/text.png'
import './css/signup.css'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import 'animate.css'

const Signup = () => {
    const [email,setEmail] = useState("")
    const [name,setName] = useState("")
    const [phone,setPhone] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    //handeling signup
    const handelSignup = () => {
        fetch('/serverside/auth/signup', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                phone,
                username,
                password
            })
        })
        .then(res => res.json())
        .then(res2 => {
            if(res2.error) {
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
            } else {
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
                setEmail("")
                setName("")
                setPhone("")
                setUsername("")
                setPassword("")
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    //handeling signup

    return (
        <div className="container-fluid" id="signup-wrapper">
            <ReactNotification />
            <div className="row justify-content-center">
                <div id="signup-div" className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mt-3 mb-3">
                    <div className="main-div">
                        <div className="logo">
                            <img src={Text} alt=""/>
                        </div>
                        <div className="text mx-auto d-block mt-3">
                            <p className="text-center">Sign up to see photos and videos from your friends.</p>
                        </div>
                        <div className="button">
                            <button className="w-75 mx-auto d-block">Log in with facebook</button>
                        </div>
                        <div className="seprater mt-3 mx-auto">
                            <div className="line1"></div>
                            <span>OR</span>
                            <div className="line2"></div>
                        </div>
                        <div id="form" className="mt-3 w-75 mx-auto d-block">
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className="w-100" type="email" placeholder="Email" required/>
                            <input onChange={(e) => setName(e.target.value)} value={name} className="w-100 mt-2" type="text" placeholder="Fullname" required/>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} className="w-100 mt-2" type="text" placeholder="Phone number" required/>
                            <input onChange={(e) => setUsername(e.target.value)} value={username} className="w-100 mt-2" type="text" placeholder="Username" required/>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className="w-100 mt-2" type="password" placeholder="Password" required/>
                            <button onClick={() => handelSignup()} id="signupbutton" className="mt-3 w-100">Sign up</button>
                        </div>
                        <div className="accept-terms mt-4 mx-auto d-block">
                            <p className="text-center">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
                        </div>
                    </div>
                    <div className="signin-refer-box mt-3">
                        <p>Have an account? <Link to="/signin">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Signup;