import React from 'react'
import './login.css';
import {Button} from '@material-ui/core';
import watsapp from './watsapp.png';
import {auth, provider} from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './stateProvider';


function Login() {
    const [{}, dispatch] = useStateValue();

    const signIn = () => {
        auth.signInWithPopup(provider)
        .then(result => {
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            });
        })
        .catch(err => alert(err.message));
    }

    return (
        <div className="login">
            <div className="login__container">
                <img src={watsapp} alt="" />
                <div className="login__text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button onClick={signIn}>
                    Sign In with Google
                </Button>
            </div>
        </div>
    )
}

export default Login;
