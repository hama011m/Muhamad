const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const suggdb = new Database('./json/suggestion.json')


module.exports = {
name: "suggestion-r-channel",
description: "حذف روم اقتراحات",
"options" : [
    {
        "name" : "suggestion-channel",
        "description" : "اختر روم الاقتراحات",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR z", ephemeral:true });
const suggestion_ch_v = interaction.options.getChannel('suggestion-channel');
const suggchs = suggdb.get("suggestion_rooms");
if(suggchs.includes(suggestion_ch_v.id)){
    const filtered = suggdb.get("suggestion_rooms").filter((suggc) => suggc != suggestion_ch_v.id);
    suggdb.set('suggestion_rooms' , filtered)
    interaction.reply(`**✅ تم حذف هذه الروم <#${suggestion_ch_v.id}> من قاعدة البيانات**`)
}else {
    interaction.reply( {content : `🫤 <#${suggestion_ch_v.id}> هذه الروم ليست روم اقتراحات`, ephemeral:true })
}


}
}