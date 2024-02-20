const { config } = require('dotenv')
const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user:"postgres",
    port:3030,
    password:"12345",
    database:"voyawealthmanagement"
})

client.connect()



