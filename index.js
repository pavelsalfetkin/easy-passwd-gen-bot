// For a description of the Bot API, see this page: https://core.telegram.org/bots/api

const telegramBotApi = require("node-telegram-bot-api");

const token = "2138397599:AAHfimmZuRss3olZlSt3z-g69NkkWl7d3AE";

const bot = new telegramBotApi(token, {polling: true});

const messageOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Button 1", callback_data: "1"}],
            [{text: "Button 2", callback_data: "2"}],
            [{text: "Button 3", callback_data: "3"}],
        ]
    })
};

bot.setMyCommands([
    {command: "/start", description: "Приветствие от бота"},
    {command: "/info", description: "Информация от бота"},
    {command: "/button", description: "Вызов кнопок"}
]);

bot.on('message', async msg => {
    console.log(msg);
    console.log(bot);

    const text = msg.text;
    const chatId = msg.chat.id;
    const personName = msg.from.username;
    let botAnswerMessage;

    // await function

    switch (text) {
        case "/start":
            botAnswerMessage = `${personName}, ты написал мне "${text}", какой молодец, спасибо :)`;
            bot.sendMessage(chatId, botAnswerMessage, {parse_mode: "MarkdownV2"});
            break;
        case "/info":
            botAnswerMessage = `${personName}, ты написал мне "${text}", <b>какой молодец</b>, спасибо :)`;
            bot.sendMessage(chatId, botAnswerMessage, {parse_mode: "HTML"});
            break;
        case "/button":
            botAnswerMessage = `Пожалуйте, кнопочки`;
            bot.sendMessage(chatId, botAnswerMessage, messageOptions);
            break;
        default:
            break;
    }

    bot.on('callback_query', msg => {
        console.log(msg);
        const data = msg.data;
        const chatId = msg.message.chat.id;
        botAnswerMessage = `Вы выбрали это: ${data}, поздравляю!`;
        bot.sendMessage(chatId, botAnswerMessage);
    })

    
})

