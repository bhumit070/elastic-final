import axios from 'axios'


const _axios = axios.create({
	baseURL: 'http://localhost:4000/'
})

export default _axios