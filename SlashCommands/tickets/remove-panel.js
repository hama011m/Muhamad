const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
let db = "nigger" 
setInterval(()  =>{
const { QuickDB, JSONDriver } = require("quick.db");

const jsonDriver = new JSONDriver();
 db = new QuickDB({ driver: jsonDriver });
}, 1000)
module.exports = {
    name: 'remove-panel',
    description: 'حذف بانل بناءً على الاسم',
    options: [
        {
            name: 'name',
            description: 'اسم البانل الذي ترغب في حذفه',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
  async execute(client, interaction) {
if (!interaction.member || !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply('ليس لديك صلاحيات كافية لتنفيذ هذا الأمر!');
}


        const panelName = interaction.options.getString('name');
        const guildId = interaction.guild.id; // معرف السيرفر الحالي

        // التحقق من وجود البانل في قاعدة البيانات
        const panelData = db.get(`panel_${guildId}_${panelName}`);
        if (!panelData) {
            return interaction.reply(`لا يوجد بانل بهذا الاسم: **${panelName}** في هذا السيرفر.`);
        }

        // حذف البانل من قاعدة البيانات
        db.delete(`panel_${guildId}_${panelName}`);

        await interaction.reply(`تم حذف البانل: **${panelName}** بنجاح!`);
    },
};
