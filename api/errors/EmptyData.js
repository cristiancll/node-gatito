class EmptyData extends Error {
    constructor() {
        super("Data was not received");
        this.name = "EmptyData";
        this.errorId = 2;
        this.errorCode = 400;
    }

}
module.exports = EmptyData;
