// =====================================================================
//   ⭐ ВСЯ КАСТОМИЗАЦИЯ ЗДЕСЬ
// ---------------------------------------------------------------------
//   Поменяй текст / картинки / музыку / пароли в этом файле.
//   Картинки клади в assets/images/ под теми же именами,
//   музыку — в assets/audio/.
// =====================================================================

export const CONFIG = {
  birthdayName: "Даша",

  intro: {
    title: "С днём рождения, Даша!",
    subtitle: "Ты в белом пространстве. Поговори с каждым и собери код.",
    startButton: "Начать",
  },

  world: {
    width: 800,
    height: 600,
    backgroundImage: "assets/images/background.png", // если файла нет — будет белый фон
    backgroundColor: "#ffffff",
  },

  player: {
    sprite: "assets/images/player.png",
    spriteSize: 32,
    speed: 2,
    spawn: { x: 400, y: 480 },
  },

  // 4 NPC. Итоговый пароль = склейка passwordPart по порядку id (если password.correct = null).
  npcs: [
    {
      id: 1,
      name: "Друг 1",
      sprite: "assets/images/npc1.png",
      spriteSize: 32,
      position: { x: 120, y: 120 },
      dialog: [
        "О, Даша! С днём рождения!",
        "У меня для тебя кусочек кода.",
        "Запомни: первая часть — DA",
      ],
      passwordPart: "DA",
    },
    {
      id: 2,
      name: "Друг 2",
      sprite: "assets/images/npc2.png",
      spriteSize: 32,
      position: { x: 680, y: 120 },
      dialog: [
        "Привет, именинница!",
        "Я храню вторую часть кода.",
        "Записывай: SHA",
      ],
      passwordPart: "SHA",
    },
    {
      id: 3,
      name: "Друг 3",
      sprite: "assets/images/npc3.png",
      spriteSize: 32,
      position: { x: 120, y: 460 },
      dialog: [
        "С днём рождения!",
        "Третья часть кода — 18",
        "(поменяй на сколько лет в config.js)",
      ],
      passwordPart: "18",
    },
    {
      id: 4,
      name: "Друг 4",
      sprite: "assets/images/npc4.png",
      spriteSize: 32,
      position: { x: 680, y: 460 },
      dialog: [
        "Эй! Поздравляю!",
        "Последний кусок: 2026",
        "Собери всё вместе и подойди к центру.",
      ],
      passwordPart: "2026",
    },
  ],

  // Центральный объект — куда подходишь, чтобы ввести пароль
  altar: {
    position: { x: 400, y: 290 },
    size: 32,
    sprite: "assets/images/altar.png", // если файла нет — нарисуется ромб с «?»
    promptHint: "Введи собранный код",
  },

  // Пароль
  password: {
    // null = автосклейка passwordPart всех NPC по их id (DA + SHA + 18 + 2026)
    correct: null,
    hint: "Подскажи, что собрал у каждого друга",
    caseSensitive: false,
    ignoreSpaces: true,
  },

  ending: {
    image: "assets/images/card.png",
    title: "С днём рождения, Даша!",
    message:
      "Желаю тебе много счастья,\n" +
      "успехов в делах, тепла,\n" +
      "и самых ярких моментов!",
    music: "assets/audio/ending.mp3",
    confetti: true,
  },

  audio: {
    bgm: "assets/audio/bgm.mp3",
    bgmVolume: 0.4,
    endingVolume: 0.6,
  },

  controls: {
    up: ["ArrowUp", "KeyW"],
    down: ["ArrowDown", "KeyS"],
    left: ["ArrowLeft", "KeyA"],
    right: ["ArrowRight", "KeyD"],
    interact: ["KeyE", "Space", "Enter"],
  },

  interactRadius: 56,

  storageKey: "dasha_space:progress",
};
