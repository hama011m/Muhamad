const { EmbedBuilder, CommandInteraction } = require('discord.js')
const { tax } = require('discord-probot-transfer');

const {Database} = require('st.db')
const taxdb = new Database('./json/tax.json')

module.exports = {
name: "tax-r-channel",
description: "حذف روم الضريبة التلقائية",
"options" : [
    {
        "name" : "auto-tax-channel",
        "description" : "اختيار روم الضريبة التلقائية",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
const tax_ch_v = interaction.options.getChannel('auto-tax-channel');
const taxchs = taxdb.get("tax_rooms");
if(taxchs.includes(tax_ch_v.id)){
    const filtered = taxdb.get("tax_rooms").filter((taxc) => taxc != tax_ch_v.id);
    taxdb.set('tax_rooms' , filtered)
    interaction.reply(`**✅ تم حذف هذه الروم <#${tax_ch_v.id}> من قاعدة البيانات بنجاح**`)
}else {
    interaction.reply( {content : `🫤 <#${tax_ch_v.id}> هذه الروم ليست روم ضريبة`, ephemeral:true })
}


}
}