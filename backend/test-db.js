const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/stockpredictor';

console.log(`🔍 Testing connection to: ${uri}`);

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Success! MongoDB is reachable.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed!');
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Code: ${err.code || 'None'}`);
    console.error(`Error Message: ${err.message}`);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: MongoDB service might not be running. Run "Services.msc" and start "MongoDB", or run "docker-compose up -d mongo".');
    } else if (err.message.includes('queryTxt ETIMEOUT')) {
      console.log('\n💡 Tip: If using Atlas, check your internet connection and IP whitelist.');
    } else if (uri.includes('localhost')) {
      console.log('\n💡 Tip: Try changing "localhost" to "127.0.0.1" in your .env file.');
    }
    
    process.exit(1);
  });
