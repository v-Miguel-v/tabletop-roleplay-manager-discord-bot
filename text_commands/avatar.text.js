module.exports = async (message, client) => {
	const user = message.mentions.users.first() || message.author;
	const embed = {
		description: `Avatar de ${user.displayName}`,
		image: {url: user.displayAvatarURL({ dynamic: true, size: 1024})}
	};
	await message.reply({embeds: [embed]});
}