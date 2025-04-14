const { EmbedBuilder } = require('discord.js');
const { QuickDB, JSONDriver } = require("quick.db");
let db;

// إعداد اتصال قاعدة البيانات
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);

module.exports = {
  name: "points",
  description: "عرض نقاط المستخدم.",
  type: 1, // تعيين النوع إلى CHAT_INPUT
  options: [
    {
      name: 'user',
      type: 6, // النوع 6 يشير إلى USER
      description: 'اختر مستخدم لعرض نقاطه (افتراضيًا يعرض نقاطك)',
      required: false, // جعل هذا الخيار اختياري
    },
  ],

  execute: async (client, interaction) => {
    // الحصول على المستخدم المحدد في الخيارات أو الافتراضي (المستخدم الذي نفذ الأمر)
    const user = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;
    const points = await db.get(`points_${guildId}_${user.id}`) || 0;
      
          const ticketdata = await db.get(`ticket_${guildId}_${interaction.channel.id}`);

        const staffRole = await interaction.guild.roles.fetch(ticketdata.staffRoleId);

    // التحقق إذا كان المستخدم الذي نفذ الأمر لديه صلاحية مشاهدة النقاط
    if (staffRole && !interaction.member.roles.cache.has(staffRole)) {
      return interaction.reply({ content: 'ليس لديك إذن لعرض النقاط.', ephemeral: true });
    }

    // الحصول على معلومات التذكرة إذا كانت موجودة للمستخدم
    const ticketId = await db.get(`user_ticket_${guildId}_${user.id}`);
    let ticketInfo = 'لم يتم العثور على تذكرة مفتوحة لهذا المستخدم';

    if (ticketId) {
      const ticketData = await db.get(`ticket_${guildId}_${ticketId}`);
      if (ticketData) {
        ticketInfo = `معلومات التذكرة: ID - ${ticketData.channelId}, مالك التذكرة - <@${ticketData.ownerId}>`;
      }
    }

    // إنشاء Embed لعرض النقاط ومعلومات التذكرة
    const pointsEmbed = new EmbedBuilder()
      .setTitle('نقاط المستخدم')
      .setColor('#0099ff')
      .addFields(
        { name: 'المستخدم', value: `${user}`, inline: true },
        { name: 'النقاط', value: `${points}`, inline: true }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    await interaction.reply({ embeds: [pointsEmbed] });
  },
};
