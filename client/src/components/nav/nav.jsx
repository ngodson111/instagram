import React from "react";
import { Link } from "react-router-dom";

//extra imports
import "./css/nav.css";
import Logo from "./img/logo.png";
import Text from "./img/text.png";

const Nav = () => {
  return (
    <div className="container-fluid" id="nav-wrapper">
      <div className="row justify-content-center align-center">
        <div
          className="col-xl-9 col-lg-9 col-md-9 col-sm-11 col-11 py-3"
          id="nav-column"
        >
          <Link to="/">
            <div className="logo">
              <div className="image">
                <img
                  className="img-fluid"
                  src={Logo}
                  alt=""
                  width="30px"
                  height="30px"
                />
              </div>
              <span></span>
              <div className="text">
                <img
                  className="img-fluid"
                  src={Text}
                  alt=""
                  width="100px"
                  height="70px"
                />
              </div>
            </div>
          </Link>
          <div className="menu">
            <Link to="/chat">
              <i className="small material-icons">favorite_border</i>
            </Link>
            <Link to="/profile">
              <i className="small material-icons">person_outline</i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
