const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
client.commands = new Collection();
const commandsArray = [];
const player = useMainPlayer();

const { Translate, GetTranslationModule } = require("./process_tools");

const discordEvents = readdirSync("./events/Discord/").filter((file) =>
  file.endsWith(".js")
);
const playerEvents = readdirSync("./events/Player/").filter((file) =>
  file.endsWith(".js")
);

// Tải module dịch thuật
GetTranslationModule().then(() => {
  console.log("| Translation Module Loaded |");

  // Tải các sự kiện Discord
  for (const file of discordEvents) {
    try {
      const DiscordEvent = require(`./events/Discord/${file}`);
      const txtEvent = `< -> > [Loaded Discord Event] <${file.split(".")[0]}>`;
      parseLog(txtEvent);
      client.on(file.split(".")[0], DiscordEvent.bind(null, client));
    } catch (error) {
      console.error(`Error loading Discord event ${file}:`, error);
    }
  }

  // Tải các sự kiện Player
  for (const file of playerEvents) {
    try {
      const PlayerEvent = require(`./events/Player/${file}`);
      const txtEvent = `< -> > [Loaded Player Event] <${file.split(".")[0]}>`;
      parseLog(txtEvent);
      player.events.on(file.split(".")[0], PlayerEvent.bind(null));
    } catch (error) {
      console.error(`Error loading Player event ${file}:`, error);
    }
  }

  // Tải các lệnh
  readdirSync("./commands/").forEach((dirs) => {
    const commands = readdirSync(`./commands/${dirs}`).filter((files) =>
      files.endsWith(".js")
    );

    for (const file of commands) {
      try {
        const command = require(`./commands/${dirs}/${file}`);
        if (command.name && command.description) {
          commandsArray.push(command);
          const txtEvent = `< -> > [Loaded Command] <${command.name.toLowerCase()}>`;
          parseLog(txtEvent);
          client.commands.set(command.name.toLowerCase(), command);
        } else {
          const txtEvent = `< -> > [Failed Command] <${command.name.toLowerCase()}>`;
          parseLog(txtEvent);
        }
      } catch (error) {
        console.error(`Error loading command ${file}:`, error);
      }
    }
  });

  // Đăng ký lệnh sau khi bot đã sẵn sàng
  client.on("ready", async (client) => {
    try {
      if (client.config.app.global) {
        await client.application.commands.set(commandsArray);
      } else {
        await client.guilds.cache
          .get(client.config.app.guild)
          .commands.set(commandsArray);
      }
    } catch (error) {
      console.error("Error setting commands:", error);
    }
  });

  // Hàm ghi log với hỗ trợ dịch thuật
  async function parseLog(txtEvent) {
    const translatedText = await Translate(txtEvent, null);
    console.log(translatedText);
  }
});
