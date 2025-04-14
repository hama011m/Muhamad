const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
  name: "ban",
  description: "باند لشخص معين",
  "options" : [
    {
        "name" : "user",
        "description" : "اختر الشخص",
        "type" : 6,
        "required" : true
    },
    {
        "name" : "reason",
        "description" : "اختر السبب",
        "type" : 3,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000000004")){
      const userv = interaction.options.getUser('user');
      const reasonv = interaction.options.getString('reason');
    
      if(interaction.user.id == userv.id) return interaction.reply({content : "🙄 لا تستطيع تبنيد نفسك", ephemeral:true })
      await interaction.guild.members.ban(userv, { reasonv });
      interaction.reply(`✈️تم تبنيده بنجاح ${userv.tag}. **السبب:** ${reasonv}`);
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية \`BAN_MEMBERS\`", ephemeral:true })
      } 


}
}