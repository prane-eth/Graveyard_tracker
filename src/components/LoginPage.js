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
    getResult = async (reqType) => {
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        password = this.getHash(password)
        console.log(password)
        let url = this.backendURL + '/' + reqType + '?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        console.log(res)
        var responseText = document.getElementById('responseText')
        if (res.error) {
            responseText.style = 'color: red'
            responseText.innerText = res.error
        } else if (res.status) {
            responseText.style = 'color: green'
            responseText.innerText = res.status

            // if reqType is login
            if (reqType == 'login') {
                this.access_token = res.access_token
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
        return result
    }
    render()    {
        let access_token = cookie.load('access_token')
        if (access_token)
            return <Redirect to="/" />
        return (
            <div className="loginPage">
                <h2> Login here to update the data </h2>
                <input type="email" defaultValue="dummy@gmail.com" placeholder="Email" id="email"/>
                <br />
                <input type="password" defaultValue="dummy123" placeholder="Password" id="password"/>
                <br />
                <input type="button" onClick={this.login} value="Login"/>
                <input type="button" onClick={this.signup} value="Register"/>
                <input type="button" value="🏠 Home" onClick={() => { window.location.href = '/' }}/>
                <br />
                <p id="responseText"></p>
            </div>
        )
    }
}

