const client = require("../index");
const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder, Client, Integration} = require('discord.js')
const { Database } = require("st.db");
const staffdb = new Database("./json/staff-apply.json");

client.on("interactionCreate" ,async (interaction) => {
    if(interaction.customId == "staff_apply_id"){
        try {
          if(staffdb.get('staff_status') == 0) return interaction.reply({content : `**❌ | عذرا التقديم على الادارة مغلق الان <@${interaction.user.id}>**` , ephemeral : true})
          const submits = staffdb.get('staff_submits');
          const uid = interaction.user.id;
          if(submits.includes(uid)) return interaction.reply({content : `**❌ | عذرا لقد قدمت بالفعل <@${uid}>**` , ephemeral : true})
          staffdb.push('staff_submits' , interaction.user.id)
            interaction.reply({
                content : `** <@${interaction.user.id}> تم بدا العملية تفقد رسائلك الشخصية **`,
                ephemeral : true,
            });
            const dmChannel = await interaction.user.createDM();
      
            const questions = [
              `# ${staffdb.get('question1')}`, // 0
              `# ${staffdb.get('question2')}`, // 1
              `# ${staffdb.get('question3')}`, // 2
              `# ${staffdb.get('question4')}`, // 3
              `# ${staffdb.get('question5')}`, // 4
            ];
      
            const answers = [];
      
            for (const question of questions) {
              await dmChannel.send(question);
      
              const filter = (response) => response.author.id === interaction.user.id;
              const collected = await dmChannel.awaitMessages({
                filter,
                max: 1,
                time: 300000,
              });
      
              if (collected.size === 0) {
                return dmChannel.send(
                  `لم يتم الاجابة على هذا السؤال ${question}\nتم الغاء تقديم الادارة`
                );
              }
      
              answers.push(collected.first().content);
            }
      
            // Send the answers to the specific channel
            const specificChannel = client.channels.cache.get(staffdb.get('submissions_room'));
            if (specificChannel) {
              const embed = new EmbedBuilder()
                .setTitle(`تقديم للادارة من قبل ${interaction.user.tag}`)
                .setDescription(`\`\`\`${interaction.user.id}\`\`\``)
                .addFields(
                  {
                    name: `${staffdb.get('question1')}`,
                    value: `${answers[0]}`,
                  },
                  {
                    name: `${staffdb.get('question2')}`,
                    value: `${answers[1]}`,
                  },
                  {
                    name: `${staffdb.get('question3')}`,
                    value: `${answers[2]}`,
                  },
                  {
                    name: `${staffdb.get('question4')}`,
                    value: `${answers[3]}`,
                  },
                  {
                    name: `${staffdb.get('question5')}`,
                    value: `${answers[4]}`,
                  },
                );
                const staffapply_app_button = new ButtonBuilder()
                .setCustomId('staff_apply_app_id')
                .setLabel('قبول')
                .setEmoji('✔️')
                .setStyle(ButtonStyle.Success);
                const staffapply_disa_button = new ButtonBuilder()
                .setCustomId('staff_apply_disa_id')
                .setLabel('رفض')
                .setEmoji('✖️')
                .setStyle(ButtonStyle.Danger);
                const staffapply_result_row = new ActionRowBuilder()
                .addComponents(staffapply_app_button , staffapply_disa_button);
              interaction.user.send("تم ارسال التقديم للادارة يرجى انتظار النتائج ✅");
              specificChannel.send({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
                components : [staffapply_result_row],
              });
            } else {
              console.error("Could not find the specific channel.");
            }
          } catch (error) {
            console.error("Error sending or receiving DM:", error);
            interaction.reply({content : 'حدث خطا' , ephemeral : true});
          }
    }
})


