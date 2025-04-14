const { EmbedBuilder, CommandInteraction } = require('discord.js')

const {Database} = require('st.db')
const suggdb = new Database('./json/suggestion.json')

module.exports = {
name: "suggestion-set-channel",
description: "اضافة روم اقتراحات",
"options" : [
    {
        "name" : "suggestion-channel",
        "description" : "اختار روم الاقتراحات",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
  if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
const suggestion_ch_v = interaction.options.getChannel('suggestion-channel');

suggdb.push('suggestion_rooms' , suggestion_ch_v.id)
interaction.reply(`**✅ تم اضافة هذه الروم <#${suggestion_ch_v.id}> ال قادعة البيانات بنجاح**`)

}
}