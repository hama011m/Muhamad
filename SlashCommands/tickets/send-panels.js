const { ApplicationCommandOptionType, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType } = require('discord.js');
let db;

setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 1000);

module.exports = {
  name: 'send-panels',
  description: 'إرسال جميع البانلز مع الأزرار إلى قناة محددة',
  options: [
    {
      name: 'title',
      description: 'عنوان الإيمبد',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'description',
      description: 'وصف الإيمبد',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'channel',
      description: 'الروم الي يرسل فيها تكتات',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'image',
      description: 'صورة للإيمبد',
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
    {
      name: 'color',
      description: 'لون الإيمبد (HEX)',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  async execute(client, interaction) {
    if (!interaction.member || !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply('ليس لديك صلاحيات كافية لتنفيذ هذا الأمر!');
    }

    const guildId = interaction.guild.id;
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const image = interaction.options.getAttachment('image');
    const color = interaction.options.getString('color');
    const channel = interaction.options.getChannel('channel');

    // التحقق من صحة اللون (يجب أن يكون HEX)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return interaction.reply('الرجاء ادخل Hex صحيح');
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color || '#000000');

    if (image) {
      embed.setImage(image.url);
    }

    // جلب جميع البانلز المرتبطة بالسيرفر الحالي
    const panels = (await db.all()) || []; // التأكد من أن db.all() ترجع مصفوفة حتى لو كانت فارغة
    const filteredPanels = panels.filter(entry => entry.id.startsWith(`panel_${guildId}_`));

    if (filteredPanels.length === 0) {
      return interaction.reply('لا توجد أي بانلز مسجلة لهذا السيرفر. الرجاء إضافة بانلز باستخدام أمر /add-panel.');
    }

    // إنشاء الأزرار بناءً على جميع البانلز
    const actionRows = [];
    let currentRow = new ActionRowBuilder();

    filteredPanels.forEach(panelEntry => {
      const panelData = panelEntry.value; // الوصول إلى القيمة داخل panelEntry

      // التحقق من النمط وتعيين النمط الصحيح
const buttonStyle = {
  'DANGER': ButtonStyle.Danger,
  'PRIMARY': ButtonStyle.Primary,
  'SUCCESS': ButtonStyle.Success,
  'SECONDARY': ButtonStyle.Secondary,
}[panelData.style?.toUpperCase()] || ButtonStyle.Primary;

// طباعة النمط المستخدم
console.log(`Button style selected: ${panelData.style?.toUpperCase() || 'لا يوجد'}`);

      const button = new ButtonBuilder()
        .setLabel(panelData.name)
        .setStyle(buttonStyle)
        .setCustomId(`open_ticket_${guildId}_${panelData.name}`);

      if (panelData.emoji) {
        button.setEmoji(panelData.emoji);
      }

      currentRow.addComponents(button);

      // إذا كان الصف ممتلئًا (5 أزرار كحد أقصى لكل صف)
      if (currentRow.components.length === 5) {
        actionRows.push(currentRow);
        currentRow = new ActionRowBuilder();
      }
    });

    // إضافة الصف الأخير إذا كان يحتوي على أزرار
    if (currentRow.components.length > 0) {
      actionRows.push(currentRow);
    }

    // التحقق من وجود أزرار
    if (actionRows.length === 0) {
      return interaction.reply('لا توجد أزرار مسجلة في أي بانل لهذا السيرفر.');
    }

    // إرسال الإيمبد مع الأزرار
    await channel.send({
      embeds: [embed],
      components: actionRows,
    });

    await interaction.reply(`تم إرسال جميع الأزرار المسجلة في البانلز لهذا السيرفر إلى القناة ${channel}`);
  },
};
