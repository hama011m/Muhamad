const { EmbedBuilder, CommandInteraction , PermissionsBitField } = require('discord.js')

module.exports = {
  name: "lock",
  description: "غلق الروم",
  async execute(client, interaction) {
    if (interaction.member.permissions.has("0x0000000000000010")){
      interaction.channel.permissionOverwrites.set([
        {
          id: interaction.channel.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.SendMessages],
        },
      ]);

    interaction.reply(`🔒 تم اغلاق هذه الروم بنجاح.`);
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية MANAGE_CHANNELS", ephemeral:true })
      } 

}
}