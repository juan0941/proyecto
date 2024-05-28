const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const authenticate = require('./auth/authenticate')
require('dotenv').config();

const port = process.env.PORT || 3100;


app.use(cors());
app.use(express.json());

async function main(){
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('conectado a mongoDB')
}

main().catch(console.error);

app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/refreshToken', require('./routes/refreshToken'));
app.use('/api/signout', require('./routes/signout'));
app.use('/api/transactions',authenticate, require('./routes/transactions'));
app.use('/api/user',authenticate, require('./routes/user'));




app.get('/', (req, res) => {
    res.send('hola mundo');
});

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto: ${port}`);
});
