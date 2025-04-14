const { EmbedBuilder, CommandInteraction , PermissionsBitField} = require('discord.js')

module.exports = {
  name: "unlock",
  description: "unlock this room",
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000000010")){
      interaction.channel.permissionOverwrites.set([
        {
          id: interaction.channel.guild.roles.everyone,
          allow: [PermissionsBitField.Flags.SendMessages],
        },
      ]);

    interaction.reply(`🔓 تم فتح الروم.`);
      }else{
          interaction.reply({content : "🙄 لا تمتلك صلاحية MANAGE_CHANNELS", ephemeral:true })
      } 

}
}