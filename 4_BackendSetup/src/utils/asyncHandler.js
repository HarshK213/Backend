/*

here, we are just creating a wrapper for async function, that can be of two types like using PROMISE or TRY-CATCH, 
we will write both for example.

we will use async-Promise OR async-Try-Catch many times, so for not writing so much code multiple times we have created this wrapper

const asyncHandler = () => {}
const asyncHandler = () => { () => {} }
const asyncHandler = () => { async() => {} }
const asyncHandler = () => async() => {}

*/

/*

TRY-CATCH

const asyncHandler = (func) => async(req, res, next) => {
     try{
          await func(req, res, next);
     }
     catch(error){
          res.status(err.code || 500).json({
               success : false,
               message : err.message
          })
     }     
}

*/

// PROMISE

const asyncHandler = (func) => {
     return (req, res, next) => {
          Promise.resolve(
               func(req, res, next)
          ).catch((err)=>{
               next(err)
          })
     }
}

export default asyncHandler;