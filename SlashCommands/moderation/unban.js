const { EmbedBuilder, CommandInteraction ,  PermissionsBitField} = require('discord.js')

module.exports = {
  name: "unban",
  description: "ازالة باند شخص معين",
  "options" : [
    {
        "name" : "user",
        "description" : "اختر العضو",
        "type" : 6,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000000004")){
      const userv = interaction.options.getUser('user');
      const reasonv = interaction.options.getString('reason');
      if(interaction.user.id == userv.id) return interaction.reply({content : "🙄 لا تستطيع ازالة باند لنفسك", ephemeral:true })
      await interaction.guild.members.unban(userv);
      interaction.reply(`✅ تم ازالة الباند ${userv.tag}.`);
      }else{
          interaction.reply({content : "🙄 لا تمتلك صلاحية BAN_MEMBERS", ephemeral:true })
      } 

}
}