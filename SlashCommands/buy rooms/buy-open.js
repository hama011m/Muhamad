const { EmbedBuilder, CommandInteraction, PermissionsBitField } = require('discord.js')
const { Database } = require('st.db');
const buydb = new Database('./json/buyrooms.json');


module.exports = {
  name: "buy-open",
  description: "اظهار رومات البيع",
  async execute(client, interaction) {
    const buy_rooms = buydb.get('buyrooms')
    const buy_not = buydb.get("buy_not")
    const buy_not_ch = client.channels.cache.get(buy_not)
    for (const channelId of buy_rooms) {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        await channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone,
          {
            ViewChannel: true
          },
        );
      } else {
        console.log(`Channel ${channelId} not found.`);
      }
    }
    interaction.reply('✅ تم اظهار الرومات')
    buy_not_ch.send('**@here تم فتح رومات البيع**')
  }
}