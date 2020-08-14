import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import setAuthToken from '../../utils/setAuthToken'
import authReducer from './authReducer';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem(''),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth');

            dispatch({ type: USER_LOADED, payload: res.data });
        } catch (err) {
            dispatch({type: AUTH_ERROR});
        }
    }

    // Register User
    const register = async formData => {
        // since we're making a post request we need the content-type header
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            // we have the proxy value in package.json, so we don't have to type out http://localhost:5000
            const res = await axios.post('/api/users', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
            loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            });

        }
    };

    // Login User
    const login = () => {
        console.log('Login');
    }
    // Logout
    const logout = () => {
        console.log('Logout');
    }

    // Clear Errors
    const clearErrors = () => {
        // console.log('Clear Errors');
        dispatch({ type: CLEAR_ERRORS });
    }

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthState;