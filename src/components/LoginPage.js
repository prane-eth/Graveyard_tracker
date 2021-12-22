import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import md5 from 'md5'
import { NavBar } from './NavBar'


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
        errorMsg.style.color = 'red'
        errorMsg.innerHTML = msg
    }
    selectRandom = (string) => {
        var random = Math.floor(Math.random() * string.length)
        return string[random]
    }
    randomPassword = () => {
        var upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var lowerCase = 'abcdefghijklmnopqrstuvwxyz'
        var numbers = '0123456789'
        var specialChars = '!@#$%^&*()_+'
        var possible = upperCase + lowerCase + numbers + specialChars
        
        var password = ''
        password += this.selectRandom(upperCase) + this.selectRandom(upperCase)
        password += this.selectRandom(lowerCase) + this.selectRandom(lowerCase)
        password += this.selectRandom(numbers)  + this.selectRandom(numbers)
        password += this.selectRandom(specialChars) + this.selectRandom(specialChars)
        password += this.selectRandom(possible) + this.selectRandom(possible) + this.selectRandom(possible)
        password += this.selectRandom(possible) + this.selectRandom(possible)
        return password
    }
    setAdminCookie = async (access_token) => {
        if (!access_token)
            return
        var url = this.backendURL + '/isAdmin?access_token=' + access_token
        var res = await axios.get(url)
        console.log(res.data.status)
        if (res.data.status == true) {
            cookie.save('admin', 'true', { path: '/' })
            return true
        } else {
            return false
        }
    }
    getResult = async (reqType) => {
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        email = email.trim()
        // check if email is valid
        if (!email.includes('@') || !email.includes('.')) {
            this.setErrorMsg('Invalid email')
            return 'error'
        }

        // check if password is strong
        if (password.toString().length < 8) {
            this.setErrorMsg('Password must contain at least 8 characters')
            return 'error'
        }
        console.log(password.toString())
        // check if password is strong
        if (!password.match(/[a-z]/g) || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g)) {
            this.setErrorMsg(
                'Password must contain at least one lowercase letter, one uppercase letter and one number'
                + '<br> Recommended password: ' + this.randomPassword()
            )
            return 'error'
        }

        password = this.getHash(password)
        let url = this.backendURL + '/' + reqType + '?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        console.log(res)
        var errorMsg = document.getElementById('errorMsg')
        if (res.error) {
            this.setErrorMsg(res.error)
            return 'error'
        } else if (res.status) {
            errorMsg.style = 'color: green'
            errorMsg.innerText = res.status

            // if reqType is login
            if (reqType == 'login') {
                this.access_token = res.access_token
                cookie.save('access_token', this.access_token, { path: '/' })
                this.setAdminCookie(this.access_token)
                window.location.href = "/"
                return this.access_token
            }
        }
    }
    login = async () => {
        var access_token = await this.getResult('login')
        return access_token
    }
    signup = async () => {
        var result = await this.getResult('signup')
        if (result == 'error')
            return result
        // login after signup
        var access_token = await this.getResult('login')
        return access_token;
    }
    render()   {
        let access_token = cookie.load('access_token')
        if (access_token)  {
            console.log('Already logged in')
            return <Redirect to="/" />
        }
        return (
            <div>
                <NavBar />
                <div className="loginPage">
                    <h2> Login or Register </h2>
                    <input type="email" defaultValue="" placeholder="Email" id="email"/>
                    <br />
                    <input type="password" defaultValue="" placeholder="Password" id="password"/>
                    <br />
                    <input type="button" onClick={this.login} value="Login"/>
                    <input type="button" onClick={this.signup} value="Register"/>
                    <br />
                    <p id="errorMsg"></p>
                </div>
            </div>
        )
    }
}

export class LogoutPage extends React.Component {
  constructor(props)  {
      super(props)
      this.backendURL = ''
      if (window.location.href.includes('localhost'))
          this.backendURL = 'http://localhost:5000'
      else
          this.backendURL = 'https://gyard-be.herokuapp.com'
  }
  componentDidMount() {
    var access_token = cookie.load('access_token', { path: '/' })
    let url = this.backendURL + '/logout?access_token=' + access_token
    axios.get(url)
    cookie.remove('access_token', { path: '/' })
    cookie.remove('admin', { path: '/' })
  }
  render() {
    window.location.href = "/"
    return <p className="loggingOut"> Logging out... </p>
  }
}


export class ChangePassword extends React.Component {
    constructor(props)  {
        super(props)
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    componentDidMount() {
        var access_token = cookie.load('access_token', { path: '/' })
        if (!access_token) {
            window.location.href = "/"
        }
    }
    setErrorMsg = (msg) => {
        var errorMsg = document.getElementById('errorMsg')
        errorMsg.style = 'color: red'
        errorMsg.innerText = msg
    }
    getHash = (password) => {
        return md5(password)
    }
    submitValues = async () => {
        var errorMsg = document.getElementById('errorMsg')
        var newPassword = document.getElementById('password').value
        var confirmPassword = document.getElementById('confirmPassword').value
        if (newPassword != confirmPassword) {
            this.setErrorMsg('Passwords do not match')
            return
        }
        // check whether newPassword is secure
        if (newPassword.length < 8) {
            this.setErrorMsg('Password must contain at least 8 characters')
            return
        }
        if (newPassword.length > 20) {
            this.setErrorMsg('Password must contain at most 20 characters')
            return
        }
        if (!newPassword.match(/[a-z]/g) || !newPassword.match(/[A-Z]/g) || !newPassword.match(/[0-9]/g)) {
            this.setErrorMsg('New password must contain at least one lowercase letter, one uppercase letter and one number')
            return
        }

        newPassword = this.getHash(newPassword)
        var access_token = cookie.load('access_token', { path: '/' })
        let url = this.backendURL + '/changePassword?access_token=' + access_token
            + '&newPassword=' + newPassword
        var res = await axios.get(url)
        res = res.data
        if (res.error) {
            this.setErrorMsg(res.error)
        } else if (res.status) {
            errorMsg.style = 'color: green'
            errorMsg.innerText = res.status
            window.location.href = "/"
        }
    }
    render() {
        return (
            <div>
                <NavBar />
                <div className="loginPage">
                    <h5> Enter a new password </h5>
                    <input type="password" placeholder="Password" id="password"/>
                    <br />
                    <input type="password" placeholder="Confirm Password" id="confirmPassword"/>
                    <br />
                    <input type="button" onClick={this.submitValues} value="Submit"/>
                    <br />
                    <p id="errorMsg"></p>
                </div>
            </div>
        )
    }
}