import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'


export class LoginPage extends React.Component {
    constructor(props)  {
        super(props)
        this.backendURL = ''
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
        // this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    login = async () => {
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        let url = this.backendURL + '/login?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        if (res.error)
            return 'Unable to login with that credentials'
        else if (res.access_token) {
            var access_token = res.access_token
            cookie.save('access_token', access_token, { path: '/' })
            window.location.href = "/addData"
            return access_token
        }
    }
    signup = async () => {
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        let url = this.backendURL + '/signup?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        console.log(res)
        var responseText = document.getElementById('responseText')
        if (res.error) {
            responseText.style = 'color: red'
            responseText.innerText = res.error
        } else if (res.status == 'success') {
            // window.location.href = "/login"  // redirect to same page to login
            responseText.style = 'color: green'
            responseText.innerText = res.status
        }
    }
    render()    {
        let access_token = cookie.load('access_token')
        if (access_token)
            return <Redirect to="/addData" />
        return (
            <div className="loginPage">
                <input type="email" defaultValue="dummy@gmail.com" placeholder="Email" id="email"/>
                <br />
                <input type="password" defaultValue="dummy123" placeholder="Password" id="password"/>
                <br />
                <input type="button" onClick={() => {this.login()}} value="Login"/>
                <input type="button" onClick={() => {this.signup()}} value="Signup"/>
                <input type="button" value="Home" onClick={() => { window.location.href = '/' }}/>
                <br />
                <p id="responseText"></p>
            </div>
        )
    }
}

export class AddDataPage extends React.Component {
    constructor(props)  {
        super(props)
        this.backendURL = ''
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
        // this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    submitValues = async () => {
        var name = document.getElementById('name').value
        var pinCode = document.getElementById('pinCode').value
        var occupied = document.getElementById('occupied').value
        var vacancies = document.getElementById('vacancies').value
        var address = document.getElementById('address').value
        var msgDiv = document.getElementById('errorMsg')
        if (!(name && pinCode && occupied && vacancies && address)) {  // any empty value
            msgDiv.style = 'color: red'
            msgDiv.innerText = 'Please enter all the values'
            return
        }
        if (""+pinCode.length != 6)  {
            msgDiv.style = 'color: red'
            msgDiv.innerText = 'Pin Code should have only 6 digits'
            return
        }
        console.log(name, pinCode, occupied, vacancies, address)

        var url = this.backendURL + '/updateData' + '?name=' + name + '&pinCode=' + pinCode +
            '&occupied=' + occupied + '&vacancies=' + vacancies + '&address=' + address
        var res = await axios.get(url)
        console.log(url)
        res = res.data
        if (res.error) {
            msgDiv.style = 'color: red'
            msgDiv.innerText = res.error
            return
        }
        msgDiv.style = 'color: green'
        if (res.status)
            msgDiv.innerText = res.status
        else
            msgDiv.innerText = 'unknown error'
    }
    render()    {
        let access_token = cookie.load('access_token')
        if (!access_token)
            return <Redirect to="/login" />
        return (<div className="addDataPage">
            <h2 className="addDataHeading"> Add data </h2>
            Name: <input type="text" placeholder="Name" id="name"/> <br />
            Pin Code:  <input type="number" placeholder="Pin" id="pinCode"/> <br />
            Occupied:  <input type="number" placeholder="Occupied" id="occupied"/> <br />
            Vacancies:  <input type="number" placeholder="Vacancies" id="vacancies"/> <br />
            Address:  <input type="text" placeholder="Address" id="address"/> <br />
            <input type="button" value="Submit" className="submitButton" 
                onClick={() => {this.submitValues()}}/>
            <input type="button" value="Logout" className="submitButton" 
                onClick={() => { window.location.href = '/logout'}}/>
            <input type="button" value="Home" className="submitButton"
                onClick={() => { window.location.href = '/' }}/>
            <p className="errorMsgClass" id="errorMsg"></p>
        </div>)
    }
}