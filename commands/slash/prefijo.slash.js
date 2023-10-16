const fs = require("node:fs");
const { getTextCommandPrefix } = require("./../../utils/textCommandTools");
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prefijo")
		.setDescription("Cambiar o Mostrar el prefijo actual usado para escribir los comandos de texto del bot.")
		.addStringOption(option => option
			.setName("nuevo-prefijo")
			.setDescription("Si no envías este parámetro, simplemente se mostrará el prefijo actual del bot.")
			.setRequired(false)
		),

	async execute(interaction, client) {
		const oldPrefix = getTextCommandPrefix(interaction.guild.id);
		const newPrefix = interaction.options.getString("nuevo-prefijo");
		const newPrefixEmbed = new EmbedBuilder({ description: `El **Nuevo Prefijo** para los comandos de texto es: **\`${newPrefix}\`**\n_> Ejemplos: \`${newPrefix}test\`, \`${newPrefix}ping\`, \`${newPrefix}avatar\`, \`${newPrefix}crear-ficha\`_` });
		const currentPrefixEmbed = new EmbedBuilder({ description: `El **Prefijo Actual** de los comandos de texto es: **\`${oldPrefix}\`**\n_> Ejemplos: \`${oldPrefix}test\`, \`${oldPrefix}ping\`, \`${oldPrefix}avatar\`, \`${oldPrefix}crear-ficha\`_` });
		const permissionDeniedEmbed = new EmbedBuilder({ description: `Necesitas permisos de **Administrador** para poder cambiar el prefijo del bot.` });

		if (!newPrefix) {
			await interaction.reply({ embeds: [currentPrefixEmbed] });
		} else {
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				await interaction.reply({ embeds: [permissionDeniedEmbed] });
			}
			else {
				const guildId = interaction.guild.id;
				const prefixesFolderPath = "./local_database/guilds_prefixes";
				fs.writeFileSync(`${prefixesFolderPath}/${guildId}`, newPrefix);
				await interaction.reply({ embeds: [newPrefixEmbed] });
			}
		}
	}
}