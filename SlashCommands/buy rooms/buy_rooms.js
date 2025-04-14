const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const buydb = new Database('./json/buyrooms.json')

module.exports = {
name: "buy-channels",
description: "اظهار جميع رومات البيع",
async execute(client, interaction) {
    const buychannels = buydb.get('buyrooms');
    const buyarray = buychannels.map(channel => `<#${channel}>`).join('\n');

    const buyembed = new EmbedBuilder()
                        .setTitle("🛒 buy rooms")
                        .setDescription(`**${buyarray}**`);
    interaction.reply({embeds : [buyembed]})

}
}