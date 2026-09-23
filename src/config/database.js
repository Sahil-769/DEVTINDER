const dns = require('node:dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://sahilalvi769_db_user:TDZ1jNh2s815YvbE@namastedev.svgun7p.mongodb.net/devTinder"
    );
}

module.exports={connectDB};