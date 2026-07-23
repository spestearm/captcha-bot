const { Client, Partials, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { pulkadot_logo, background_image } = require("./images.json");
const { readdirSync } = require("fs");
const { generate } = require("random-words");
const { Captcha } = require("canvafy");
const config = require("./config.json");
const dotenv = require("dotenv");
const db = require("./db.js");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
    repliedUser: true,
  },
  retryLimit: 3,
});

/**
 * @param {import('discord.js').Client} client
*/
global.client = client;
client.commands = global.commands = [];

dotenv.config({ path: `.env` });

readdirSync("./commands").forEach((f) => {
  if (!f.endsWith(".js")) return;

  const props = require(`./commands/${f}`);

  client.commands.push({
    name: props.name.toLowerCase(),
    description: props.description,
    options: props.options,
    dm_permission: props.dm_permission,
    type: 1,
  });
});

readdirSync("./events").forEach((e) => {
  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
    eve(client, ...args);
  });
});

client.on("guildMemberAdd", async (member) => {
  if (!db.has(`captcha_${member.guild.id}`)) return;

  const data = db.get(`captcha_${member.guild.id}`);
  const role = member.guild.roles.cache.get(data.role);
  const channel = member.guild.channels.cache.get(data.channel);
  const word = generate({ minLength: 5, maxLength: 9 });

  console.log(word);

  const card = new Captcha()
    .setCaptchaKey(word)
    .setBackground("image", background_image)
    .setOverlayOpacity(0.7)

  const imageBuffer = await card.build();

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) || pulkadot_logo })
    .setDescription(`${member.user.username}, sunucuya hoşgeldiniz. Doğrulamak için yukarıdaki kodu yazın. Yanlış yazarsanız veya 30 saniye içerisinde yazmazsanız sunucudan atılırsınız. `)
    .setColor("Green")
    .setFooter({ text: "Pulkadot © 2026", iconURL: pulkadot_logo })

  await channel.send({ embeds: [embed], content: `<@${member.id}>`, files: [{ attachment: imageBuffer, name: `pulkadot-captcha-${member.id}.png` }] }).then((m) => {
    const filter = (msg) => msg.author.id === member.id && msg.content === word;
    const collector = m.channel.createMessageCollector({ filter, time: 30_000 });

    collector.on("collect", (msg) => {
      member.roles.add(role);
      msg.reply(`Doğrulama tamamlandı!`);
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        m.channel.send(`${member} zamanında kodu vermediği için sunucudan atıldı.`);
        member.kick();
      }
    });
  })

});

client.login(process.env.token);

process.on("unhandledRejection", (error) => {
  console.log(error);
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.log(err);
});