
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import { HomePage } from './components/HomePage.js'
import { LoginPage, AddDataPage } from './components/LoginPage.js'

class LogoutPage extends React.Component {
  // sleep = (milliseconds) => {
  //     return new Promise(resolve => setTimeout(resolve, milliseconds))
  // }
  componentDidMount() {
    // cookie.remove('pageId', { path: '/' })
    // console.log("Removed cookie. Logged out")
    // this.setState({ fbDetails: false })  // after logout
    // this.sleep(500)
  }
  render() {
    window.location.href = "/" 
    return <p> Logging out... </p>
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