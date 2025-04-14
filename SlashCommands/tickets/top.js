const { EmbedBuilder } = require('discord.js');
let db;

// Set up database connection
setInterval(() => {
  const { QuickDB, JSONDriver } = require("quick.db");
  const jsonDriver = new JSONDriver();
  db = new QuickDB({ driver: jsonDriver });
}, 2000);

module.exports = {
  name: "top-points",
  description: "لعرض أفضل 10 مستخدمين في السيرفر حسب النقاط.",
  type: 1, // تعيين النوع إلى CHAT_INPUT
  botperms: ["EMBED_LINKS"],

  execute: async (client, interaction) => {
const ticketdata = await db.get(`ticket_${guildId}_${interaction.channel.id}`);

        const staffRole = await interaction.guild.roles.fetch(ticketdata.staffRoleId);
    if (!interaction.member.roles.cache.has(staffRole)) {
      return interaction.reply({ content: 'ليس لديك صلاحيات.', ephemeral: true });
    }
    let guildId = interaction.guild.id;
    let userPoints = [];

    // الحصول على جميع المفاتيح في قاعدة البيانات
    const keys = await db.all();

    // تصفية المفاتيح التي تتبع تنسيق النقاط الخاص بالسيرفر الحالي
    keys.forEach(key => {
      if (key.id.startsWith(`points_${guildId}_`)) {
        const userId = key.id.split('_')[2]; // استخراج userId من المفتاح
        const points = key.value;

        // إضافة النقاط إلى المصفوفة فقط إذا كانت أكبر من الصفر
        if (points > 0) {
          userPoints.push({
            userID: userId,
            points: points,
          });
        }
      }
    });

    // إذا لم يكن هناك نقاط مسجلة
    if (userPoints.length === 0) {
      return interaction.reply({ content: "> **لم يتم تسجيل أي نقاط في هذا السيرفر بعد.**" });
    }

    // ترتيب النقاط من الأعلى إلى الأقل
    let sorted = userPoints
      .sort((a, b) => b.points - a.points)
      .map((c, i) => {
        let rankEmoji = '';
        let userDisplay = `<@!${c.userID}> [\`${c.points}\`]`;

        if (i === 0) {
          rankEmoji = '🥇';
        } else if (i === 1) {
          rankEmoji = '🥈';
        } else if (i === 2) {
          rankEmoji = '🥉';
        }

        // إذا لم يكن هناك إيموجي، أضف مسافة لتنظيم المحاذاة
        if (rankEmoji) {
          return `${rankEmoji} ${userDisplay}`;
        } else {
          // استخدام مسافة إضافية لجعل الكلمة في نفس المحاذاة
          return `    #${i + 1} ${userDisplay}`;
        }
      });

    // تقسيم النتائج إلى أجزاء إذا كانت كثيرة لعرضها في Embed واحد
    const chunkSize = 10;
    let chunks = [];
    for (let i = 0; i < sorted.length; i += chunkSize) {
      chunks.push(sorted.slice(i, i + chunkSize));
    }

    // إرسال الرد في أكثر من Embed إذا لزم الأمر
    for (let i = 0; i < chunks.length; i++) {
      let embed = new EmbedBuilder()
        .setAuthor({ name: `أفضل إدارة في سيرفر ${interaction.guild.name}` })
        .setDescription(`**${chunks[i].join("\n")}**`)
        .setColor("#0099ff")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 })) // إضافة صورة السيرفر كـ thumbnail
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      // إرسال الرد مع التحقق من إمكانية إرساله في عدة رسائل إذا لزم الأمر
      if (i === 0) {
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.followUp({ embeds: [embed] });
      }
    }
  }
};
