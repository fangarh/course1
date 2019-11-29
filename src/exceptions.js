function DevideByZeroException(message) {
    this.message = message || "division by 0";
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, DevideByZeroException);
    else
        this.stack = (new Error()).stack;
}

DevideByZeroException.prototype = Object.create(Error.prototype);
DevideByZeroException.prototype.name = "DevideByZeroException";
DevideByZeroException.prototype.constructor = DevideByZeroException;

function EmptyArrayException(message) {
    this.message = message || "empty array";
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, EmptyArrayException);
    else
        this.stack = (new Error()).stack;
}

EmptyArrayException.prototype = Object.create(Error.prototype);
EmptyArrayException.prototype.name = "EmptyArrayException";
EmptyArrayException.prototype.constructor = EmptyArrayException;

function TypeMistmatchException(message) {
    this.message = message;
    
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, TypeMistmatchException);
    else
        this.stack = (new Error()).stack;
}

TypeMistmatchException.prototype = Object.create(Error.prototype);
TypeMistmatchException.prototype.name = "TypeMistmatchException";
TypeMistmatchException.prototype.constructor = TypeMistmatchException;


export{
    DevideByZeroException, EmptyArrayException, TypeMistmatchException
}