module.exports = async (interaction) => {
	const value = interaction.values[0];
	await interaction.update({ content: `Se ha seleccionado la opción ${value}`, components: [] });
}