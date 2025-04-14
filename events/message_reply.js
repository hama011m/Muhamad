const { ModalBuilder } = require("@discordjs/builders");
const client = require("../index");
const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder, Client, Integration , TextInputBuilder , TextInputStyle} = require('discord.js')
const {Database} = require('st.db');
const replydb = new Database('./json/reply.json')

