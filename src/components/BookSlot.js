import React, { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import "./HomePage.css";
import { NavBar } from "./NavBar";
import backendURL from './BackendURL'

export class BookSlot extends React.Component {
    constructor(props){
      super(props)
      this.backendURL = backendURL
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setErrorMsg = (msg) => {
        var errorMsg = document.getElementById('errorMsg')
        errorMsg.style = 'color: red'
        errorMsg.innerText = msg
    }
    submitValues = async () => {
        var personName = document.getElementById('personName').value
        var name = document.getElementById('name').value
        var pinCode = document.getElementById('pinCode').value
        
        personName = personName.trim()
        name = name.trim()

        if (name === personName) {
            this.setErrorMsg('Graveyard name and Person name cannot be same')
            return
        }

        if (!(name)) {  // any empty value
            this.setErrorMsg('Please enter the name')
            return
        }
        if (pinCode.toString().length !== 6)  {
            this.setErrorMsg('Pin Code should have 6 digits')
            return
        }
        // if personName is not alphabetic, show error
        if (!personName.match(/^[a-zA-Z ]+$/)) {
            this.setErrorMsg('Person Name is invalid')
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
            this.setErrorMsg(res.error)
            return
        }
        if (res.status) {
            var errorMsg = document.getElementById('errorMsg')
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
            this.setErrorMsg('Error:' + res.error)
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token)
            return <Redirect to="/login" />
        return (
            <div>
                <NavBar />
                <div className="addDataPage">
                    <h2 className="addDataHeading"> Book slot </h2>
                    Dead person's name: <input type="text" placeholder="Person Name" id="personName"/> <br />
                    Cemetery Name: <input type="text" placeholder="Cemetery Name" id="name"/> <br />
                    Pin Code:  <input type="number" placeholder="Pin" id="pinCode"/> <br />
                    <input type="button" value="Submit" className="submitButton" 
                        onClick={this.submitValues}/>
                    <p className="errorMsgClass" id="errorMsg"></p>
                </div>
            </div>
        )
    }
}