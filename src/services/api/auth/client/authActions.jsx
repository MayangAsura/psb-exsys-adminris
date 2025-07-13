// import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../../services/api/server/local-server'
// import axios from '../../services/api/server/prod-server'
// import axios from '../../service/api/prod-server'

// const backendURL = import.meta.env.VITE_SERVER_URL? import.meta.env.VITE_SERVER_URL : 'http://localhost:3000'

export const userLogin = createAsyncThunk(
  'api/auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
      // ${backendURL}
      const { data } = await axios.post(
        `api/auth/login`,
        { username, password },
        config
      )

      // store user's token in local storage
    //   .setItem('jwt', data.t)

      return data
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)
export const userLogout = createAsyncThunk(
  'api/auth/logout',
  async () => {
    try {

      // console.log('masuk')
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }

      const { data } = await axios.get(
        `api/auth/logout`,
        // { username, password },
        config
      )
      // console.log(data)
      
      if( !data ){
        console.log('err')
      }

      // store user's token in local storage
    //   .setItem('jwt', data.t)

      return data
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        // return rejectWithValue(error.response.data.message)
      } else {
        // return rejectWithValue(error.message)
      }
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ firstName, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      await axios.post(
        `/api/user/register`,
        { firstName, email, password },
        config
      )
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)