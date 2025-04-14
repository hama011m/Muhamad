const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB, JSONDriver } = require("quick.db");
let db;

// Set up database connection
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);
module.exports = {
  name: "remove-person",
  description: "إزالة شخص من التذكرة.",
  type: 1, // تعيين النوع إلى CHAT_INPUT

  execute: async (client, interaction) => {
    const ticketChannel = interaction.channel;
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id.toString(); // تحويل إلى string لتجنب BigInt

    // جلب معلومات التذكرة من قاعدة البيانات
    const ticketData = await db.get(`ticket_${guildId}_${ticketChannel.id.toString()}`); // تحويل إلى string
    if (!ticketData) {
      return interaction.reply({ content: 'هذه القناة لا تمثل تذكرة صالحة.', ephemeral: true });
    }

    const staffRoleId = ticketData.staffRoleId;

    // التحقق من أن العضو لديه الدور المطلوب
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'ليس لديك إذن لإزالة شخص من التذكرة.', ephemeral: true });
    }

    // التحقق مما إذا كان المستخدم هو مالك التذكرة
    if (interaction.user.id === user.id) {
      return interaction.reply({ content: 'لا يمكنك إزالة نفسك من التذكرة.', ephemeral: true });
    }

    // إزالة الأذونات للمستخدم في القناة
    await ticketChannel.permissionOverwrites.delete(user.id);

    // إنشاء رسالة لإعلام المستخدم بنجاح العملية
    const embed = new EmbedBuilder()
      .setTitle('تم إزالة شخص من التذكرة')
      .setDescription(`تم إزالة ${user.username} من التذكرة بنجاح.`)
      .setColor('#FF0000') // لون التنبيه
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    // إرسال الرد
    await interaction.reply({ embeds: [embed], ephemeral: true });

    console.log(`[Ticket Update] User removed: ${user.username} from ticket in channel: ${ticketChannel.name}`);
  },
};
