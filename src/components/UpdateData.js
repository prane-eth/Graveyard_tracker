import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { NavBar } from './NavBar'
import backendURL from './BackendURL'


export class UpdateData extends React.Component {
    constructor(props)  {
        super(props)
		this.backendURL = backendURL
        this.access_token = cookie.load('access_token')
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setErrorMsg = (msg) => {
        var errorMsg = document.getElementById('errorMsg')
        errorMsg.style = 'color: red'
        errorMsg.innerText = msg
    }
    encodeURL = (url) => {
        return encodeURI(url)
    }
    submitValues = async () => {
		var name = document.getElementById("name").value;
		var pinCode = document.getElementById("pinCode").value;
		var occupied = document.getElementById("occupied").value;
		var vacancies = document.getElementById("vacancies").value;
		var address = document.getElementById("address").value;
		var mapLink = document.getElementById("mapLink").value;

		name = name.trim();
		pinCode = pinCode.trim();
		occupied = occupied.trim();
		vacancies = vacancies.trim();
		address = address.trim();
		mapLink = mapLink.trim();

		// url encode mapLink
		mapLink = this.encodeURL(mapLink);
		console.log(mapLink);

		var errorMsg = document.getElementById("errorMsg");
		if (!name) return this.setErrorMsg("Name cannot be empty");
		// length !== 6
		if (pinCode.length !== 6)
			return this.setErrorMsg("Pin Code should have only 6 digits");
		// console.log('Adding data', name, pinCode, occupied, vacancies, address, this.access_token)
		if (!(occupied || vacancies || address || mapLink))
			return this.setErrorMsg("Atleast one other field should be filled");

		var url =
			this.backendURL +
			"/updateData?name=" +
			name +
			"&pinCode=" +
			pinCode +
			"&occupied=" +
			occupied +
			"&vacancies=" +
			vacancies +
			"&address=" +
			address +
			"&mapLink=" +
			mapLink +
			"&access_token=" +
			this.access_token;
		var res = await axios.get(url);
		console.log(url);
		res = res.data;
		if (res.error) {
			this.setErrorMsg(res.error);
			return;
		}
		if (res.status) {
			errorMsg.style = "color: green";
			errorMsg.innerText =
				res.status + ". Redirecting to home page in: 5 seconds";

			// clear all entered values
			document.getElementById("name").innerText = "";
			document.getElementById("pinCode").innerText = "";
			document.getElementById("occupied").innerText = "";
			document.getElementById("vacancies").innerText = "";
			document.getElementById("address").innerText = "";

			for (var i = 5; i > 0; i--) {
				errorMsg.innerText =
					res.status +
					". Redirecting to home page in " +
					i +
					" seconds";
				await this.sleep(1000);
			}
			window.location.href = "/";
		} else errorMsg.innerText = "unknown error";
	}
    componentWillMount() {
        this.access_token = cookie.load('access_token')
        var url = this.backendURL + '/isAdmin?access_token=' + this.access_token
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (!res.status)
                    window.location.href = '/'
            })
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token)
            return <Redirect to="/login" />
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