const { EmbedBuilder } = require("discord.js");
const { ProLogs } = require("resthaven")
const logger = new ProLogs()

const colorMap = {
  "green": 0x008000,
  "red": 0xFF0000,
  "blue": 0xADD8E6,
  "yellow": 0xFFFF00,
  "purple": 0x800080,
  "orange": 0xFFA500,
  "pink": 0xFFC0CB,
  "black": 0x000000,
  "white": 0xFFFFFF
};

class Embed {
  constructor() {
    this.interaction = null;
    this.description = '';
    this.color = '#FFFFFF';
  }

  setInteraction(interaction) {
    this.interaction = interaction;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

setColor(color) {
  if (typeof color === 'string') {
    if (colorMap[color.toLowerCase()]) {
      this.color = colorMap[color.toLowerCase()];
    } else {
      this.color = 0xFFFFFF;
      logger.warning(`Geçersiz renk adı verildi: ${color}. Default renk olan beyaz (FFFFFF) kullanıldı.`);
    }
  } else {
    this.color = color;
  }
  return this;
}
  build() {

    const date = new Date();
    const year = date.getUTCFullYear().toString();

    if (!this.interaction) return logger.error("Embedin interaction yok.")
    if (!this.description) return logger.error("Embedin description yok.")
    if (!this.color) return logger.error("Embedin coloru yok.")

    const embed = new EmbedBuilder()
      .setAuthor({ name: `@${this.interaction.user.username}`, iconURL: this.interaction.user.displayAvatarURL() })
      .setDescription(this.description)
      .setColor(this.color)
      .setFooter({ text: `Pulkadot © ${year}`, iconURL: this.interaction.client.user.displayAvatarURL() });

    return embed;
  }
}

module.exports = { Embed };