const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const replydb = new Database('./json/reply.json')


module.exports = {
name: "reply-r",
description: "لحذف رد تلقائي معين",
"options" : [
    {
        "name" : "reply-id",
        "description" : "اكتب ايدي الرد التلقائي",
        "type" : 4,
        "required" : true
    }
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
const reply_id_v = interaction.options.getInteger('reply-id');
if(replydb.has(`${reply_id_v}`)){
    replydb.delete(`${reply_id_v}`)
    interaction.reply(`**✅ تم حذف ايدي الرد \`${reply_id_v}\` من قاعدة البيانات**`)
}else {
    interaction.reply( {content : `🫤 ${reply_id_v} هذا الرد غير موجود`, ephemeral:true })
}

}
}