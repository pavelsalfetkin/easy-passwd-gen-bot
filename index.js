// For a description of the Bot API, see this page: https://core.telegram.org/bots/api

const settings = require('./settings');
const telegramBotApi = require("node-telegram-bot-api");

const bot = new telegramBotApi(settings.token, {polling: true});

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*_-+=";

let specialPasswdData = {
    lenght: 8,
    numbers: true,
    symbols: true,
    message: "",
};


// генерим пароль
const generatePasswd = (lenght = 8, isNumbers = true, isSymbols = true) => {
    let passwd = "";
    let characters = alpha;
    isNumbers ? (characters += numbers) : "";
    isSymbols ? (characters += symbols) : "";
    for (let i = 0; i < lenght; i++) {
        passwd += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    if (isNumbers) {
        const result = [...numbers].filter(value => passwd.includes(value));
        if (!result.length) {
            // console.log("passwd: ", passwd);
            return generatePasswd(lenght, isNumbers, isSymbols);
        }
    }
    if (isSymbols) {
        const result = [...symbols].filter(value => passwd.includes(value));
        if (!result.length) {
            // console.log("passwd: ", passwd);
            return generatePasswd(lenght, isNumbers, isSymbols);
        }
    }
    return passwd;
};


// длина пароля
const processingSpecialPasswdLenght = (chatId) => {
    let messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "4", callback_data: JSON.stringify({button: "lenght", value: 4})},
                    {text: "6", callback_data: JSON.stringify({button: "lenght", value: 6})},
                    {text: "8", callback_data: JSON.stringify({button: "lenght", value: 8})},
                ],
                [
                    {text: "10", callback_data: JSON.stringify({button: "lenght", value: 10})},
                    {text: "12", callback_data: JSON.stringify({button: "lenght", value: 12})},
                    {text: "14", callback_data: JSON.stringify({button: "lenght", value: 14})},
                ],
                [
                    {text: "16", callback_data: JSON.stringify({button: "lenght", value: 16})},
                ]
            ]
        })
    };
    message = "Укажите длину пароля от <b>4</b> до <b>16</b> символов";
    bot.sendMessage(chatId, message, messageOptions);
};


// числа
const processingSpecialPasswdNumbers = (chatId) => {
    let messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Да", callback_data: JSON.stringify({button: "numbers", value: true})},
                    {text: "Нет", callback_data: JSON.stringify({button: "numbers", value: false})},
                ],
            ]
        })
    };
    message = `Использовать в пароле числа\n<b>${numbers}</b>`;
    bot.sendMessage(chatId, message, messageOptions);
};


// символы
const processingSpecialPasswdSymbols = (chatId) => {
    let messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Да", callback_data: JSON.stringify({button: "symbols", value: true})},
                    {text: "Нет", callback_data: JSON.stringify({button: "symbols", value: false})},
                ],
            ]
        })
    };
    message = `Использовать в пароле символы\n<b>${symbols}</b>`;
    bot.sendMessage(chatId, message, messageOptions);
};


// кнопки в меню
bot.setMyCommands([
    {command: "/start", description: "Информация от бота"},
    {command: "/normal_passwd", description: "Обычный пароль"},
    {command: "/special_passwd", description: "Специальный пароль"},
]);


// обработка сообщений из чата
bot.on('message', async msg => {
    console.log('message: ', msg);
    let message;
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    switch (text) {
        case "/start":
            message = `&#128075; Привет <b>${username}</b> &#128521; я бот который может сгенерировать для тебя пароль!\n\n/normal_passwd - обычный пароль (8 символов)\n/special_passwd - специальный пароль (с настройками)`;
            await bot.sendMessage(chatId, message, {parse_mode: "HTML"});
            break;
        case "/normal_passwd":
            message = `<code>${generatePasswd()}</code>`;
            await bot.sendMessage(chatId, message, {parse_mode: "HTML"});
            break;
        case "/special_passwd":
            processingSpecialPasswdLenght(chatId);
            break;
        default:
            break;
    }
})


// обработка нажатия на кнопки
bot.on('callback_query', async msg => {
    console.log('callback_query: ', msg);
    const data = JSON.parse(msg.data);
    const chatId = msg.message.chat.id;
    switch (data.button) {
        case "lenght":
            specialPasswdData.lenght = data.value;
            specialPasswdData.message += `<b>${data.value}</b> - длина пароля\n`;
            processingSpecialPasswdNumbers(chatId);
            break;
        case "numbers":
            specialPasswdData.numbers = data.value;
            specialPasswdData.message += data.value ? "✔️ - числа\n" : "❌ - числа\n";
            processingSpecialPasswdSymbols(chatId);
            break;
        case "symbols":
            specialPasswdData.symbols = data.value;
            specialPasswdData.message += data.value ? "✔️ - символы\n" : "❌ - символы\n";
            await bot.sendMessage(chatId, specialPasswdData.message, {parse_mode: "HTML"});
            // генерим пароль
            message = `<code>${generatePasswd(specialPasswdData.lenght, specialPasswdData.numbers, specialPasswdData.symbols)}</code>`;
            await bot.sendMessage(chatId, message, {parse_mode: "HTML"});
            specialPasswdData.message = "";
            break;
        default:
            break;
    }
    console.log('specialPasswdData: ', specialPasswdData);
})

