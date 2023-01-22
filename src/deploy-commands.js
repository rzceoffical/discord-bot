const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('node:path')
const dotenv = require('dotenv')
dotenv.config()

const commands = []

const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

module.exports = async function deployCommands() {
  try {
    console.log(
      `Started refreshing ${commands.length} appliction (/) commands.`
    )

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    )

    console.log(`Successfully releaded ${data.length} appliction (/) commands.`)
  } catch (error) {
    console.error(error)
  }
}
