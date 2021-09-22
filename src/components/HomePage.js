
import React from 'react'
import axios from 'axios'
import './HomePage.css'

export class HomePage extends React.Component {
  constructor(props){
    super(props)
    var dummyData = [
      { name: 'Government graveyard',
          pinCode: 111111, occupied: 10, vacancies: 20,
          address: 'Bandivali, Mumbai rural, Maharastra, India' },
      { name: 'Hospital cemetery',
          pinCode: 111112, occupied: 12, vacancies: 30,
          address: 'Ambivali, Mumbai rural, Maharastra, India' }
    ]
    this.state = { data : dummyData || [] }
    
    this.backendURL = ''
    if (window.location.href.includes('localhost'))
        this.backendURL = 'http://localhost:5000'
    else
        this.backendURL = 'https://gyard-be.herokuapp.com'
    // this.backendURL = 'https://gyard-be.herokuapp.com'
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
  }
  componentDidMount() {
    this.getData()
  }
  render()  {
    // var data = this.state.data.data  // this is an array
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
                    <th className="address"> Address </th>
                </tr>
            </thead>
            <tbody>
            {
                this.state.data.map((key, index) => {
                    return (
                        <tr key={index}>
                            <td> {key.name} </td>
                            <td> {key.pinCode} </td>
                            <td> {key.occupied} </td>
                            <td className={key.vacancies<=5 ? 'low-vacancies' : ''}>
                                {key.vacancies}
                            </td>
                            <td className="address"> {key.address} </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
        <input type="button" value="Update data" onClick={() => {
            window.location.href = "/login"
        }} />
      </div>
    );
  }
}
