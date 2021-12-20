import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { FaSearchLocation } from 'react-icons/fa'
import { RiAccountPinCircleFill } from 'react-icons/ri'
import './HomePage.css'

export class NavBar extends React.Component {
    getLoginButton = () => {
      let access_token = cookie.load('access_token')
      if (access_token)
          return (
              <div>
                  <a href="/bookSlot"> Book a slot </a>
                  <a href="/getBookedSlots"> Get booked slots </a>
                  <a href="/addData"> Update data </a>
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
    hideUpdateButton = async () => {
      var url = this.backendURL + '/isAdmin?access_token=' + this.access_token
      axios.get(url)
          .then(res => {
              console.log(res.data.status)
              if (res.data.status) {
                  console.log('Admin')
              } else {
                  var updateBtn = document.getElementById('updateBtn')
                  if (updateBtn)
                      updateBtn.style.display = 'none'
              }
          })
    }
    // after rendering
    componentDidUpdate() {
        this.hideUpdateButton()
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
                        placeholder="Search for graveyard" onInput={this.updateTable} />
                    <FaSearchLocation class="icon" id="searchIcon" />
                </div> : null}
        </div>)
    }
}