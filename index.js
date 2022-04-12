// For a description of the Bot API, see this page: https://core.telegram.org/bots/api

const settings = require('./settings');
const telegramBotApi = require("node-telegram-bot-api");

const bot = new telegramBotApi(settings.telegramBotApi.token, {polling: true});

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*_-+=";

const customPasswdData = {
    lenght: null,
    alpha: null,
    numbers: null,
    symbols: null,
};

const emoji = {
    wavingHand: "\u{1F44B}",
    okHand: "\u{1F44C}",
    flexedBiceps: "\u{1F4AA}",
    checkMark: "\u{2714}",
    uncheckMark: "\u{2716}",
    clappingHands: "\u{1F44F}",
};


// выбираем тип пароля
const start = (chatId) => {
    const message = "Какой пароль будем создавать?";
    const messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Обычный пароль", callback_data: JSON.stringify({button: "generateRegularPasswd"})},
                ],
                [
                    {text: "Кастомный пароль", callback_data: JSON.stringify({button: "createCustomPasswd", value: 4})},
                ],
            ]
        })
    };
    bot.sendMessage(chatId, message, messageOptions);
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
            return generatePasswd(lenght, isNumbers, isSymbols);
        }
    }
    if (isSymbols) {
        const result = [...symbols].filter(value => passwd.includes(value));
        if (!result.length) {
            return generatePasswd(lenght, isNumbers, isSymbols);
        }
    }
    return passwd;
};


// генерим обычный пароль
const generateRegularPasswd = async (chatId) => {
    let passwd;
    const finishMessage = `Лови обычные пароли ${emoji.okHand}`;
    await bot.sendMessage(chatId, finishMessage, {parse_mode: "HTML"});
    // создадим набор паролей
    for (let i = 0; i < 4; i++) {
        passwd = generatePasswd();
        passwdMessage = `<code>${passwd}</code>`;
        await bot.sendMessage(chatId, passwdMessage, {parse_mode: "HTML"});
    }
    repeatRegularPasswd(chatId);
};


// повторить вывод паролей
const repeatRegularPasswd = (chatId) => {
    const message = `Создать еще паролей ${emoji.clappingHands}`;
    const messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Создать", callback_data: JSON.stringify({button: "generateRegularPasswd"})},
                ],
            ]
        })
    };
    bot.sendMessage(chatId, message, messageOptions);
};


// повторить вывод паролей
const repeatCustomPasswd = (chatId) => {
    const message = `Создать еще паролей ${emoji.clappingHands}`;
    const messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Создать", callback_data: JSON.stringify({button: "generateCustomPasswd"})},
                ],
            ]
        })
    };
    bot.sendMessage(chatId, message, messageOptions);
};


// выбираем количество символов в пароле
const setCustomPasswdLenght = async (chatId) => {
    const message = "Укажите длину пароля от <b>4</b> до <b>16</b> символов";
    const messageOptions = {
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
    await bot.sendMessage(chatId, message, messageOptions);
};


// числа
const setCustomPasswdNumbers = async (chatId) => {
    const message = `Использовать в пароле числа\n<b>${numbers}</b>`;
    const messageOptions = {
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
    await bot.sendMessage(chatId, message, messageOptions);
};


// символы
const setCustomPasswdSymbols = async (chatId) => {
    const message = `Использовать в пароле символы\n<b>${symbols}</b>`;
    const messageOptions = {
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
    await bot.sendMessage(chatId, message, messageOptions);
};


// генерим кастомный пароль
const generateCustomPasswd = async (chatId) => {
    console.log("customPasswdData: ", customPasswdData);
    const lenghtMsg = `<b>${customPasswdData.lenght}</b> - длина пароля\n`;
    const numbersMsg = customPasswdData.numbers ? `${emoji.checkMark} - числа\n` : `${emoji.uncheckMark} - числа\n`;
    const symbolsMsg = customPasswdData.symbols ? `${emoji.checkMark} - символы\n` : `${emoji.uncheckMark} - символы\n`;
    const message = lenghtMsg + numbersMsg + symbolsMsg;
    const messageOptions = {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: "Создать пароль", callback_data: JSON.stringify({button: "generateCustomPasswd", value: true})},
                ],
            ]
        })
    };
    await bot.sendMessage(chatId, message, messageOptions);
};


// ==============================================================


// старт
bot.setMyCommands([
    {command: "/start", description: "Создать пароль!"},
]);


// обработка сообщений из чата
bot.on('message', async msg => {
    // console.log('message: ', msg);
    let message;
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    switch (text) {
        case "/start":
            message = `Привет <b>${username}</b> ${emoji.wavingHand}`;
            await bot.sendMessage(chatId, message, {parse_mode: "HTML"});
            start(chatId);
            break;
        default:
            break;
    }
})


// обработка нажатия на кнопки
bot.on('callback_query', async msg => {
    // console.log('callback_query: ', msg);
    const data = JSON.parse(msg.data);
    const chatId = msg.message.chat.id;
    switch (data.button) {
        case "generateRegularPasswd":
            generateRegularPasswd(chatId);
            break;
        case "createCustomPasswd":
            // обнуляем параметры кастомного пароля
            customPasswdData.lenght = null;
            customPasswdData.numbers = null;
            customPasswdData.symbols = null;
            customPasswdData.message = "";
            setCustomPasswdLenght(chatId);
            break;
        case "lenght":
            customPasswdData.lenght = data.value;
            console.log("customPasswdData: ", customPasswdData);
            setCustomPasswdNumbers(chatId);
            break;
        case "numbers":
            customPasswdData.numbers = data.value;
            console.log("customPasswdData: ", customPasswdData);
            setCustomPasswdSymbols(chatId);
            break;
        case "symbols":
            customPasswdData.symbols = data.value;
            console.log("customPasswdData: ", customPasswdData);
            generateCustomPasswd(chatId);
            break;
        case "generateCustomPasswd":
            let passwd, passwdMessage;
            const finishMessage = `Лови кастомные пароли ${emoji.flexedBiceps}`;
            await bot.sendMessage(chatId, finishMessage, {parse_mode: "HTML"});
            // создадим набор паролей
            for (let i = 0; i < 4; i++) {
                passwd = generatePasswd(customPasswdData.lenght, customPasswdData.numbers, customPasswdData.symbols);
                passwdMessage = `<code>${passwd}</code>`;
                await bot.sendMessage(chatId, passwdMessage, {parse_mode: "HTML"});
            }
            repeatCustomPasswd(chatId);
            break;
        default:
            break;
    }
    // console.log('customPasswdData: ', customPasswdData);
})

