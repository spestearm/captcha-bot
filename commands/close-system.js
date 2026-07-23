const { PermissionFlagsBits } = require("discord.js");
const { Embed } = require("../utils/createEmbed.js");
const db = require("../db.js");

module.exports = {
    name: "captcha-kapat",
    description: "Captcha sistemini kapatır.",
    options: [],
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new Embed()
                .setInteraction(interaction)
                .setDescription(`Bunu yapamazsın.`)
                .setColor("red")
                .build();
            return interaction.reply({ embeds: [embed], flags: 64 });
        };

        if (!db.has(`captcha_${interaction.guild.id}`)) {
            const embed = new Embed()
                .setInteraction(interaction)
                .setDescription(`Sistem kurulu değil.`)
                .setColor("red")
                .build();
            return interaction.reply({ embeds: [embed], flags: 64 });
        }

        db.delete(`captcha_${interaction.guild.id}`);

        const embed = new Embed()
            .setInteraction(interaction)
            .setDescription(`Sistem kapatıldı.`)
            .setColor("red")
            .build();

        interaction.reply({ embeds: [embed], flags: 64 });

    },
};