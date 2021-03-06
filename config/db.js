const mongoose = require('mongoose')
const config = require('config')
const db = config.get('MongoURI')

const connectDB = async () =>{
    try {
      await  mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true, useFindAndModify: false, })
      console.log('Happy Mongoose')
    } catch (error) {
        console.error(err.message)
            process.exit(1)
    }
}


module.exports = connectDB