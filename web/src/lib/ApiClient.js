import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

const fetchStaticRooms = async () => {
    return await client.get('/staticrooms');
}

export default {
    fetchStaticRooms
}