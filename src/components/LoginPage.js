import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

export class LoginPage extends React.Component {
    login = async () => {
        var backendURL = 'http://localhost:5000'
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        if (email == "dummy@gyard.ml") {
            var accessToken = '918245y1824'
            cookie.save('accessToken', accessToken, { path: '/' })
            window.location.href = "/addData"  // redirect to same page to login
            return accessToken
        }
        let url = backendURL + '/login?email=' + email + '&password=' + password
        let res = await axios.get(url)
        if ('error' in res)
            return 'Unable to login with that credentials'
        else if ('accessToken' in res) {
            var accessToken = res.accessToken
            cookie.save('accessToken', accessToken, { path: '/' })
            window.location.href = "/addData"
            return accessToken
        } else
            return ''
    }
    signup = async () => {
        var backendURL = 'http://localhost:5000'
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        if (email == "dummy@gyard.ml"){
            window.location.href = "/login"  // redirect to same page to login
            return 'success'
        }
        let url = backendURL + '/signup?email=' + email + '&password=' + password
        let res = await axios.get(url)
        console.log(res)
        if ('error' in res)
            return 'Unable to signup with that credentials'
        else if ('signupStatus' in res && res.signupStatus == 'success') {
            window.location.href = "/login"  // redirect to same page to login
            return 'success'
        } else
            return ''
    }
    render()    {
        let accessToken = cookie.load('accessToken')
        if (accessToken)
            return <Redirect to="/addData" />
        return (<div>
            <input type="email" defaultValue="dummy@gyard.ml" placeholder="Email" id="email"/>
            <input type="password" defaultValue="dummy123" placeholder="Password" id="password"/>
            <input type="button" onClick={() => {this.login()}} value="Login"/>
            <input type="button" onClick={() => {this.signup()}} value="Signup"/>
        </div>)
    }
}

export class AddDataPage extends React.Component {
    render()    {
        let accessToken = cookie.load('accessToken')
        if (!accessToken)
            return <Redirect to="/login" />
        return (<div>
            This is page to add data
        </div>)
    }
}