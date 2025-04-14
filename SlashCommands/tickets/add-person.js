const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB, JSONDriver } = require("quick.db");
let db = "nigger"; 
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");

  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 1000);

module.exports = {
  name: "add-person",
  description: "إضافة شخص إلى التذكرة.",
  type: 1, // تعيين النوع إلى CHAT_INPUT
  options: [
    {
      name: 'user',
      description: 'حدد الشخص الذي تريد إضافته إلى التذكرة',
      type: 6, // نوع الخيار (6 يعني مستخدم)
      required: true, // تأكيد أن هذا الخيار مطلوب
    }
  ],

  execute: async (client, interaction) => {
    const ticketChannel = interaction.channel;
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;

    // استرجاع معلومات التذكرة من قاعدة البيانات
    const ticketData = await db.get(`ticket_${guildId}_${ticketChannel.id}`);
    if (!ticketData) {
      return interaction.reply({ content: 'هذه القناة لا تمثل تذكرة صالحة.', ephemeral: true });
    }

    const staffRoleId = ticketData.staffRoleId;

    // التحقق إذا كان العضو لديه الدور المطلوب
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'ليس لديك إذن لإضافة شخص إلى التذكرة.', ephemeral: true });
    }

    // التحقق إذا كان الشخص الذي يتم إضافته هو صاحب التذكرة
    if (interaction.user.id === user.id) {
      return interaction.reply({ content: 'لا يمكنك إضافة نفسك إلى التذكرة.', ephemeral: true });
    }

    // التأكد من أن الشخص غير مضاف بالفعل إلى التذكرة
    const permissions = ticketChannel.permissionOverwrites.get(user.id);
    if (permissions && permissions.allow.has(PermissionsBitField.Flags.ViewChannel)) {
      return interaction.reply({ content: `${user} هو بالفعل عضو في هذه التذكرة.`, ephemeral: true });
    }

    try {
      // إضافة الأذونات للمستخدم في القناة
      await ticketChannel.permissionOverwrites.edit(user.id, {
        [PermissionsBitField.Flags.ViewChannel]: true,
        [PermissionsBitField.Flags.SendMessages]: true,
        [PermissionsBitField.Flags.ReadMessageHistory]: true,
      });

      // إنشاء Embed لإخطار المستخدم بإضافة الشخص بنجاح
      const embed = new EmbedBuilder()
        .setTitle('تم إضافة شخص إلى التذكرة')
        .setDescription(`تم إضافة ${user.username} إلى التذكرة بنجاح.`)
        .setColor('#00FF00') // اللون الأخضر للدلالة على النجاح
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      // إرسال الرد
      await interaction.reply({ embeds: [embed], ephemeral: true });

      console.log(`[تحديث التذكرة] تم إضافة المستخدم: ${user.username} إلى التذكرة في القناة: ${ticketChannel.name}`);
    } catch (error) {
      console.error('خطأ أثناء إضافة المستخدم إلى التذكرة:', error);
      return interaction.reply({ content: 'حدث خطأ أثناء إضافة المستخدم إلى التذكرة. يرجى المحاولة مرة أخرى لاحقاً.', ephemeral: true });
    }
  },
};
