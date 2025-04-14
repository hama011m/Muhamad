const { EmbedBuilder, CommandInteraction , PermissionsBitField } = require('discord.js')

module.exports = {
  name: "show-all",
  description: "show all channels in the server",
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000000008")){
        const guild = interaction.guild;
        guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.set([
            {
              id: interaction.channel.guild.roles.everyone,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ]);
        });
  
        await interaction.reply(`✅ تم اظهار جميع الرومات`);
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR", ephemeral:true })
      } 

}
}