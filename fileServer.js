const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();


app.use(cors());
app.use(morgan('combined'));


app.use(express.static('public\\uploads'));

app.listen(8000, () => {
  console.log('CORS-enabled web server PDF listening on port 8000');
});
