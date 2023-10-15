module.exports = (message, commandTextPrefix, existingTextCommands) => {
	let commandIdentified = null

	// for Keyword Text Commands
	if (message.content.startsWith(commandTextPrefix)) existingTextCommands.forEach(cmd => {
		const prefixLength = commandTextPrefix.length;
		const commandName = message.content.slice(prefixLength).split(" ")[0];
		if ( cmd.aliases.includes(commandName) ) commandIdentified = cmd.associatedCommandName;
	});

	// for Keywordless Text Commands
	existingTextCommands.forEach(cmd => cmd.regexes.forEach(regex => {
		if (regex.test(message.content)) commandIdentified = cmd.associatedCommandName;
	}));

	// Unidentified Text Command
	return commandIdentified;
}