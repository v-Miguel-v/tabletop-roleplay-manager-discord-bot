const executePingCommand = require("./ping.text");
module.exports = async (message, client) => { await executePingCommand(message, client) }