import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { NavBar } from './NavBar'


export class UpdateData extends React.Component {
    constructor(props)  {
        super(props)
        this.backendURL = ''
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    submitValues = async () => {
        var name = document.getElementById('name').value
        var pinCode = document.getElementById('pinCode').value
        var occupied = document.getElementById('occupied').value
        var vacancies = document.getElementById('vacancies').value
        var address = document.getElementById('address').value
        var mapLink = document.getElementById('mapLink').value
        // url encode mapLink
        mapLink = encodeURIComponent(mapLink)
        var errorMsg = document.getElementById('errorMsg')
        if (!(name && pinCode )) {  // any empty value
                    // && occupied && vacancies && address
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Please enter all the values'
            return
        }
        // length != 6
        if (pinCode.length != 6) {
            errorMsg.style = 'color: red'
            errorMsg.innerText = 'Pin Code should have only 6 digits'
            return
        }
        // console.log('Adding data', name, pinCode, occupied, vacancies, address, this.access_token)

        var url = this.backendURL + '/updateData?name=' + name + '&pinCode=' + pinCode
            + '&occupied=' + occupied + '&vacancies=' + vacancies + '&address=' + address
            + '&mapLink=' + mapLink + '&access_token=' + this.access_token
        var res = await axios.get(url)
        console.log(url)
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
            document.getElementById('name').innerText = ''
            document.getElementById('pinCode').innerText = ''
            document.getElementById('occupied').innerText = ''
            document.getElementById('vacancies').innerText = ''
            document.getElementById('address').innerText = ''

            for (var i=5; i>0; i--) {
                errorMsg.innerText = res.status + ". Redirecting to home page in " + i + " seconds"
                await this.sleep(1000)
            }
            window.location.href = '/'
        } else
            errorMsg.innerText = 'unknown error'
    }
    componentWillMount() {
        this.access_token = cookie.load('access_token')
        if (!this.access_token)
            return <Redirect to="/login" />

        var url = this.backendURL + '/isAdmin?access_token=' + this.access_token
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (!res.isAdmin)
                    return <Redirect to="/login" />
            })
    }
    render()    {
        return (
            <div>
                <NavBar />
                <div className="addDataPage">
                    <h2 className="addDataHeading"> Update data </h2>
                    Name: <input type="text" placeholder="Name" id="name"/> <br />
                    Pin Code:  <input type="number" placeholder="Pin" id="pinCode"/> <br />
                    Occupied:  <input type="number" placeholder="Occupied" id="occupied"/> <br />
                    Vacancies:  <input type="number" placeholder="Vacancies" id="vacancies"/> <br />
                    Address:  <input type="text" placeholder="Address" id="address"/> <br />
                    Map link:  <input type="text" placeholder="Map link" id="mapLink"/> <br />
                    <input type="button" value="Submit" className="submitButton" 
                        onClick={this.submitValues}/>
                    <p className="errorMsgClass" id="errorMsg"></p>
                </div>
            </div>
        )
    }
}