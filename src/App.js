import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import cookie from 'react-cookies'
import axios from 'axios'
import './App.css'
import { HomePage, GetBookedSlots, GetTicket } from './components/HomePage.js'
import { LoginPage } from './components/LoginPage.js'
import { UpdateData } from './components/UpdateData.js'
import { BookSlot, CancelSlot } from './components/BookSlot.js'

class LogoutPage extends React.Component {
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
  }
  render() {
    window.location.href = "/"
    return <p className="loggingOut"> Logging out... </p>
  }
}

function App()  {
  return (
    <Router>
      <header>
        <main>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/addData">
            <UpdateData />
          </Route>
          <Route path="/bookSlot">
            <BookSlot />
          </Route>
          <Route path="/getBookedSlots">
            <GetBookedSlots />
          </Route>
          <Route path="/getTicket">
            <GetTicket />
          </Route>
          <Route path="/cancelSlot">
            <CancelSlot />
          </Route>
          <Route path="/logout">
            <LogoutPage />
          </Route>
        </main>
      </header>
    </Router>
  )
}

export default App;