const { EmbedBuilder, CommandInteraction, PermissionsBitField } = require('discord.js')
const { Database } = require('st.db');
const buydb = new Database('./json/buyrooms.json');


module.exports = {
  name: "buy-close",
  description: "اغلاق رومات البيع",
  async execute(client, interaction) {
    const buy_rooms = buydb.get('buyrooms')
    const buy_not = buydb.get("buy_not")
    const buy_not_ch = client.channels.cache.get(buy_not)
    for (const channelId of buy_rooms) {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        await channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone,
          {
            ViewChannel: false
          },
        );
      } else {
        console.log(`Channel ${channelId} not found.`);
      }
    }
    interaction.channel.send('✅ تم غلق الرومات')
    buy_not_ch.send('**@here تم غلق رومات البيع**')
  }
}