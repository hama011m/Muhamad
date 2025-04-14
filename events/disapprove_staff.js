const client = require("../index");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ActionRowBuilder, Client, Integration, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js')
const { Database } = require("st.db");
const staffdb = new Database("./json/staff-apply.json");

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId == "staff_apply_disa_id") {
    const mstaff_disapprove = new ModalBuilder()
      .setCustomId("modal_disapprove")
      .setTitle("رفض المقدمين للادارة");
    const staff_disa_uid = new TextInputBuilder()
      .setCustomId("staff_disa_uid")
      .setLabel("ايدي الاداري")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`ايدي الاداري الذي تم رفضه`)
      .setRequired(true);
    const staff_disa_reason = new TextInputBuilder()
      .setCustomId("staff_disa_reason")
      .setLabel("السبب")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(`سبب / اسباب رفض الاداري`)
      .setRequired(true);
    const staff_disa_row1 = new ActionRowBuilder().addComponents(staff_disa_uid);
    const staff_disa_row2 = new ActionRowBuilder().addComponents(staff_disa_reason);
    mstaff_disapprove.addComponents(staff_disa_row1, staff_disa_row2);
    await interaction.showModal(mstaff_disapprove).catch(console.error);
  }
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId == "modal_disapprove") {
    interaction.update({
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4,
              label: `تم رفضه من قبل ${interaction.user.tag}`,
              custom_id: "disa_btn_inta",
              disabled: true,
            },
          ],
        },
      ],
    });
    let staff_uid_v = interaction.fields.getTextInputValue("staff_disa_uid");
    let staff_reason_v = interaction.fields.getTextInputValue("staff_disa_reason");
    const staff_member = interaction.guild.members.cache.get(staff_uid_v);
    staff_member.send(`نأسف تم رفضك كاداري \n > السبب : ${staff_reason_v}`)
    interaction.channel.send(`❌ تم رفض <@${staff_uid_v}> كاداري \n من قبل <@${interaction.user.id}>`)

    const disaembed = new EmbedBuilder()
      .setDescription(`## ❌ ناسف تم رفضك كاداري بسبب ${staff_reason_v}`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
    client.channels.cache.get(staffdb.get('staff_result')).send({ content: `<@${staff_uid_v}>`, embeds: [disaembed] });

  }
})