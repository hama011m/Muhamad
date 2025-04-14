const { EmbedBuilder, CommandInteraction, } = require('discord.js')
const ms = require("ms")
module.exports = {
  name: "timeout",
  description: "تايم اوت عضو معين",
  "options" : [
    {
        "name" : "user",
        "description" : "اختر العضو",
        "type" : 6,
        "required" : true
    },
    {
        "name" : "duration",
        "description" : "اختر المدة (1h / 7d / 1w ...)",
        "type" : 3,
        "required" : true
    }
  ],
  async execute(client, interaction) {
    if (interaction.member.permissions.has("0x0000010000000000")){
    const userv = interaction.options.getMember('user');
    const uservv = interaction.options.getUser('user');
    const durv = interaction.options.getString('duration');
    if(interaction.user.id == userv.id) return interaction.reply({content : "🙄 لا تستطيع تايم اوت نفسك", ephemeral:true })
    if(uservv.bot) return interaction.reply({content : "🙄 لا تستطيع تايم اوت بوت", ephemeral:true })
    await userv.timeout(ms(durv));
    interaction.reply(`✅ ${uservv.tag} timeouted Successfully.`);
    }else{
        interaction.reply({content : "🙄لا تمتلك صلاحية TIME_OUT_MEMBERS", ephemeral:true })
    } 



}
}