import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import md5 from 'md5'


export class LoginPage extends React.Component {
    constructor(props)  {
        super(props)
        this.backendURL = ''
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    // function to get hash of password
    getHash(password) {
        return md5(password)
    }
    setErrorMsg = (msg) => {
        var errorMsg = document.getElementById('errorMsg')
        errorMsg.style = 'color: red'
        errorMsg.innerText = msg
    }
    getResult = async (reqType) => {
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        password = this.getHash(password)
        console.log(password)
        // check if email is valid
        if (!email.includes('@') || !email.includes('.')) {
            this.setErrorMsg('Invalid email')
            return
        }
        let url = this.backendURL + '/' + reqType + '?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        console.log(res)
        var errorMsg = document.getElementById('errorMsg')
        if (res.error) {
            this.setErrorMsg(res.error)
        } else if (res.status) {
            errorMsg.style = 'color: green'
            errorMsg.innerText = res.status

            // if reqType is login
            if (reqType == 'login') {
                this.access_token = res.access_token
                console.log('access_token: ' + this.access_token)
                cookie.save('access_token', this.access_token, { path: '/' })
                window.location.href = "/"
                return this.access_token
            }
        }
    }
    login = async () => {
        var result = await this.getResult('login')
        return result
    }
    signup = async () => {
        var result = await this.getResult('signup')
        // login after signup
        result = await this.getResult('login')
        return result;
    }
    render()   {
        let access_token = cookie.load('access_token')
        if (access_token)  {
            console.log('Already logged in')
            return <Redirect to="/" />
        }
        return (
            <div className="loginPage">
                <h2> Login here to update the data </h2>
                <input type="email" defaultValue="" placeholder="Email" id="email"/>
                <br />
                <input type="password" defaultValue="" placeholder="Password" id="password"/>
                <br />
                <input type="button" onClick={this.login} value="Login"/>
                <input type="button" onClick={this.signup} value="Register"/>
                <input type="button" value="🏠 Home" onClick={() => { window.location.href = '/' }}/>
                <br />
                <p id="errorMsg"></p>
            </div>
        )
    }
}

