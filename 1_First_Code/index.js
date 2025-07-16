const express = require("express")

const app = express();
const port = 3000;

app.get('/', (req,res) => {
     res.send("Hello World")
})
app.get('/hi', (req,res) => {
     res.send("hi World")
})

app.listen(port, ()=> {
     console.log(`You are at port : ${port},`)
})