const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const API_KEY = "20dd3dc4bc1dd22e467422ab6c288d7d";

module.exports = {
  name: "weather",
  description: "Displays the current weather for a specified location.",
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("Please provide a location!"),
        ],
      });
    }

    const location = args.join(" ");
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(weatherApiUrl);
      const weatherData = response.data;

      const weatherDescription = weatherData.weather[0].description;
      const temperature = weatherData.main.temp;
      const city = weatherData.name;
      const country = weatherData.sys.country;
      const icon = weatherData.weather[0].icon;
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: weatherData.timezone
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC",
      });

      const weatherEmbed = new EmbedBuilder()
        .setColor("#1E90FF")
        .setTitle(`Current Weather in ${city}, ${country}`)
        .setDescription(
          `**Temperature:** ${temperature}°C\n**Condition:** ${weatherDescription}\n**Date & Time:** ${currentTime}`
        )
        .setThumbnail(`http://openweathermap.org/img/wn/${icon}.png`)
        .setTimestamp();

      message.channel.send({ embeds: [weatherEmbed] });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "Failed to fetch weather data. Please check the location or try again later."
            ),
        ],
      });
    }
  },
};
