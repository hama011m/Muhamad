const { Client, Collection } = require("discord.js");

const config = require("./json/config.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const colors = require("colors");
const { tax } = require("discord-probot-transfer");

const client = new Client({
  intents: 131071,
});

//nodejs-events
process.on("unhandledRejection", (e) => {
  console.log(e);
});
process.on("uncaughtException", (e) => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.log(e);
});

//=================================== SLASH COMMAND ===============================//

module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
["commands", "events", "slash"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const commands = client.slashCommands.map(({ execute, ...data }) => data);
// Register slash commands
const rest = new REST({ version: "10" }).setToken(
  config.token || process.env.token
);
rest
  .put(Routes.applicationCommands(config.clientID), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
//=================================== SLASH COMMAND ===============================//

//============================= MESSAGE WHEN MENTION BOT =======================//
client.on("messageCreate", (message) => {
  if (message.content == `<@${client.user.id}>`) {
    message.reply(`hi I am \`${client.user.tag}\` My prefix is \`/\``);
  }
});
//============================= MESSAGE WHEN MENTION BOT =======================//

//================================== WELCOME ==================================//
const { Database } = require("st.db");
const wlcmdb = new Database("./json/welcome.json");
client.on("guildMemberAdd", async (member) => {
  const wlcmchannelid = await wlcmdb.get("wlcm_channel");
  const wlcmembed = new EmbedBuilder()
    .setTitle(
      `**${member.user.username} Welcome to server \`${member.guild.name}\`**`
    )
    .setDescription(
      `
                        ### > 🪪 Member ID : \`${member.id}\`
                        ### > 👤 Member Username : \`${member.user.username}\`
                        ### > ✨ MemberCount : \`${member.guild.memberCount}\`
                        ### > Don't forget to read rules 💗
                        ## Enjoy 🌹
                        `
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setImage(wlcmdb.get("wlcm_img"));

  const channel = member.guild.channels.cache.get(wlcmchannelid);
  await channel.send({ content: `<@${member.id}>`, embeds: [wlcmembed] });
  await channel.send(wlcmdb.get("wlcm_line"));
});

//================================== WELCOME ==================================//

//================================= ORDER SYSTEM ==============================//
client.on("messageCreate", async (message) => {
  const orderdb = new Database("./json/order.json");
  const order_channel_id = orderdb.get("send_order_room");

  if (message.channelId == order_channel_id) {
    if (message.author.bot) return;
    const ordermsg = message.content;

    // =================== Create Initial Order Embed ===================== //
    const orderembed = new EmbedBuilder().setTitle(
      `**🛒 طلب جديد من قبل ${message.author.tag}**`
    ).setDescription(`
        ## **الطلب** : ${ordermsg}
        ### ماهو نوع طلبك ؟
        \`\`\` قم باختيار الرياكت المناسب لنوع الطلب \`\`\`
        🎨 تصاميم
        🤖 برمجيات
        📦 منتجات
      `);

    // Send the initial order embed
    message.delete();
    message.channel
      .send({ content: `<@${message.author.id}>`, embeds: [orderembed] })
      .then(async (msg) => {
        await msg.react("🎨");
        await msg.react("🤖");
        await msg.react("📦");
      });

    lastMessage = message;
  }
});

//================================= ORDER SYSTEM ==============================//

//================================== REACTION ORDER SYSTEM ===========================//

// =================== reaction System ===================== //
client.on("messageReactionAdd", async (reaction, user) => {
  const orderdb = new Database("./json/order.json");
  // Ignore bot reactions and only consider the reactions to the message sent by the bot
  if (user.bot || !reaction.message.guild) return;
  if (reaction.message.channelId !== orderdb.get("send_order_room")) return;

  const message = lastMessage;

  // Create individual embeds based on the reaction
  if (reaction.emoji.name === "🎨") {
    // design ORDER
    setTimeout(() => {
      reaction.message.delete();
    }, 500);
    const or_desi = await reaction.message.channel.send(
      `**✅ <@${message.author.id}> تم ارسال طلبك بنجاح**`
    );
    setTimeout(() => {
      or_desi.delete();
    }, 500);
    const design_room = client.channels.cache.get(
      orderdb.get("design_orders_room")
    );
    const design_or_embed = new EmbedBuilder().setTitle(
      `**🛒 طلب جديد من قبل ${message.author.tag}**`
    ).setDescription(`
            ## **الطلب** : 
            ## \`\`\`${lastMessage}\`\`\`
            تواصل مع <@${message.author.id}>
          `);
    design_room.send({
      content: `<@&${orderdb.get("order_role")}>`,
      embeds: [design_or_embed],
    });
  } else if (reaction.emoji.name === "🤖") {
    // programming ORDER
    setTimeout(() => {
      reaction.message.delete();
    }, 500);
    const or_prog = await reaction.message.channel.send(
      `**✅ <@${message.author.id}> تم ارسال طلبك بنجاح**`
    );
    setTimeout(() => {
      or_prog.delete();
    }, 500);
    const prog_room = client.channels.cache.get(
      orderdb.get("prog_orders_room")
    );
    const prog_or_embed = new EmbedBuilder().setTitle(
      `**🛒 طلب جديد من قبل ${message.author.tag}**`
    ).setDescription(`
            ## **الطلب** : 
            ## \`\`\`${lastMessage}\`\`\`
            تواصل مع <@${message.author.id}>
          `);
    prog_room.send({
      content: `<@&${orderdb.get("order_role")}>`,
      embeds: [prog_or_embed],
    });
  } else if (reaction.emoji.name === "📦") {
    // reaction.message.delete();
    // PRODUCTS ORDER
    setTimeout(() => {
      reaction.message.delete();
    }, 500);
    const or_pro = await reaction.message.channel.send(
      `**✅ <@${message.author.id}> تم ارسال طلبك بنجاح**`
    );
    setTimeout(() => {
      or_pro.delete();
    }, 500);
    const product_room = client.channels.cache.get(
      orderdb.get("product_orders_room")
    );
    const product_or_embed = new EmbedBuilder().setTitle(
      `**🛒 طلب جديد من قبل ${message.author.tag}**`
    ).setDescription(`
            ## **الطلب** : 
            ## \`\`\`${lastMessage}\`\`\`
            تواصل مع <@${message.author.id}>
          `);
    product_room.send({
      content: `<@&${orderdb.get("order_role")}>`,
      embeds: [product_or_embed],
    });
  }
});

//================================== REACTION ORDER SYSTEM ===========================//


//================ 💻 تستطيع وضع اي كود تريده هنا =================//
//=================== الاصدار : 14 =========================//




//=================== وضع اي كود تريده هنا ==============//

//============= Auto Kill / Client Login =======================//
setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill");
    process.kill(1);
  } else {
    console.log("Client Login");
  }
}, 3 * 1000 * 60);

setTimeout(() => {
  process.kill(1);
  console.log("Client Login");
}, 22 * 10000 * 60);

client.login(config.token || process.env.token).catch((err) => {
  console.log(err.message);
});
//================= Auto Kill / Client Login ===================//
