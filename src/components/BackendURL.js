let backendURL;

if (window.location.href.includes('localhost'))
	backendURL = 'http://localhost:5000'
else
	backendURL = 'https://gyard-be.herokuapp.com'

export default backendURL;