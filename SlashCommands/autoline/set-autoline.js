const { EmbedBuilder, CommandInteraction } = require('discord.js')

const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')

module.exports = {
name: "autoline-set-channel",
description: "لاظافة روم خط تلقائي",
"options" : [
    {
        "name" : "auto-line-channel",
        "description" : "اختر الروم",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
  if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
const line_ch_v = interaction.options.getChannel('auto-line-channel');

linedb.push('autoline_rooms' , line_ch_v.id)
interaction.reply(`**✅ تم اظافة هذه الروم <#${line_ch_v.id}> الى رومات الخط التلقائي**`)

}
}