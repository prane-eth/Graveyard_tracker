import React from 'react'
import cookie from 'react-cookies'
import { Redirect } from 'react-router-dom'
import { FaSearchLocation } from 'react-icons/fa'
import { RiAccountPinCircleFill } from 'react-icons/ri'

import './HomePage.css'

export class NavBar extends React.Component {
    constructor(props){
      super(props)
      if (window.location.href.includes('localhost'))
          this.backendURL = 'http://localhost:5000'
      else
          this.backendURL = 'https://gyard-be.herokuapp.com'
      this.access_token = cookie.load('access_token')
    }
    getUpdateButton = () => {
        var admin = cookie.load('admin')
        if (admin)
            return (<a href="/addData"> Update data </a>)
        else
            return (<div />)
    }
    getLoginButton = () => {
      if (this.access_token)
          return (
              <div>
                  <a href="/bookSlot"> Book a slot </a>
                  <a href="/getBookedSlots"> Get booked slots </a>
                  {this.getUpdateButton()}
                  <a href="/changePassword"> Change password </a>
                  <a href="/logout"> Logout </a>
              </div>
          )
      else
          return (
              <div>
                  <a href="/login" className="login"> Login/Register </a>
              </div>
          )
    }
    render() {
        // navbar like https://www.w3schools.com/howto/howto_css_more_button.asp
        return (<div class="navbar">
            <a id="top-text" href="/"> Graveyard vacancy tracking system </a>
            <div class="dropdown">
                <button class="dropbtn">
                    <RiAccountPinCircleFill className="clickIcon" id="accountIcon" />
                </button>
                <div class="dropdown-content">
                    {this.getLoginButton()}
                </div>
            </div> 
            {/* if props has searchBox, return div */}
            {this.props.searchBox ?
                <div>
                    <input id="searchBox" type="search" className="inputBox"
                        placeholder="Search for graveyard" />
                    <FaSearchLocation class="icon" id="searchIcon" />
                </div> : null}
        </div>)
    }
}

export class PageClass extends React.Component {
    constructor(props){
      super(props)
      if (window.location.href.includes('localhost'))
          this.backendURL = 'http://localhost:5000'
      else
          this.backendURL = 'https://gyard-be.herokuapp.com'
      this.access_token = cookie.load('access_token')
      // if not homepage or login page or logout page, ask for login
      if (window.location.href.endsWith('/') || window.location.href.endsWith('/login')
            || window.location.href.endsWith('/logout'))
        {}
      else if (!this.access_token){
          console.log('No access token')
          return <Redirect to="/login" />
      }
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setErrorMsg = (msg) => {
        var errorMsg = document.getElementById('errorMsg')
        if (errorMsg){
            errorMsg.style = 'color: red'
            errorMsg.innerText = msg
        }
    }
}