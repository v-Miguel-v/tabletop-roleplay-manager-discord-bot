const fs = require("node:fs");

module.exports = {
	identifyTextCommand(message, commandTextPrefix, existingTextCommands) {
		let commandIdentified = null

		// for Keyword Text Commands
		if (message.content.startsWith(commandTextPrefix)) existingTextCommands.forEach(cmd => {
			const prefixLength = commandTextPrefix.length;
			const commandName = message.content.slice(prefixLength).split(" ")[0];
			if ( cmd.aliases.includes(commandName) ) {
				commandIdentified = cmd.associatedCommandName;
			} else {

				// for Keywordless Text Commands + Prefix
				cmd.regexesWithPrefix.forEach(regex => {
					const command = message.content.slice(prefixLength);
					if (regex.test(command)) commandIdentified = cmd.associatedCommandName;
				});
			}
		});

		// for Keywordless Text Commands (with no Prefix)
		existingTextCommands.forEach(cmd => cmd.regexes.forEach(regex => {
			if (regex.test(message.content)) commandIdentified = cmd.associatedCommandName;
		}));

		// Unidentified Text Command
		return commandIdentified;
	},

	getTextCommandPrefix(guildId) {
		const defaultPrefix = "!";
		const path = "./local_database/guilds_prefixes";
		const guildsPrefixes = fs.readdirSync(path);

		if (!guildsPrefixes.includes(guildId)) {
			return defaultPrefix;
		}
		else {
			const guildPrefix = fs.readFileSync(`${path}/${guildId}`, "utf-8");
			return guildPrefix;
		}
	},

	removePrefixAndKeywordsFromMessage(prefix, keywords, originalMessage) {
		let messageWithoutPrefixAndKeywords = null;

		if (originalMessage.content.startsWith(prefix)) {
			const messageWithoutPrefix = originalMessage.content.slice(prefix.length);
			keywords.forEach(keyword => {
				if (messageWithoutPrefix.startsWith(`${keyword} `))
					messageWithoutPrefixAndKeywords = messageWithoutPrefix.slice(keyword.length).trim();
			});
			if (!messageWithoutPrefixAndKeywords) messageWithoutPrefixAndKeywords = messageWithoutPrefix;
		} else {
			messageWithoutPrefixAndKeywords = originalMessage.content;
		}

		return messageWithoutPrefixAndKeywords;
	}
}