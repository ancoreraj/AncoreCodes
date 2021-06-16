const express = require('express');
const mongoose = require('mongoose');
const indexRouter =  require('./routes/index');
const methodOverride =  require('method-override');
const path = require('path')
const dotenv = require('dotenv')
const app = express();

dotenv.config({ path: './config.env' })

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true ,useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: false}))

app.use(methodOverride('_method'))

app.use('/',indexRouter); 


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`App is listening to port ${PORT}`)
})
