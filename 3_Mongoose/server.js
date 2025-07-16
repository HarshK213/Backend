import express from 'express'

const app = express();
const port = 3000;

app.get('/hi',(req,res) => {
     res.send("Server is ready");
})
app.listen(port, () => {
     console.log(`Server is ready at port ${port}`);
})