class InvalidContentType extends Error {
    constructor(contentType) {
        super(`Invalid Content-Type ${contentType}`);
        this.name = "InvalidContentType";
        this.errorId = 3;
        this.errorCode = 406;
    }

}
module.exports = InvalidContentType;
