import React, { useState } from "react";
import Logo from "../NavBar/Logo/Logo.js";
import Input from "./Input/Input.js";
import "./Login.css";
import PasswordField from "./PasswordField/PasswordField.js";
import { auth, db } from "../AppService/firebase.js";
import styles from "../NavBar/Logo/Logo.module.scss";
import firebase from "firebase";
import "react-slideshow-image/dist/styles.css";
import { Fade } from "react-slideshow-image";
import FacebookIcon from "@material-ui/icons/Facebook";

import Button from "@material-ui/core/Button";

export default function Login() {
  const [isShowingReg, setIsShowingReg] = useState(false);

  const email = useFormInput("");
  const password = useFormInput("");
  const fullName = useFormInput("");
  const [isPassValid, setIsPassValid]  = useState(false);

  const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const fadeImages = [
    "https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg",
    "https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg",
    "https://www.instagram.com/static/images/homepage/screenshot3.jpg/f0c687aa6ec2.jpg",
    "https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg",
    "https://www.instagram.com/static/images/homepage/screenshot5.jpg/0a2d3016f375.jpg",
  ];

  let registerUser = (ev) => {
    ev.preventDefault();
    if (fullName.value !== "" && isPassValid) {
      auth
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
          db.collection("users")
            .doc(userCredential.user.uid)
            .set({
              uid: userCredential.user.uid,
              displayName: fullName.value,
              photoUrl:
                userCredential.user.photoUrl || "/static/images/avatar/1.jpg",
              email: email.value,
              following: [],
              followers: [],
              biography: "",
            });

          setIsShowingReg(false);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      if(isPassValid){
        
        alert("Failed Fullname field is required");
      } else {
        alert("Password must contain at least one number , one uppercase and lowercase letter, and at least 8 or more characters");

      }
    }
  };

  let logUser = (ev) => {
    ev.preventDefault();
    auth
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => { })
      .catch((error) => {
        alert(error.message);
      });
  };

  let changeView = (ev) => {
    ev.preventDefault();
    if (isShowingReg) {
      setIsShowingReg(false);
      return;
    }
    setIsShowingReg(true);
  };

  const onFacebookLogin = (ev) => {
    ev.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        db.collection("users")
          .doc(user.uid)
          .set({
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoUrl || "/static/images/avatar/1.jpg",
            email: user.email,
            following: [],
            followers: [],
            biography: "",
          });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  const checkPassword = (ev) => {
    password.onchange(ev);
    setIsPassValid(passwordCheck.test(password.value))
}
  return (
    <>
      <main className="mainContainer">
        <section>
          <img
            id="loginCarousel"
            src={"loginCarousel.png"}
            alt="loginCarousel"
            width="455px"
            height="600px"
          />

          <div className="slide-container">
            <Fade arrows={false} duration={2000}>
              <div className="each-fade">
                <div className="image-container">
                  <img src={fadeImages[0]} alt="slide1" />
                </div>
              </div>
              <div className="each-fade">
                <div className="image-container">
                  <img src={fadeImages[1]} alt="slide2" />
                </div>
              </div>
              <div className="each-fade">
                <div className="image-container">
                  <img src={fadeImages[2]} alt="slide3" />
                </div>
              </div>
            </Fade>
          </div>
        </section>
        <section id="boxes">
          <div>
            <Logo className={styles.loginLogo} width={"200px"} />

            <form>
              <div>
                <Input
                  required
                  type={"email"}
                  text="Email"
                  onInput={email.onchange}
                  value={email.value}
                />
              </div>

              {isShowingReg && (
                <div>
                  <Input
                    required
                    onInput={fullName.onchange}
                    value={fullName.value}
                    type={"text"}
                    text="Full name"
                  />
                </div>
              )}

              <div>
                <PasswordField
                  onInput={checkPassword}
                  value={password.value}
                  
                />
              </div>

              {!isShowingReg ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={(ev) => {
                    logUser(ev);
                  }}

                disabled = {!email.value || !password.value}
                >
                  Log in
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={(ev) => {
                    registerUser(ev);
                  }}
                  disabled = {!email.value || !fullName.value || !password.value}
                >
                 Sign up
                </Button>
              )}

              <div className="or-container">
                <div className="line"></div>
                <div className="or-text">or</div>
                <div className="line"></div>
              </div>

              <button className="facebook-button" onClick={onFacebookLogin}>
                <span>
                  <FacebookIcon />
                </span>
                <span>Log in with Facebook</span>
              </button>

              <div className="text-container">
                {!isShowingReg ? (
                  <div className="account-text">Don't have an account?</div>
                ) : (
                  <div className="or-text">Have an account?</div>
                )}
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={(ev) => {
                  changeView(ev);
                }}
              >
                {isShowingReg ? "Log in" : "Sign up"}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(ev) {
    setValue(ev.target.value);
  }

  return {
    value,
    onchange: handleChange,
  };
}
