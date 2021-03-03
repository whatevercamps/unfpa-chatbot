"use strict";

const TelegramBot = require("node-telegram-bot-api");

const MessageHandler = () => {
  const token = process.env.TELEGRAM_TOKEN;

  const bot = new TelegramBot(token, { polling: true });

  console.log("bot configured");

  bot.on("message", (msg) => {
    console.log("new message", msg);

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Hola, soy C418 🤖.");
  });

  return bot;
};

module.exports = MessageHandler;
