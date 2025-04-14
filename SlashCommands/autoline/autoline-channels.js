const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')

module.exports = {
name: "autoline-channels",
description: "اظهار جميع رومات الخط التلقائي",
async execute(client, interaction) {
    const autolchannels = linedb.get('autoline_rooms');
    const autolarray = autolchannels.map(channel => `<#${channel}>`).join('\n');

    const autolembed = new EmbedBuilder()
                        .setTitle("⚙️ auto line rooms")
                        .setDescription(`**${autolarray}**`);
    interaction.reply({embeds : [autolembed]})

}
}