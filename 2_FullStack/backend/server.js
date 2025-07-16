import express from 'express'
const app = express();
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//      res.send("Sever is ready");
// })

app.get('/api/hi', (req, res)=>{
     const x = [
          {
               id : 1,
               name : "hi1", 
               content : "Hi Number 1"
          },
                   {
               id : 2,
               name : "hi2", 
               content : "Hi Number 2"
          },
                   {
               id : 3,
               name : "hi3", 
               content : "Hi Number 3"
          },
                   {
               id : 4,
               name : "hi4", 
               content : "Hi Number 4"
          }
     ]
     res.send(x);
})

app.listen(port, () => {
     console.log(`Connect of port : ${port}`)
})