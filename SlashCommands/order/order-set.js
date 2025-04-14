const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder} = require('discord.js')
const { Database } = require("st.db");
const orderdb = new Database("./json/order.json");

module.exports = {
name: "order-set",
description: "اعداد نظام الطلبات في السيرفر",
"options" : [
    {
        "name" : "send_order_channel",
        "description" : "روم ارسال الطلبات",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "design_orders_room",
        "description" : "روم تلقي طلبات التصاميم",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "prog_orders_room",
        "description" : "روم تلقي طلبات البرمجيات",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "product_orders_room",
        "description" : "روم تلقي طلبات المنتجات",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "order_role",
        "description" : "رتبة اشعارات الطلبات",
        "type" : 8,
        "required" : true
    },
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄 لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
    // =============== Options Values =============== //
    const send_order_v = interaction.options.getChannel("send_order_channel")

    const design_orders_v = interaction.options.getChannel("design_orders_room")
    const prog_orders_v = interaction.options.getChannel("prog_orders_room")
    const product_orders_v = interaction.options.getChannel("product_orders_room")

    const order_role = interaction.options.getRole("order_role")

    // =============== Stting Values in DB =============== //
    await orderdb.set("send_order_room",`${send_order_v.id}`);
    await orderdb.set("design_orders_room",`${design_orders_v.id}`);
    await orderdb.set("prog_orders_room",`${prog_orders_v.id}`);
    await orderdb.set("product_orders_room",`${product_orders_v.id}`);
    await orderdb.set("order_role",`${order_role.id}`);

    await interaction.reply('✅ تمت العملية بنجاح')

}
}
