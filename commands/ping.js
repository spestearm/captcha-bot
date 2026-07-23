const { Embed } = require("../utils/createEmbed.js");

// const config = require("../config.json");
// const db = require("../db.js");

module.exports = {
  name: "ping",
  description: "Bot, Discord API gecikme süresini gösterir.",
  options: [],
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const embed = new Embed()
      .setInteraction(interaction)
      .setDescription(`Güncel gecikme: ${client.ws.ping}ms`)
      .setColor("green")
      .build();

    interaction.reply({ embeds: [embed] });

  },
};