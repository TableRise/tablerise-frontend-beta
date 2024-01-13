import axios from 'axios';

export default axios.create({
    baseURL: 'http://127.0.0.1:3001/profile',
    timeout: 1000,
    headers: {'access-key': 'secret'}
});
