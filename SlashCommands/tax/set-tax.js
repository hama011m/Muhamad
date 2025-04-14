const { EmbedBuilder, CommandInteraction } = require('discord.js')
const { tax } = require('discord-probot-transfer');

const {Database} = require('st.db')
const taxdb = new Database('./json/tax.json')

module.exports = {
name: "tax-set-channel",
description: "اضافة روم ضريبة تلقائية",
"options" : [
    {
        "name" : "auto-tax-channel",
        "description" : "اختار روم الضريبة التلقائية",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
  if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
const tax_ch_v = interaction.options.getChannel('auto-tax-channel');

taxdb.push('tax_rooms' , tax_ch_v.id)
interaction.reply(`**✅ تم اضافة هذه الروم <#${tax_ch_v.id}> الى قاعدة البيانات**`)

}
}