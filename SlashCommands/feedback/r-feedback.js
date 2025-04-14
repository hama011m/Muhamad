const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const feedbackdb = new Database('./json/feedback.json')


module.exports = {
name: "feedback-r-channel",
description: "remove feedback channel",
"options" : [
    {
        "name" : "feedback-channel",
        "description" : "choice the feedback channel",
        "type" : 7,
        "required" : true
    }
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية Administrator", ephemeral:true });
const feedback_ch_v = interaction.options.getChannel('feedback-channel');
const feedchs = feedbackdb.get("feedback_rooms");
if(feedchs.includes(feedback_ch_v.id)){
    const filtered = feedbackdb.get("feedback_rooms").filter((feedc) => feedc != feedback_ch_v.id);
    feedbackdb.set('feedback_rooms' , filtered)
    interaction.reply(`**✅ تم حذف هذه الروم <#${feedback_ch_v.id}> من قاعدة البيانات**`)
}else {
    interaction.reply( {content : `🫤 <#${feedback_ch_v.id}> هذه الروم ليست روم فيدباك`, ephemeral:true })
}


}
}