
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import cookie from 'react-cookies'
import './App.css'
import { HomePage } from './components/HomePage.js'
import { LoginPage, AddDataPage } from './components/LoginPage.js'

class LogoutPage extends React.Component {
  // sleep = (milliseconds) => {
  //     return new Promise(resolve => setTimeout(resolve, milliseconds))
  // }
  componentDidMount() {
    cookie.remove('access_token', { path: '/' })
    // this.sleep(500)
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
            <AddDataPage />
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

// https://gpstrackit.com/blog/cemeteries-embrace-gps-tracking-to-locate-graves-for-visitors/