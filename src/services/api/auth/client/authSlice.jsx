import React from 'react'
import { createSlice } from '@reduxjs/toolkit'
import { registerUser, userLogin, userLogout } from './authActions'
import Cookies from "js-cookie";
// import { Cookies } from 'react-cookie';

import supabase from '../../client/supabase_client'
import { useNavigate } from 'react-router-dom'


// initialize userToken from local storage
const userToken = Cookies.get('jwt')
  ? Cookies.get('jwt')
  : null

  console.log('userToken from cookiee', userToken)

// const initialState = {
//   loading: false,
//   userInfo: null,
//   userToken,
//   error: null,
//   success: false,
// }

const initialState = createInitialState()

// const navigate = useNavigate()

function createInitialState(){
  return {
    loading: false,
    userInfo: null,
    userToken,
    userPayment: false,
    userSchool: null,
    userFormComplete: false,
    error: null,
    errorMsg: null,
    success: false
  }
}

function createReducers(){
  return {
    logout,
    setCredentials
  }

  function logout (state) {
    // var { pending, fulfilled, rejected } = userLogout;
    //         builder
    //             .addCase(pending, (state) => {
    //                 state.loading = true
    //                 state.error = null;
    //             })
    //             .addCase(fulfilled, (state, action) => {
    //                 // const user = action.payload;

    //                 // store user details and basic auth data in local storage to keep user logged in between page refreshes
    //                 // localStorage.setItem('user', JSON.stringify(user));
    //                 state.loading = false
    //                 state.userInfo = action.payload
    //                 state.userToken = action.payload.token
    //                 // if(action.payload.status!==200){
    //                 //   state.error
    //                 // }

    //                 // get return url from location state or default to home page
    //                 // const { from } = history.location.state || { from: { pathname: '/' } };
    //                 // history.navigate(from);
    //             })
    //             .addCase(rejected, (state, action) => {
    //                 state.loading = false
    //                 state.error = action.error
    //             });
    // setTimeout(() => {
      
      Cookies.remove('jwt') // delete token from storage
      Cookies.set('jwt') // delete token from storage
      state.loading = false
      state.userInfo = null
      state.userToken = null
      state.error = null
    // }, 1000);
    
    
  }
  function setCredentials (state, { payload }) {
    state.userInfo = payload
  }
}

const name = 'auth'
const reducers = createReducers()
const extraReducers = createExtraReducers()

const authSlice = createSlice({
  name,
  initialState,
  // reducers: (create) => ({
  //   logout: create.reducer((state, action) => {
  //     state.todos.splice(action.payload, 1)
  //   }),
  //   addTodo: create.preparedReducer(
  //     (text) => {
  //       const id = nanoid()
  //       return { payload: { id, text } }
  //     },
  //     // action type is inferred from prepare callback
  //     (state, action) => {
  //       state.todos.push(action.payload)
  //     },
  //   ),
  //   fetchTodo: create.asyncThunk(
  //     async (id, thunkApi) => {
  //       const res = await fetch(`myApi/todos?id=${id}`)
  //       return await res.json()
  //     },
  //     {
  //       pending: (state) => {
  //         state.loading = true
  //       },
  //       rejected: (state, action) => {
  //         state.loading = false
  //       },
  //       fulfilled: (state, action) => {
  //         state.loading = false
  //         state.todos.push(action.payload)
  //       },
  //     },
  //   ),
  // }),
  // reducers: {
  //   logout: (state) => {
  //       Cookies.remove('jwt') // delete token from storage
  //     state.loading = false
  //     state.userInfo = null
  //     state.userToken = null
  //     state.error = null
  //   },
  //   setCredentials: (state, { payload }) => {
  //     state.userInfo = payload
  //   },
  // },
  reducers,
  extraReducers
//   extraReducers: {
//     // login user
//     [userLogin.pending]: (state) => {
//       state.loading = true
//       state.error = null
//     },
//     [userLogin.fulfilled]: (state, { payload }) => {
//       state.loading = false
//       state.userInfo = payload
//       state.userToken = payload.userToken
//     },
//     [userLogin.rejected]: (state, { payload }) => {
//       state.loading = false
//       state.error = payload
//     },
//     // register user
//     // [registerUser.pending]: (state) => {
//     //   state.loading = true
//     //   state.error = null
//     // },
//     // [registerUser.fulfilled]: (state, { payload }) => {
//     //   state.loading = false
//     //   state.success = true // registration successful
//     // },
//     // [registerUser.rejected]: (state, { payload }) => {
//     //   state.loading = false
//     //   state.error = payload
//     // },
//   },
})

function createExtraReducers() {
    return (builder) => {
        login();
        logout()

        function login() {
            var { pending, fulfilled, rejected } = userLogin;
            builder
                .addCase(pending, (state) => {
                    state.loading = true
                    state.error = null;
                })
                .addCase(fulfilled, (state, action) => {
                    // const user = action.payload;

                    // store user details and basic auth data in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('user', JSON.stringify(user));
                    state.loading = false
                    state.userInfo = action.payload
                    state.userToken = action.payload.token_refresh
                    // const token = Cookies.jwt
                    // const token =userToken
                    // // console.log(token)
                    // console.log('token from cookie >', state.userToken)
                    // // console.log('token from cookie >', )
                    // const {payment, error} = supabase.from('applicant_orders')
                    //                   .select('status, item_id, id')
                    //                   .eq('status', 'processed')
                    //                   // .eq('applicants.refresh_token', state.userToken)
                    //                   // applicant_schools(schools(school_name))
                    //                   // , applicants(refresh_token, participants(is_complete)
                    // console.log(error)
                    // if(!payment)                                      
                    //   state.error=true

                    // console.log(payment)
                    // state.userPayment = payment.status
                    // state.userSchool = payment.applicant_schools[0].school.school_name
                    // state.userFormComplete = payment.applicants.participants.is_complete

                    
                    // if(action.payload.status!==200){
                    //   state.error
                    // }

                    // get return url from location state or default to home page
                    // const { from } = history.location.state || { from: { pathname: '/' } };
                    // history.navigate(from);
                })
                .addCase(rejected, (state, action) => {
                    state.loading = false
                    state.error = action.error
                    state.errorMsg = action.payload.message
                });
        }
        function logout() {
            var { pending, fulfilled, rejected } = userLogout;
            builder
                .addCase(pending, (state) => {
                    state.loading = true
                    state.error = null;
                })
                .addCase(fulfilled, (state, action) => {
                    // const user = action.payload;

                    // store user details and basic auth data in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('user', JSON.stringify(user));
                    state.loading = false
                    state.userInfo = null
                    state.userToken = null
                    // if(action.payload.status!==200){
                    //   state.error
                    // }

                    // get return url from location state or default to home page
                    // const { from } = history.location.state || { from: { pathname: '/' } };
                    // history.navigate(from);
                })
                .addCase(rejected, (state, action) => {
                    state.loading = false
                    state.error = action.error
                });
        }
    };
}

export const { logout, setCredentials } = authSlice.actions

export default authSlice.reducer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                