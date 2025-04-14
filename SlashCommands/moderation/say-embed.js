const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
  name: "say-embed",
  description: "كتابة شي في ايمبد ... ",
  "options" : [
    {
        "name" : "message",
        "description" : "الرسالة التي ستكتبها في الايمبد",
        "type" : 3,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000002000")){
      const messagev = interaction.options.getString('message');
      
      const msgembed = new EmbedBuilder()
                          .setDescription(`## ${messagev}`)

      await interaction.channel.send({embeds : [msgembed]})
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية MANAGE_MESSAGES", ephemeral:true })
      } 


}
}