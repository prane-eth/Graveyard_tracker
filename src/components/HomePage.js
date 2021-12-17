import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import './HomePage.css'
import { FiRefreshCw } from 'react-icons/fi'
import { FaSearchLocation } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'
import { GiCancel } from 'react-icons/gi'
import { GrTicket } from 'react-icons/gr'
import { FaMapMarkerAlt } from 'react-icons/fa'


export class HomePage extends React.Component {
  constructor(props){
    super(props)
    var dummyData = [
      { name: 'Data is not loaded',
          pinCode: '-', occupied: '-', vacancies: '-',
          address: '-' }
    ]
    this.state = { data : dummyData || [] }
    
    if (window.location.href.includes('localhost'))
        this.backendURL = 'http://localhost:5000'
    else
        this.backendURL = 'https://gyard-be.herokuapp.com'
    this.state.displayData = []
  }
  updateData = () => {
    this.state.displayData = []
    var searchText = document.getElementById('searchBox')
    if (!searchText)
        return console.log("No search text")
    searchText = searchText.value
    searchText = searchText.toLowerCase()
    if (searchText) {
        var hasData = false
        for (var row of this.state.data) {
            if (row.name.toLowerCase().includes(searchText)
                    || row.pinCode.toString().toLowerCase().includes(searchText)
                    || row.address.toLowerCase().includes(searchText)) {
                this.state.displayData.push(row)
                hasData = true
            }
        }
        if (!hasData) { 
            console.log("No results found")
            this.state.displayData.push({
                name: "No results found", pinCode: "-",
                occupied: "-", vacancies: "-", address: "-"
            })
        }
    } else {
        this.state.displayData = this.state.data
    }
    this.setState({displayData: this.state.displayData})
  }
  getData = async () => {
    var res = await axios.get(this.backendURL + '/getData')
    res = res.data
    if (!res)
        console.log('No response from server')
    else if (res.error)
        console.log('error: ' + res.error)
    else
        this.setState({ data : res })
    this.updateData()
  }
  findNearest = () => {
    var pinCode = document.getElementById('nearestBox')
    if (!pinCode)
        return
    pinCode = pinCode.value
    var result = ""
    if (!pinCode)
        result = " "
    if (pinCode.length == 0)    {
        result = " "
        document.getElementById('searchBox').value = ""
        document.getElementById('nearestPinCode').innerHTML = ""
        this.updateData()
        return
    }
    if (pinCode.length > 6)    {
        result = " "
        document.getElementById('searchBox').value = ""
        document.getElementById('nearestPinCode').innerHTML = "Pin Code should contain only 6 digits"
        this.updateData()
        return
    }
    while (pinCode.length < 6)
        pinCode = pinCode + '0'
    var nearest = this.state.data.reduce((prev, curr) => {
        if (Math.abs(curr.pinCode - pinCode) < Math.abs(prev.pinCode - pinCode))
            return curr
        else
            return prev
    })
    if (!result)
        result = 'Nearest pin code is ' + nearest.pinCode + ' at ' + nearest.address
    document.getElementById('nearestPinCode').innerHTML = result
    document.getElementById('searchBox').value = nearest.pinCode
    this.updateData()
  }
  getLoginButton = () => {
    let access_token = cookie.load('access_token')
    if (access_token)
        return (
            <div>
            <input type="button" value="Logout" onClick={() => {
                window.location.href = "/logout"
            }} />
            <input type="button" value="Book a slot" onClick={() => {
                window.location.href = "/bookSlot"
            }} />
            <input type="button" value="Get booked slots" onClick={() => {
                window.location.href = "/getBookedSlots"
            }} />
            <input type="button" value="Cancel a booked slot" onClick={() => {
                window.location.href = "/cancelSlot"
            }} />
            <input type="button" value="Update data" onClick={() => {
                window.location.href = "/addData"
            }} />
            </div>
        )
    else
        return (
            <input type="button" value="Login/Register" onClick={() => {
                window.location.href = "/login"
            }} />
        )
  }
  componentDidMount() {
    this.access_token = cookie.load('access_token')
    console.log('HomePage mounted')
    console.log(this.access_token)
    if (this.access_token) {
        var url = this.backendURL + '/isTokenValid?access_token=' + this.access_token
        axios.get(url).then(res => {
            if (res.data.error) {
                console.log('error: ' + res.data.error)
                cookie.remove('access_token', { path: '/' })
                window.location.href = "/"
            }
        })
    }
    this.getData()
    var sec = 1000  // second in milliseconds
    if (!this.interval)  {
        this.interval = setInterval(() => {  // refresh at regular intervals
            this.getData()
        }, 30*sec);  // 30 seconds
    }
  }
  componentWillUnmount() {
    if (this.interval)
        clearInterval(this.interval)
  }
  render()  {
    // if (!this.access_token){
    //     console.log('No access token')
    //     return <Redirect to="/login" />
    // }
    return (
        <div>
        <div className="navbar">
            <div className="navbar-left">
                <header className="App-header">
                    <div className="nav-text" onClick={() => { window.location.href = '/' }}>
                        Graveyard vacancy tracking system
                    </div>
                </header>
            </div>
        </div>
        <div className="App">
        <input id="searchBox" type="search" className="inputBox"
            placeholder="Search for graveyard" onInput={this.updateData} />
        <FaSearchLocation class="icon" />
        <table>
            <thead>
                <tr>
                    <th> Name </th>
                    <th className="address"> Address </th>
                    <th> Pin Code </th>
                    <th> Occupied </th>
                    <th> Vacancies </th>
                    <th> Map location </th>
                </tr>
            </thead>
            <tbody>
            {
                this.state.displayData.map((key, index) => {
                    return (
                        <tr key={index}>
                            <td> {key.name} </td>
                            <td className="address"> {key.address} </td>
                            <td> {key.pinCode} </td>
                            <td> {key.occupied} </td>
                            <td className={key.vacancies <= 5 ? 'low-vacancies' : ''}>
                                {key.vacancies}
                            </td>
                            <td>
                                <FaMapMarkerAlt class="icon"
                                    style={{cursor: 'pointer', color: 'red'}}
                                    onClick={() => {
                                        if (!key.url)
                                            key.url = 'https://www.google.com/maps/search/'
                                                + key.name + ', ' + key.address
                                        window.open(key.url, '_blank')
                                    }}
                                />
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
        <span className="cursor-pointer" onClick={this.getData}>
            <span className="refreshText"> Refresh data </span>
            <span className="refreshBtn">
                <FiRefreshCw class="icon" />
            </span>
        </span>
        <br />
        Not found any with your pin code? Find nearest pin code
        <input id="nearestBox" type="number" className="inputBox"
            placeholder="Enter pin code" onInput={this.findNearest} />
        <br />
        <div id="nearestPinCode"> </div>
        <br />
        {this.getLoginButton()}
        <div className="emptySpace">  </div>
      </div>
      </div>
    );
  }
}


export class GetBookedSlots extends React.Component {
    constructor(props)  {
        super(props)
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
        this.state = { bookedSlots: [] }
    }
    getBookedSlots = async (access_token) => {
        var url = this.backendURL + '/getBookedSlots?access_token=' + access_token
        var res = await axios.get(url)
        res = res.data
        var msgDiv = document.getElementById('errorMsg')
        msgDiv.style.color = 'red'
        if (!res)
            msgDiv.innerHTML = 'Error: ' + 'No response from server'
        else if (res.error)
            msgDiv.innerHTML = 'Error: ' + res.error
        else {
            msgDiv.style.color = 'green'
            this.setState({ bookedSlots: res.slots })
        }
        // console.log(url)
        // console.log(res)
    }
    componentWillMount() {
        this.access_token = cookie.load('access_token')
        console.log('access_token: ' + this.access_token)
        if (!this.access_token)  {
            console.log('No access token')
            window.location.href = "/login"
        }
        this.getBookedSlots(this.access_token)
    }
    timestampToLocalDateTime = (timestamp) => {
        var date = new Date(timestamp)
        var localDateTime = date.toLocaleString()
        return localDateTime
    }
    cancelSlot = async (personName) => {
        var url = this.backendURL + '/cancelSlot?personName=' + personName
            + '&access_token=' + this.access_token
        var res = await axios.get(url)
        res = res.data

        var msgDiv = document.getElementById('errorMsg')
        msgDiv.style = 'color: red'
        if (!res)
            msgDiv.innerHTML = 'Error: ' + 'No response from server'
        else if (res.error)
            msgDiv.innerHTML = 'Error: ' + res.error
        else if (res.status) {
            msgDiv.style = 'color: green'
            msgDiv.innerHTML = res.status
        } else
            msgDiv.innerHTML = 'Error: ' + 'Unknown error'
        console.log(url)
        console.log(res)
        this.getBookedSlots(this.access_token)
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token){
            console.log('No access token')
            return <Redirect to="/login" />
        }
        console.log(this.state.bookedSlots)
        return (<div className="addDataPage">
            <h2 className="addDataHeading"> Booked slots </h2>
            {/* display booked using a table */}
            <table id="bookedTable">
                <thead>
                    <tr>
                        <th> Person Name </th>
                        <th> Cemetery Name </th>
                        <th> Pin Code </th>
                        <th> Booking time </th>
                        <th> Get ticket </th> 
                        <th> Cancel slot </th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.bookedSlots.map((key, index) => {
                        return (
                            <tr key={index}>
                                <td> {key.personName} </td>
                                <td> {key.name} </td>
                                <td> {key.pinCode} </td>
                                <td> {this.timestampToLocalDateTime(key.timestamp)} </td>
                                <td> <GrTicket className="ticketBtn" onClick={() => {
                                    cookie.save('personName', key.personName, { path: '/' })
                                    cookie.save('name', key.name, { path: '/' })
                                    cookie.save('pinCode', key.pinCode, { path: '/' })
                                    cookie.save('timestamp', this.timestampToLocalDateTime(key.timestamp), { path: '/' })
                                    window.location.href = '/getTicket'
                                }} /> </td>
                                <td> <GiCancel className="cancelBtn" onClick={() => {
                                    // ask confirmation
                                    if (window.confirm('Are you sure you want to cancel this slot?'))
                                        this.cancelSlot(key.personName)
                                }} /> </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>

            <input type="button" value="🏠 Home" className="submitButton"
                onClick={() => { window.location.href = '/' }}/>
            <p className="errorMsgClass" id="errorMsg"></p>
        </div>)
    }
}


export class GetTicket extends React.Component {
    constructor(props)  {
        super(props)
        if (window.location.href.includes('localhost'))
            this.backendURL = 'http://localhost:5000'
        else
            this.backendURL = 'https://gyard-be.herokuapp.com'
    }
    render()    {
        this.access_token = cookie.load('access_token')
        if (!this.access_token){
            console.log('No access token')
            return <Redirect to="/login" />
        }
        
        var personName = cookie.load('personName', { path: '/' })
        var name = cookie.load('name', { path: '/' })
        var pinCode = cookie.load('pinCode', { path: '/' })
        var localDateTime = cookie.load('timestamp', { path: '/' })

        return (<div className="addDataPage">
            <div className="emptySpace" />
            <h2 className="addDataHeading"> Ticket </h2>
            <div className="ticketContainer">
                <div className="ticket">
                    <div className="ticketBody">
                        <div className="ticketContent">
                            <p>
                                <span className="ticketLabel"> Person Name: </span>
                                <span className="ticketValue"> {personName} </span>
                            </p>
                            <p>
                                <span className="ticketLabel"> Graveyard Name: </span>
                                <span className="ticketValue"> {name} </span>
                            </p>
                            <p>
                                <span className="ticketLabel"> Pin Code: </span>
                                <span className="ticketValue"> {pinCode} </span>
                            </p>
                            <p>
                                <span className="ticketLabel"> Booking time: </span>
                                <span className="ticketValue"> {localDateTime} </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <input type="button" value="Home" className="submitButton"
                onClick={() => { window.location.href = '/' }}/>
        </div>)
    }
}
            
