import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

bot.start((ctx) =>
  ctx.reply(
    "Отправьте ссылку на TikTok видео для скачивания без водяного знака"
  )
);

bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  if (!url.includes("tiktok.com")) {
    return ctx.reply("Пожалуйста, отправьте ссылку на TikTok видео");
  }

  try {
    const options = {
      method: "GET",
      url: process.env.RAPIDAPI_URL || "",
      params: { url },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);
    const videoUrl = response.data?.data?.play || response.data?.data?.hdplay;

    if (!videoUrl) {
      return ctx.reply("Не удалось получить видео по этой ссылке");
    }

    await ctx.replyWithVideo({ url: videoUrl });
  } catch (error) {
    ctx.reply("Произошла ошибка при обработке видео");
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
