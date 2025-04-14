const { EmbedBuilder, CommandInteraction } = require('discord.js')

const {Database} = require('st.db')
const feedbackdb = new Database('./json/feedback.json')

module.exports = {
name: "feedback-set-channel",
description: "اضافة روم فيدباك ( اراء )",
"options" : [
    {
        "name" : "feedback-channel",
        "description" : "اختر الروم",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
  if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
const feedback_ch_v = interaction.options.getChannel('feedback-channel');

feedbackdb.push('feedback_rooms' , feedback_ch_v.id)
interaction.reply(`**✅ تم اضافة هذه الروم <#${feedback_ch_v.id}> **`)

}
}