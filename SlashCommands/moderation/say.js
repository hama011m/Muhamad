const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
  name: "say",
  description: "قول شي ...",
  "options" : [
    {
        "name" : "message",
        "description" : "الرسالة",
        "type" : 3,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000002000")){
      const messagev = interaction.options.getString('message');
    
      await interaction.channel.send(messagev)
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية MANAGE_MESSAGES", ephemeral:true })
      } 


}
}