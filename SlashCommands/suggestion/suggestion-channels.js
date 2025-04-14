const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const suggdb = new Database('./json/suggestion.json')

module.exports = {
name: "suggestion-channels",
description: "اظهار جميع رومات الاقتراحات",
async execute(client, interaction) {
    const suggchannels = suggdb.get('suggestion_rooms');
    const suggarray = suggchannels.map(channel => `<#${channel}>`).join('\n');

    const suggembed = new EmbedBuilder()
                        .setTitle("🤔 suggestion rooms")
                        .setDescription(`**${suggarray}**`);
    interaction.reply({embeds : [suggembed]})

}
}