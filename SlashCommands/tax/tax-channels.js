const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const taxdb = new Database('./json/tax.json')

module.exports = {
name: "tax-channels",
description: "اظهار رومات الضريبة",
async execute(client, interaction) {
    const taxchannels = taxdb.get('tax_rooms');
    const taxarray = taxchannels.map(channel => `<#${channel}>`).join('\n');

    const taxembed = new EmbedBuilder()
                        .setTitle("💴 auto tax rooms")
                        .setDescription(`**${taxarray}**`);
    interaction.reply({embeds : [taxembed]})

}
}