const { EmbedBuilder, CommandInteraction } = require('discord.js')

const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')

module.exports = {
name: "set-line",
description: "لاختيار الخط التلقائي",
"options" : [
    {
        "name" : "line",
        "description" : "ضع رابط الخط التلقائي",
        "type" : 3,
        "required" : true
    }
  ],
async execute(client, interaction) {
  if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
const line_ch_v = interaction.options.getString('line');

linedb.set('autoline' , line_ch_v)
interaction.reply(`**✅ تم تعيين هذا الخط** <#${line_ch_v}> **كخط تلقائي**`)

}
}