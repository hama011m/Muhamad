const { ModalBuilder } = require("@discordjs/builders");
const client = require("../index");
const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder, Client, Integration , TextInputBuilder , TextInputStyle} = require('discord.js')
const {Database} = require('st.db');
const replydb = new Database('./json/reply.json')


// ============== random number function ===============
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

client.on('interactionCreate' , (interaction) => {
    if(interaction.customId == "btn_reply_id"){
        const replymodal = new ModalBuilder()
                                .setCustomId(`reply_modal_${interaction.user.id}`)
                                .setTitle('اضافة رد تلقائي')
        const command_input = new TextInputBuilder()
                                .setCustomId("command_input_id")
                                .setLabel("الامر")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`قم بكتابة امر الرد`)
                                .setRequired(true);
        const reply_input = new TextInputBuilder()
                                .setCustomId("reply_input_id")
                                .setLabel("الرد")
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder(`قم بكتابة رد الامر`)
                                .setRequired(true);
        const replyrow1 = new ActionRowBuilder()
                                .addComponents(command_input);
        const replyrow2 = new ActionRowBuilder()
                                .addComponents(reply_input);
        replymodal.addComponents(replyrow1,replyrow2);
        interaction.showModal(replymodal).catch(console.error);
    }
    
})


client.on('interactionCreate' , async (interaction) => {
    if(interaction.customId == `reply_modal_${interaction.user.id}`){
        
        interaction.editReply({
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 1,
                    label: 'رد تلقائي',
                    emoji: '💬',
                    custom_id: "btn_reply_id_disa",
                    disabled: true,
                  },
                ],
              },
            ],
          });
        const command_v = await interaction.fields.getTextInputValue('command_input_id')
        const reply_v = await interaction.fields.getTextInputValue('reply_input_id')
        const replyid = getRandomInt(10000000,9999999999)
        await replydb.set(`${replyid}` , {
            "replyid" : replyid,
            "command" : command_v,
            "reply" : reply_v
        }
            )
        await interaction.reply(`
        ✅ **تم اضافة الرد التلقائي**
        # الامر : \`${command_v}\`
        \`#\` الرد : \`${reply_v}\`

        `)
    }
})