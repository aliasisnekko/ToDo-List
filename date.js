exports.getDate = function() {

    let today = new Date(); // Some vanilla JS,  instead of placing this in our app.js we're making it a function elsewhere and returning it
    let options = { weekday: 'long', day: 'numeric', month: 'long' };
    return today.toLocaleDateString("en-US", options);

}
exports.getDay = function() {
    let today = new Date();
    let options = {
        weekday: 'long'
    };
    return today.toLocaleDateString("en-US", options);
}