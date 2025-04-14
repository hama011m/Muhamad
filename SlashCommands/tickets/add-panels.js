const { ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js');
let db;

setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);

module.exports = {
  name: 'add-panel',
  description: 'أضف بانل جديد',
  options: [
    {
      name: 'name',
      description: 'اسم البانل',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'category',
      description: 'الكتاغوري (الفئة) التي ينتمي إليها البانل',
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channelTypes: [ChannelType.GuildCategory], 
    },
    {
      name: 'style',
      description: 'نوع زر البانل',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Blue', value: 'Primary' },
        { name: 'Red', value: 'Danger' },
        { name: 'Green', value: 'Success' },
        { name: 'Gray', value: 'Secondary' },
      ],
    },
    {
      name: 'role',
      description: 'دور المستخدم للبانل',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'welcome-message',
      description: 'رسالة الترحيب للبانل',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'emoji',
      description: 'الإيموجي المستخدم مع الزر (اختياري)',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'image',
      description: 'أرفق صورة للبانل',
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
  ],

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true }); // تأجيل الرد إذا كان الأمر يستغرق وقتًا

    // تحقق من صلاحيات العضو
    if (!interaction.member || !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.editReply('ليس لديك صلاحيات كافية لتنفيذ هذا الأمر!');
      return;
    }

    const guildId = interaction.guild.id;
    const name = interaction.options.getString('name');
    const category = interaction.options.getChannel('category');
    const style = interaction.options.getString('style');
    const role = interaction.options.getRole('role');
    const welcomeMessage = interaction.options.getString('welcome-message');
    const emoji = interaction.options.getString('emoji') || null;
    const image = interaction.options.getAttachment('image') ? interaction.options.getAttachment('image').url : null;

    // تحقق إذا كان الاسم موجودًا بالفعل في قاعدة بيانات السيرفر
    const existingPanel = await db.get(`panel_${guildId}_${name}`);
    if (existingPanel) {
      const existingCategory = interaction.guild.channels.cache.get(existingPanel.category)?.name || 'غير معروف';
      await interaction.editReply(`❌ يوجد بالفعل بانل مسجل بهذا الاسم: **${name}** ضمن الفئة **${existingCategory}**.`);
      return;
    }

    // تخزين البيانات في قاعدة البيانات لكل سيرفر
    await db.set(`panel_${guildId}_${name}`, {
      name,
      category: category.id,
      style,
      role: role.id,
      welcomeMessage,
      emoji,
      image,
    });

    // الرد بعد معالجة البيانات
    await interaction.editReply(`✅ تم إضافة البانل: **${name}** بنجاح في هذا السيرفر ضمن الفئة **${category.name}**!`);
  },
};
