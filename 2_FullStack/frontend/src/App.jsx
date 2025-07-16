import axios from 'axios';
import { useEffect, useState } from 'react'

function App() {

  const [hi, sethi] = useState([]);
  useEffect(()=> {
      axios.get('/api/hi')
      .then((response)=>{
        sethi(response.data);
      })
      .catch((error) =>{
        console.log(error);
      })
  })


  return (
    <div>
      <h1>Hello World</h1>
      <p>Hi : {hi.length}</p>

      {
        hi.map((i) => (
            <div key={i.id} className=''>
              <h3> name : {i.name}</h3>
              <p> content : {i.content}</p>
            </div>
        ))
      }
    </div>
  )
}

export default App
