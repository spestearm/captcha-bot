const { PermissionFlagsBits } = require("discord.js");
const { Embed } = require("../utils/createEmbed.js");
const db = require("../db.js");

module.exports = {
  name: "captcha-kur",
  description: "Captcha sistemini aktifleştirir.",
  options: [
    {
      name: "kanal",
      description: "Kanal belirtin.",
      type: 7,
      required: true,
      channel_types: [0]
    },
    {
      name: "verilecek-rol",
      description: "Verilecek rolü belirtin.",
      type: 8,
      required: true
    }
  ],
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const channel = interaction.options.getChannel("kanal");
    const role = interaction.options.getRole("verilecek-rol");

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = new Embed()
        .setInteraction(interaction)
        .setDescription(`Bunu yapamazsın.`)
        .setColor("red")
        .build();

      return interaction.reply({ embeds: [embed], flags: 64 });
    };

    if (db.has(`captcha_${interaction.guild.id}`)) {
      const embed = new Embed()
        .setInteraction(interaction)
        .setDescription(`Sistem zaten kurulu.`)
        .setColor("red")
        .build();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    db.set(`captcha_${interaction.guild.id}`, { role: role.id, channel: channel.id });

    const embed = new Embed()
      .setInteraction(interaction)
      .setDescription(`Sistem kuruldu. ${channel} kanalında ${role} rolü için captcha kontrolü yapacak.`)
      .setColor("green")
      .build();

    interaction.reply({ embeds: [embed] });

  },
};