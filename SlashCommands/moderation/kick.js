const { EmbedBuilder, CommandInteraction, } = require('discord.js')
module.exports = {
  name: "kick",
  description: "طرد شخص معين من السيرفر",
  "options" : [
    {
        "name" : "user",
        "description" : "اختر الشخص",
        "type" : 6,
        "required" : true
    }
  ],
  async execute(client, interaction) {
    if (interaction.member.permissions.has("0x0000000000000002")){
    const userv = interaction.options.getMember('user');
    const uservv = interaction.options.getUser('user');
    if(interaction.user.id == userv.id) return interaction.reply({content : "🙄 لا تستطيع اخراج نفسك", ephemeral:true })
    await userv.kick();
    interaction.reply(`🙋🏻‍♂️ ${uservv.tag} تم اخراجهم بنجاح.`);
    }else{
        interaction.reply({content : "🙄لاتمتلك صلاحية KICK_MEMBERS", ephemeral:true })
    } 



}
}