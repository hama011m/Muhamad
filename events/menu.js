const { PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const client = require("../index");
let db;

// إعداد الاتصال بقاعدة البيانات
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);

// إنشاء صف إجراءات مع قائمة تحديد لإدارة عمليات التذاكر
const row = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId('manage-persons')
    .setPlaceholder('إدارة الأشخاص في التذكرة')
    .addOptions([
      {
        label: 'إضافة شخص',
        value: 'add_person',
        description: 'إضافة شخص آخر إلى التذكرة',
      },
      {
        label: 'إزالة شخص',
        value: 'remove_person',
        description: 'إزالة شخص من التذكرة',
      },
      {
        label: 'تغيير اسم التذكرة',
        value: 'change_name',
        description: 'تغيير اسم التذكرة',
      },
    ])
);

// مستمع الحدث للتعامل مع التفاعلات
client.on('interactionCreate', async (interaction) => {
  if (interaction.isStringSelectMenu() && interaction.customId === 'manage-persons') {
    const guildId = interaction.guild.id;
    const ticketData = await db.get(`ticket_${guildId}_${interaction.channel.id}`);

    if (!ticketData) {
      return interaction.reply({ content: 'هذه التذكرة غير موجودة أو تم إغلاقها.', ephemeral: true });
    }

    const staffRoleId = ticketData.staffRoleId;

    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'ليس لديك إذن.', ephemeral: true });
    }

    if (interaction.values[0] === 'add_person') {
      await interaction.reply({ content: 'يرجى إدخال معرف الشخص الذي تريد إضافته.', ephemeral: true });

      const filter = response => response.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

      collector.on('collect', async (msg) => {
        const memberId = msg.content;
        try {
          const member = await interaction.guild.members.fetch(memberId);

          if (member) {
            await interaction.channel.permissionOverwrites.edit(member, {
              [PermissionsBitField.Flags.ViewChannel]: true,
              [PermissionsBitField.Flags.SendMessages]: true
            });
            await interaction.followUp({ content: `تم إضافة <@${member.id}> إلى التذكرة.` });
          } else {
            await interaction.followUp({ content: 'لم يتم العثور على العضو. يرجى التحقق من معرف العضو.', ephemeral: true });
          }
        } catch (error) {
          console.error('خطأ في جلب العضو:', error);
          await interaction.followUp({ content: 'حدث خطأ أثناء جلب العضو. يرجى المحاولة لاحقًا.', ephemeral: true });
        }
      });
    } else if (interaction.values[0] === 'remove_person') {
      await interaction.reply({ content: 'يرجى إدخال معرف الشخص الذي تريد إزالته.', ephemeral: true });

      const filter = response => response.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

      collector.on('collect', async (msg) => {
        const memberId = msg.content;
        try {
          const member = await interaction.guild.members.fetch(memberId);

          if (member) {
            await interaction.channel.permissionOverwrites.delete(member);
            await interaction.followUp({ content: `تم إزالة <@${member.id}> من التذكرة.` });
          } else {
            await interaction.followUp({ content: 'لم يتم العثور على العضو. يرجى التحقق من معرف العضو.', ephemeral: true });
          }
        } catch (error) {
          console.error('خطأ في جلب العضو:', error);
          await interaction.followUp({ content: 'حدث خطأ أثناء جلب العضو. يرجى المحاولة لاحقًا.', ephemeral: true });
        }
      });
    } else if (interaction.values[0] === 'change_name') {
      await interaction.reply({ content: 'يرجى إدخال الاسم الجديد لقناة التذكرة.', ephemeral: true });

      const filter = response => response.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

      collector.on('collect', async (msg) => {
        const newName = msg.content;
        if (!newName) {
          return interaction.followUp({ content: 'لم يتم إدخال اسم. العملية تم إلغاؤها.', ephemeral: true });
        }

        try {
          await interaction.channel.setName(newName);
          await interaction.followUp({ content: `تم تحديث اسم القناة إلى: ${newName}`, ephemeral: true });
        } catch (error) {
          console.error('خطأ في تغيير اسم القناة:', error);
          await interaction.followUp({ content: 'حدث خطأ أثناء تغيير اسم القناة. يرجى المحاولة لاحقًا.', ephemeral: true });
        }
      });
    }
  }
});
