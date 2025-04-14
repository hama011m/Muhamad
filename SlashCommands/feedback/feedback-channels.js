const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const feedbackdb = new Database('./json/feedback.json')

module.exports = {
name: "feedback-channels",
description: "اظهار جميع رومات الفيدباك ( الاراء )",
async execute(client, interaction) {
    const feedchannels = feedbackdb.get('feedback_rooms');
    const feedarray = feedchannels.map(channel => `<#${channel}>`).join('\n');

    const feedembed = new EmbedBuilder()
                        .setTitle("🌟 feedback rooms")
                        .setDescription(`**${feedarray}**`);
    interaction.reply({embeds : [feedembed]})

}
}