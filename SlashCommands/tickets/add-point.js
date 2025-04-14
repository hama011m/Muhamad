const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB, JSONDriver } = require("quick.db");
let db = "nigger"; 
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");

  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 1000);

module.exports = {
  name: "add-point",
  description: "إضافة نقطة إلى المستخدم.",
  type: 1, // تعيين النوع إلى CHAT_INPUT

  options: [
    {
      type: 6, // نوع الخيار (مستخدم)
      name: 'user',
      description: 'المستخدم الذي تريد إضافة النقاط له',
      required: true,
    },
    {
      type: 4, // نوع الخيار (عدد صحيح)
      name: 'amount',
      description: 'عدد النقاط التي تريد إضافتها',
      required: true,
    },
  ],

  execute: async (client, interaction) => {
    // الحصول على المستخدم وعدد النقاط
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const guildId = interaction.guild.id;
    const ticketChannel = interaction.channel;

    // استرجاع معلومات التذكرة من قاعدة البيانات
    const ticketData = await db.get(`ticket_${guildId}_${ticketChannel.id}`);
    if (!ticketData) {
      return interaction.reply({ content: 'هذه القناة لا تمثل تذكرة صالحة.', ephemeral: true });
    }

    // التحقق إذا كان العضو لديه صلاحية إضافة النقاط
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'ليس لديك إذن لإضافة النقاط.', ephemeral: true });
    }

    // التحقق من أن العدد المدخل صحيح
    if (amount <= 0) {
      return interaction.reply({ content: 'يرجى تقديم عدد صحيح أكبر من صفر.', ephemeral: true });
    }

    try {
      // الحصول على النقاط الحالية للمستخدم أو تعيينها كـ 0 إذا كانت فارغة
      const currentPoints = await db.get(`points_${guildId}_${user.id}`) || 0;

      // تحديث النقاط في قاعدة البيانات
      await db.set(`points_${guildId}_${user.id}`, currentPoints + amount);

      // إنشاء Embed لإخطار المستخدم بإضافة النقاط بنجاح
      const embed = new EmbedBuilder()
        .setTitle('تم تحديث النقاط')
        .setDescription(`تم إضافة ${amount} نقطة إلى ${user.username}. الآن لديهم ${currentPoints + amount} نقطة.`)
        .setColor('#00FF00') // اللون الأخضر للدلالة على النجاح
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      // إرسال الرد
      await interaction.reply({ embeds: [embed], ephemeral: true });

      console.log(`[تحديث النقاط] المستخدم: ${user.username}, النقاط المضافة: ${amount}, إجمالي النقاط: ${currentPoints + amount}`);
    } catch (error) {
      console.error('خطأ أثناء إضافة النقاط:', error);
      return interaction.reply({ content: 'حدث خطأ أثناء إضافة النقاط. يرجى المحاولة مرة أخرى لاحقاً.', ephemeral: true });
    }
  },
};
