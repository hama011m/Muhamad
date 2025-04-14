const { EmbedBuilder, CommandInteraction , ButtonBuilder , ActionRowBuilder , ButtonStyle} = require('discord.js')

module.exports = {
name: "reply-add",
description: "اضافة رد تلقائي",
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
    const reply_btn = new ButtonBuilder()
                            .setCustomId('btn_reply_id')
                            .setLabel('رد تلقائي')
                            .setEmoji('💬')
                            .setStyle(ButtonStyle.Primary)
    const reply_row = new ActionRowBuilder()
                            .addComponents(reply_btn)

    interaction.reply({content : '**اضغط على الزر لاضافة رد تلقائي**' ,components : [reply_row] });

}
}