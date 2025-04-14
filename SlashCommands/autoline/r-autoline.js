const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')


module.exports = {
name: "autoline-r-channel",
description: "حذف روم خط تلقائي",
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
const autolchs = linedb.get("autoline_rooms");
if(autolchs.includes(line_ch_v.id)){
    const filtered = linedb.get("autoline_rooms").filter((linec) => linec != line_ch_v.id);
    linedb.set('autoline_rooms' , filtered)
    interaction.reply(`**✅ تم حذف الروم <#${line_ch_v.id}> من قاعدة البيانات**`)
}else {
    interaction.reply( {content : `🫤 <#${line_ch_v.id}> هذه الروم ليست روم خط تلقائي`, ephemeral:true })
}


}
}