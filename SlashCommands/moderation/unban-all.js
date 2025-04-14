const {
  EmbedBuilder,
  CommandInteraction,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "unban-all",
  description: "ازالة باند جميع المحضورين في السيرفر",
  async execute(client, interaction) {
    if (!interaction.member.permissions.has("0x0000000000000008"))
      return interaction.reply({
        content: "🙄 لا تمتلك صلاحية ADMINISTRATOR",
        ephemeral: true,
      });

    const bannedUsers = await interaction.guild.bans.fetch();
    let unbannedCount = 0;

    bannedUsers.forEach(async (banInfo) => {
      const user = banInfo.user;
      await interaction.guild.bans.remove(user);
      unbannedCount++;
    });

    interaction.reply(`✅ تم ازالة باند جميع المحضورين من السيرفر بنجاح`);
  },
};
