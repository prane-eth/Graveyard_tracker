import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

var backendURL = 'http://localhost:5000'

export class LoginPage extends React.Component {
    login = async () => {
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        let url = backendURL + '/login?email=' + email + '&password=' + password
        let res = await axios.get(url)
        if ('error' in res)
            return 'Unable to login with that credentials'
        else if ('accessToken' in res) {
            var accessToken = res.accessToken
            cookie.save('accessToken', accessToken, { path: '/' })
            window.location.href = "/addData"
            return accessToken
        }
    }
    signup = async () => {
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        email = email.value
        password = password.value
        let url = backendURL + '/signup?email=' + email + '&password=' + password
        let res = await axios.get(url)
        res = res.data
        console.log(res)
        if (res.error)
            return 'Unable to signup with that credentials'
        else if (res.signupStatus == 'success') {
            window.location.href = "/login"  // redirect to same page to login
            return 'success'
        }
    }
    render()    {
        let accessToken = cookie.load('accessToken')
        if (accessToken)
            return <Redirect to="/addData" />
        return (
            <div className="loginPage">
                <input type="email" defaultValue="dummy@gmail.com" placeholder="Email" id="email"/>
                <br />
                <input type="password" defaultValue="dummy123" placeholder="Password" id="password"/>
                <br />
                <input type="button" onClick={() => {this.login()}} value="Login"/>
                <input type="button" onClick={() => {this.signup()}} value="Signup"/>
            </div>
        )
    }
}

export class AddDataPage extends React.Component {
    submitValues = () => {
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
            msgDiv.style = 'color: lightred'
            msgDiv.innerText = 'Pin Code should have only 6 digits'
            return
        }
        console.log(name, pinCode, occupied, vacancies, address)
        msgDiv.style = 'color: green'
        msgDiv.innerText = 'Updated data successfully. Thank you.'
    }
    render()    {
        let accessToken = cookie.load('accessToken')
        if (!accessToken)
            return <Redirect to="/login" />
        return (<div className="addDataPage">
            <h2 className="addDataHeading"> Add data </h2>
            Name: <input type="text" placeholder="Name" id="name"/> <br />
            Pin Code:  <input type="number" placeholder="Pin" id="pinCode"/> <br />
            Occupied:  <input type="number" placeholder="Occupied" id="occupied"/> <br />
            Vacancies:  <input type="number" placeholder="Vacancies" id="vacancies"/> <br />
            Address:  <input type="text" placeholder="Address" id="address"/> <br />
            <input type="button" id="button" value="Submit" className="submitButton" 
                onClick={() => {this.submitValues()}}/> <br />
            <input type="button" id="button" value="Logout" className="submitButton" 
                onClick={() => { window.location.href = '/logout'}} /> <br />
            <p className="errorMsgClass" id="errorMsg"></p>
        </div>)
    }
}