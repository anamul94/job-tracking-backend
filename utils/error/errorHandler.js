const AppError = require('./appError')



const handleValidationErrorDB = err => {
    console.log(err.name)
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };

const sendErrorToDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
        stack: err.stack
    })
}

const sendErrorToProd = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            msg: err.message,
    })
}
else{
    res.status(500).json({
        status: false,
        msg: "Something went wrong"
    })
}
}


const errorHandler = (err,req,res,next) =>{

    // console.log(err)
    err.statusCode = err.statusCode || 500
    err.status = false

   
    if(process.env.NODE_ENV === 'dev'){
        sendErrorToDev(err, res)
    }

   else if(process.env.NODE_ENV === 'prod'){
       
    let error = { ...err }
    error.message = err.message
    if (error.name === 'ValidationError'){
        error = handleValidationErrorDB(err);
    }   
    sendErrorToProd(error, res)
    }

}

module.exports = errorHandler
