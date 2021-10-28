class InvalidField extends Error {
    constructor(field) {
        super(`Invalid field ${field}`);
        this.name = 'InvalidField';
        this.errorId = 1;
        this.errorCode = 400;
    }
}

module.exports = InvalidField;
