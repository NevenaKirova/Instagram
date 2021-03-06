import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./Home/Home";
import NavBar from "./NavBar/NavBar";
import { auth, db } from "./AppService/firebase";
import Login from "./Login/Login.js";
import Explore from "./Explore/Explore";
import ProfilePage from "./ProfilePage/ProfilePage";
import SettingsPage from "./SettingsPage/SettingsPage";
import ChatRoom from "./ChatRoom/ChatRoom";
import { subscribeToRealTimePosts } from "./Post/Posts.actions";
import { getCurrentUser } from "./AppService/CurrentUser.actions";
import firebase from "firebase/app";

function App() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.currentUser);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // should be false

  const [isLoading, setIsLoading] = useState(true);

  let changeStatusLoggedIn = () => {
    setIsLoggedIn((prevState) => !prevState);
  };

  useEffect(() => {
    setIsLoading(true);
    
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(subscribeToRealTimePosts());
        dispatch(getCurrentUser(user));
        setIsLoggedIn(true);
        setIsLoading(false);
        db.collection("notifications").add({
          action: "Welcome!",
          fromUser: {
            displayName: "300gram",
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/instagram-4c584.appspot.com/o/images%2F1617739146806?alt=media&token=7e8dbb0a-0b48-40b3-9024-8a6e0bcd88bb',
            uid: "YY1tp2UQ0IVadwl72zgjz5CTeno1",
          },
          forUser: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          target: "",
        });
      } else {
        <Redirect to="/login" />;
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <img
        src={"./LoadingIMG.gif"}
        style={{ marginLeft: "25%" }}
        alt={"logo"}
      />
    );
  } else {
    return (
      <Router id="router">
        {isLoggedIn && (
          <>
            <NavBar onLogout={changeStatusLoggedIn} />
          </>
        )}
        <div>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <Home /> : <Login />}
            </Route>
            <Route path="/inbox">
              <ChatRoom />
            </Route>

            <Route path="/explore">
              <Explore />
            </Route>

            <Route exact path={`/profile/:id`}>
              <ProfilePage />
            </Route>

            <Route path={"/profile/settings/:id"}>
              <SettingsPage currentUser={currentUser} />
            </Route>

            <Route exact path="/login">
              {!isLoggedIn ? <Login /> : <Redirect to="/" />}
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
