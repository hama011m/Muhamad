const client = require("../index");
const {
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require('discord.js');

let db;

// إعداد الاتصال بقاعدة البيانات
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  const guildId = interaction.guild.id;

  if (customId.startsWith('open_ticket_')) {
    const panelName = customId.replace(`open_ticket_${guildId}_`, '');
    const panelEntry = await db.get(`panel_${guildId}_${panelName}`);

    if (!panelEntry || !panelEntry.name || !panelEntry.category || !panelEntry.role) {
      return interaction.reply({ content: 'اللوحة غير موجودة أو إعداداتها غير مكتملة.', ephemeral: true });
    }

    const category = await interaction.guild.channels.fetch(panelEntry.category).catch(() => null);
    if (!category) {
      return interaction.reply({ content: 'تعذر العثور على فئة التذاكر. يرجى التحقق من الإعدادات.', ephemeral: true });
    }

    const existingTicketId = await db.get(`user_ticket_${guildId}_${interaction.user.id}`);
    if (existingTicketId) {
      const existingChannel = await interaction.guild.channels.fetch(existingTicketId).catch(() => null);
      if (existingChannel) {
        return interaction.reply({
          content: `لديك تذكرة مفتوحة بالفعل: ${existingChannel}. يرجى إغلاقها قبل إنشاء تذكرة جديدة.`,
          ephemeral: true
        });
      } else {
        await db.delete(`user_ticket_${guildId}_${interaction.user.id}`);
      }
    }

    const staffRoleId = panelEntry.role;
    const ticketCountKey = `ticket_count_${guildId}`;
    let ticketNumber = await db.get(ticketCountKey) || 1;
    await db.set(ticketCountKey, ticketNumber + 1);

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${ticketNumber}`,
      type: ChannelType.GuildText,
      parent: category,
      topic: `OwnerID:${interaction.user.id}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: staffRoleId,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
      ],
    });

    await db.set(`ticket_${guildId}_${ticketChannel.id}`, {
      ownerId: interaction.user.id,
      channelId: ticketChannel.id,
      staffRoleId: staffRoleId,
    });

    await db.set(`user_ticket_${guildId}_${interaction.user.id}`, ticketChannel.id);

    const embedBeforeClaim = new EmbedBuilder()
      .setTitle(`مرحبًا بك في - ${panelEntry.name}`)
      .setDescription(panelEntry.welcomeMessage || 'مرحبًا بك في تذكرتك.')
      .setColor('Blue');

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('claim-ticket')
        .setLabel('ادعاء التذكرة')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('ticket_close')
        .setLabel('إغلاق التذكرة')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('call-support')
        .setLabel('نداء للدعم')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('call-ticket-owner')
        .setLabel('نداء لمالك التذكرة')
        .setStyle(ButtonStyle.Primary)
    );

    const selectMenuRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('manage-persons')
        .setPlaceholder('إدارة الأشخاص في التذكرة (فقط للموظفين)')
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

    await ticketChannel.send({
      content: `- <@${interaction.user.id}> & <@&${staffRoleId}>`,
      embeds: [embedBeforeClaim],
      components: [actionRow, selectMenuRow],
    });

    await interaction.reply({ content: `تم إنشاء التذكرة في القناة ${ticketChannel}`, ephemeral: true });
  }

  if (customId === 'claim-ticket') {
    const ticketData = await db.get(`ticket_${guildId}_${interaction.channel.id}`);
    if (!ticketData || !ticketData.staffRoleId) {
      return interaction.reply({ content: 'تعذر العثور على بيانات التذكرة.', ephemeral: true });
    }

    if (!interaction.member.roles.cache.has(ticketData.staffRoleId)) {
      return interaction.reply({ content: 'ليس لديك إذن.', ephemeral: true });
    }

    const staffUser = interaction.user;
    await db.add(`points_${guildId}_${staffUser.id}`, 1);
    const topic = interaction.channel.topic;
    const ticketOwnerId = topic.match(/OwnerID:(\d+)/)?.[1];

    const embedAfterClaim = new EmbedBuilder()
      .setDescription(`**تم الإدعاء بواسطة: ${staffUser}**`)
      .setColor('White');

    await interaction.update({
      content: `<@${ticketOwnerId}> & <@${staffUser.id}>`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('claim-ticket')
            .setLabel(`تم الإدعاء بواسطة: ${staffUser.username}`)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('إغلاق التذكرة')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('call-support')
            .setLabel('نداء للدعم')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('call-ticket-owner')
            .setLabel('نداء لمالك التذكرة')
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });

    await interaction.channel.send({ embeds: [embedAfterClaim] });
  }

  if (customId === 'ticket_close') {
    let countdown = 5;
    const countdownMessage = await interaction.channel.send(`سيتم إغلاق التذكرة خلال ${countdown} ثانية.`);
    const interval = setInterval(async () => {
      if (countdown > 0) {
        countdown--;
        await countdownMessage.edit({ content: `سيتم إغلاق التذكرة خلال ${countdown} ثانية.` });
      } else {
        clearInterval(interval);
        await interaction.channel.delete();
        await db.delete(`ticket_${guildId}_${interaction.channel.id}`);
        await db.delete(`user_ticket_${guildId}_${interaction.user.id}`);
      }
    }, 1000);
  }

  if (customId === 'call-ticket-owner') {
    const topic = interaction.channel.topic;
    const ticketOwnerId = topic.match(/OwnerID:(\d+)/)?.[1];
    if (ticketOwnerId) {
      const owner = await interaction.guild.members.fetch(ticketOwnerId).catch(() => null);
      if (owner) {
        await owner.send(`تم مناشدتك لدعمك في تذكرتك: ${interaction.channel.toString()}`);
        await interaction.reply({ content: 'تم إعلام مالك التذكرة.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'تعذر العثور على مالك التذكرة.', ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'هذه التذكرة غير موجودة أو تم إغلاقها.', ephemeral: true });
    }
  }

  if (customId === 'call-support') {
    const ticketData = await db.get(`ticket_${guildId}_${interaction.channel.id}`);
    if (!ticketData || !ticketData.staffRoleId) {
      return interaction.reply({ content: 'تعذر العثور على بيانات التذكرة.', ephemeral: true });
    }

    const staffRole = await interaction.guild.roles.fetch(ticketData.staffRoleId).catch(() => null);
    if (!staffRole) {
      return interaction.reply({ content: 'تعذر العثور على رتبة الدعم.', ephemeral: true });
    }

    await interaction.channel.send({ content: `<@&${staffRole.id}>` });
    await interaction.reply({ content: 'تم إعلام الدعم في التذكرة.', ephemeral: true });
  }
});
