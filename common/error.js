class CustomError {
    constructor(status, message){
        this.errorMessage = message
        this.errorCode = status
    }
    static get statusCodeBadRequest(){
        return 400;
    }
    static get statusCodeNotFound(){
        return 404;
    }
    static get statusCodeNotUnauthorized(){
        return 401;
    }
    static get statusCodeForbidden(){
        return 403;
    }
    static get errorOccurred(){
        return 500;
    }
    static get success(){
        return 200;
    }
}


module.exports = CustomError