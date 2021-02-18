import React, { useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";

//importing extra
import "./css/signin.css";
import Insta from "./img/insta.png";
import Text from "./img/text.png";

import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import "animate.css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //working on signin
  const handelSignin = () => {
    if (!email || !password) {
      return store.addNotification({
        title: "Notification",
        message: "Fields Cannot Be Left Blank",
        type: "danger",
        container: "top-right",
        insert: "top",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000,
          showIcon: true,
        },
      });
    }
    fetch("/serverside/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((res2) => {
        if (res2.error) {
          store.addNotification({
            title: "Notification",
            message: res2.error,
            type: "danger",
            container: "top-right",
            insert: "top",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              showIcon: true,
            },
          });
        } else {
          localStorage.setItem("jwt", res2.token);
          localStorage.setItem("user", JSON.stringify(res2.user));
          dispatch({ type: "USER", payload: res2.user });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //working on signin

  return (
    <div className="container-fluid" id="signin-body">
      <ReactNotification />
      <div className="row justify-content-center">
        <div
          className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12"
          id="content-wrapper"
        >
          <div className="row justify-content-center align-center">
            <div
              className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12"
              id="img-div"
            >
              <div className="image">
                <img src={Insta} alt="" width="700px" height="700px" />
              </div>
            </div>
            <div
              id="content-div"
              className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12"
            >
              <div className="row align-center">
                <div
                  id="main-area"
                  className="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-12 mt-xl-3 mt-lg-3 mt-md-3 mt-0"
                >
                  <div className="signin-box mt-xl-5 mt-lg-5 mt-md-5 mt-3">
                    <div className="logo">
                      <img src={Text} alt="" />
                    </div>

                    <div id="form" className="mt-5">
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="w-100"
                        type="text"
                        placeholder="Email (Case sensative)"
                      />
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="w-100 mt-1"
                        type="password"
                        placeholder="Password"
                      />
                      <button
                        onClick={() => handelSignin()}
                        id="signinbutton"
                        className="mt-3 w-100"
                      >
                        Log In
                      </button>
                    </div>
                    <div className="seprater mt-2">
                      <div className="line1"></div>
                      <span>OR</span>
                      <div className="line2"></div>
                    </div>
                    <div className="with-facebook mt-3">
                      <p className="text-center">Log in with Facebook</p>
                    </div>
                    <div className="forgot-password">
                      <p className="text-center">Forgot password?</p>
                    </div>
                  </div>
                  <div className="signup-refer-box mt-3">
                    <p>
                      Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
