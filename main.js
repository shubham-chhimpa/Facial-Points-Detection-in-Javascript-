
const express = require('express')
const app = express()
const port =  process.env.PORT || 5000

app.use(express.static('public'))



app.get('/', (req, res) => res.send('Hello Wrld!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))