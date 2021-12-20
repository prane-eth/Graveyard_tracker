import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import { HomePage, GetBookedSlots, GetTicket } from './components/HomePage.js'
import { LoginPage, ChangePassword, LogoutPage } from './components/LoginPage.js'
import { UpdateData } from './components/UpdateData.js'
import { BookSlot } from './components/BookSlot.js'


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
          <Route path="/changePassword">
            <ChangePassword />
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