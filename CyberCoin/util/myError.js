const extError = require('es6-error');

class myError extends ExtandableError {
  constructor(message, context, original) {

    super(message);

    if (context) this.context = context;
    if (original) this.original = original;
  }

  toJSON() {
    const{message,type,stack,context,original} = this;
    return Object.assign({message,type,stack,context,original}, this);
  }

}

modules.export = myError; 
