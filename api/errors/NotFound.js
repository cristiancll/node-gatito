class NotFound extends Error {
    constructor() {
        super('Not found');
        this.name = "NotFound";
        this.errorId = 0;
        this.errorCode = 404;
    }
}
module.exports = NotFound;
