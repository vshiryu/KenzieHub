import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(
    localStorage.user && JSON.parse(localStorage.user)
  );

  useEffect(() => {
    console.log("verificou login na página de login");
    localStorage.token && setLoggedIn(true);
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        {loggedIn ? (
          <Redirect to="/home" />
        ) : (
          <Login setUserInfo={setUserInfo} setLoggedIn={setLoggedIn} />
        )}
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/home">
        <Home
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
      </Route>
    </Switch>
  );
}

export default App;