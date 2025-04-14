const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
  name: "change-nickname",
  description:"تغيير الاسم المستعار لعضو معين",
  "options" : [
    {
        "name" : "user",
        "description" : "اختر العضو",
        "type" : 6,
        "required" : true
    },
    {
        "name" : "nickname",
        "description" : "اختر الاسم المستعار",
        "type" : 3,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000008000000")){
      const memberv = interaction.options.getMember('user');
      const userv = interaction.options.getUser('user');
      const nicknamev = interaction.options.getString('nickname');
    
      await memberv.setNickname(nicknamev);
      interaction.reply(`✅ تم تغيير لقب ${userv.username} الى \`${nicknamev}\``);
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية MANAGE_NICKNAMES", ephemeral:true })
      } 


}
}