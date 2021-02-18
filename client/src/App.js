import React, { createContext, useReducer, useEffect, useContext } from "react";
import { BrowserRouter, Route, useHistory } from "react-router-dom";

//importing components
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import Profile from "./components/profile/profile";
import Signin from "./components/signin/signin";
import Signup from "./components/signup/signup";
import Vprofile from "./components/vprofile/vprofile";
import Message from "./components/message/message";

import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      history.push("/signin");
    }
  }, [dispatch, history]);
  return (
    <>
      <Route exact path="/">
        <Nav />
        <Home />
      </Route>
      <Route exact path="/profile">
        <Nav />
        <Profile />
      </Route>
      <Route exact path="/chat">
        <Nav />
        <Message />
      </Route>
      <Route exact path="/visitprofile">
        <Nav />
        <Vprofile />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
    </>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
