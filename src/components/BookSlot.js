
import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import './HomePage.css'
import { Redirect } from 'react-router-dom'

export class BookSlot extends React.Component {
    constructor(props){
      super(props)
      // this.state = { data : dummyData || [] }
      
      if (window.location.href.includes('localhost'))
          this.backendURL = 'http://localhost:5000'
      else
          this.backendURL = 'https://gyard-be.herokuapp.com'
      // this.state.displayData = []
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    submitValues = async () => {
        var personName = document.getElementById('personName').value
        var name = document.getElementById('name').value
        var pinCode = document.getElementById('pinCode').value
        var errorMsg = document.getElementById('errorMsg')
        if (!(name && pinCode )) {  // any empty value
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Please enter all the values'
            return
        }
        if (pinCode.toString().length != 6)  {
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Pin Code should have only 6 digits'
            return
        }
        // console.log('Booking slot', name, pinCode, personName, this.access_token)

        var url = this.backendURL + '/bookSlot' + '?name=' + name + '&pinCode=' + pinCode +
            '&personName=' + personName +
            '&access_token=' + this.access_token
        console.log(url)
        var res = await axios.get(url)
        res = res.data
        if (res.error) {
            errorMsg.style = 'color: red'
            errorMsg.innerText = res.error
            return
        }
        if (res.status) {
            errorMsg.style = 'color: green'
            errorMsg.innerText = res.status + ". Redirecting to home page in: 5 seconds" 

            // clear all entered values
            document.getElementById('personName').value = ''
            document.getElementById('name').value = ''
            document.getElementById('pinCode').value = ''

            for (var i=5; i>0; i--) {
                errorMsg.innerText = res.status + ". Redirecting to home page in " + i + " seconds"
                await this.sleep(1000)
            }
            window.location.href = '/getBookedSlots'
        } else
            errorMsg.innerText = 'Error:' + res.error
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token)
            return <Redirect to="/login" />
        return (<div className="addDataPage">
            <h2 className="addDataHeading"> Book slot </h2>
            Dead person's name: <input type="text" placeholder="Person Name" id="personName"/> <br />
            Cemetery Name: <input type="text" placeholder="Cemetery Name" id="name"/> <br />
            Pin Code:  <input type="number" placeholder="Pin" id="pinCode"/> <br />
            <input type="button" value="Submit" className="submitButton" 
                onClick={() => {this.submitValues()}}/>
            <input type="button" value="🏠 Home" className="submitButton"
                onClick={() => { window.location.href = '/' }}/>
            <p className="errorMsgClass" id="errorMsg"></p>
        </div>)
    }
}


export class CancelSlot extends React.Component {
    constructor(props){
      super(props)
      if (window.location.href.includes('localhost'))
          this.backendURL = 'http://localhost:5000'
      else
          this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    submitValues = async () => {
        var personName = document.getElementById('personName').value
        var errorMsg = document.getElementById('errorMsg')

        if (!personName) {  // any empty value
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Please enter all the values'
            return
        }
        var url = this.backendURL + '/cancelSlot' + '?personName=' + personName
            + '&access_token=' + this.access_token
        var res = await axios.get(url)
        res = res.data
        if (res.error) {
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Error: ' + res.error
            return
        }
        if (res.status) {
            errorMsg.style = 'color: green'
            errorMsg.innerText = res.status + ". Redirecting to home page in: 5 seconds"
            for (var i=5; i>0; i--) {
                errorMsg.innerText = res.status + ". Redirecting to home page in " + i + " seconds"
                await this.sleep(1000)
            }
            window.location.href = '/'
            return
        }
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token)
            return <Redirect to="/login" />
        return (<div className="addDataPage">
            <h2 className="addDataHeading"> Cancel slot </h2>
            Dead person's name: <input type="text" placeholder="Person Name" id="personName"/> <br />
            <input type="button" value="Submit" className="submitButton" 
                onClick={() => {this.submitValues()}}/>
            <input type="button" value="🏠 Home" className="submitButton"
                onClick={() => { window.location.href = '/' }}/>
            <p className="errorMsgClass" id="errorMsg"></p>
        </div>)
    }
}