
import React from 'react'
import axios from 'axios'
import './HomePage.css'

export class HomePage extends React.Component {
  constructor(props){
    super(props)
    var dummyData = {
      error: [],
      data: [
        {name: 'Government graveyard',
            pinCode: 111111, occupied: 10, vacancies: 20,
            address: 'Bandivali, Mumbai rural, Maharastra, India'},
        {name: 'Hospital cemetery',
            pinCode: 111112, occupied: 12, vacancies: 30,
            address: 'Ambivali, Mumbai rural, Maharastra, India'},
        {name: 'Municipal Corporation graveyard',
            pinCode: 111113, occupied: 30, vacancies: 5,
            address: 'Andheri, Mumbai rural, Maharastra, India'},
        {name: 'NGO cemetery',
            pinCode: 111114, occupied: 10, vacancies: 20,
            address: 'Irapuram, Trivendrum rural, Kerala, India'}
      ]
    }
    this.state = { data : dummyData || {} }
    this.backendURL = 'http://localhost:5000'
    // this.backendURL = 'https://gyard-be.herokuapp.com'
  }
  updateData = async () => {
    var response = await axios.get(this.backendURL + '/getData/')
    if (!response)
        console.log('No response from server')
    else if ('error' in response && response.error)
        console.log('response has errors')
    else {
        this.setState({ data : response.data })
    }
  }
  componentDidMount() {

  }
  render()  {
    // var data = this.state.data.data  // this is an arra
    return (
      <div className="App">
        <header className="App-header">
          <h1> Welcome to Graveyard vacancy tracking system </h1>
          <h5> A useful website during COVID times </h5>
        </header>
        <table>
            <thead>
                <tr>
                    <th> Name </th>
                    <th> Pin Code </th>
                    <th> Occupied </th>
                    <th> Vacancies </th>
                    <th> Address </th>
                </tr>
            </thead>
            <tbody>
            {
                this.state.data.data.map((key, index) => {
                    return (
                        <tr key={index}>
                            <td> {key.name} </td>
                            <td> {key.pinCode} </td>
                            <td> {key.occupied} </td>
                            <td className={key.vacancies<=5 ? 'low-vacancies' : ''}>
                                {key.vacancies}
                            </td>
                            <td> {key.address} </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
      </div>
    );
  }
}
