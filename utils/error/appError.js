class AppError extends Error {
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode
        //this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'server side error'
        this.status = false
        this.message = message
        this.isOperational = true
    }
   
}

module.exports = AppError