function Result (success, message, payload) {
    this.update(success, message, payload);
}
Result.prototype.update = function (success, message, payload) {
    this.success = success;
    this.message = message;
    this.payload = payload;
}

module.exports = {
    Result
}