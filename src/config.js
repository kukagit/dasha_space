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
    subtitle: "Добро пожаловать в белое пространство. Твоё белое пространтсво",
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
      name: "Обри",
      sprite: "assets/images/npc1.png",
      spriteSize: 32,
      position: { x: 120, y: 120 },
      dialog: [
        "О, Дашенька! С днём рождения!",
        "Представляешь, нас тут мутный айтишник заставил стоять и ждать тебя",
        "Я готова была отказать, но услышав что это ради поздравления согласилась",
        "ну еще Омори ничего против не сказал ему...",
        "У меня для тебя кусочек кода.",
        "Запомни: первая часть — Пусть мир",
      ],
      passwordPart: "Пусть мир",
    },
    {
      id: 2,
      name: "Кел",
      sprite: "assets/images/npc2.png",
      spriteSize: 32,
      position: { x: 680, y: 120 },
      dialog: [
        "О! это ты та самая Даша?!",
        "Я уже думал не дождусь, но Хиро меня уговорил по ещё пяти минуточкам",
        "Если правильно помню, Я храню вторую часть кода.",
        "Записывай: Окончательно",
      ],
      passwordPart: " окончательно",
    },
    {
      id: 3,
      name: "Омори",
      sprite: "assets/images/npc3.png",
      spriteSize: 32,
      position: { x: 120, y: 460 },
      dialog: [
        "...",
        "*Он протянул листок*",
        "На листке написано, забудет",
      ],
      passwordPart: " забудет",
    },
    {
      id: 4,
      name: "Хиро",
      sprite: "assets/images/npc4.png",
      spriteSize: 32,
      position: { x: 680, y: 460 },
      dialog: [
        "О, ты уже пришла?",
        "Хорошо что эти двое никуда не успели убежать",
        "С днём рождения Даша. Надеюсь ты рада что мы лично встречаем тебя",
        "Последная часть кода - меня",
      ],
      passwordPart: " меня",
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
    hint: "Последние слова великой властительницы Руккхадевата",
    caseSensitive: false,
    ignoreSpaces: true,
  },

    ending: {
    image: "assets/images/card.png",
    title: "АХ, какая молодец!",
    message:
      "Снова же с днём рождения, любимка!\n" +
      "Спасибо что посидела за моим мелким творческим проектом\n" +
      "Самой лучшей женщине на свете <3\n" +
      "Если дошла до сюда напиши в лс - ДВОЙНОЙ БОЛЬШОЙ ЧЖАН ЧЖУ",
    music: "assets/audio/ending.mp3",
    confetti: true,

    // --- Падающие картинки поверх конфетти ---
    // Сюда добавляй пути к PNG, которые должны падать (можно несколько — будут чередоваться случайно).
    fallingImages: [
      "assets/images/Durin_sitting.gif",
      "assets/images/wanderer wandering.gif",
      "assets/images/Albedo chibi.jpeg",
      "assets/images/Scatamouche.jpg",
      "assets/images/1.jpg",
      "assets/images/2.jpg",
      "assets/images/3.jpg",
      "assets/images/4.jpg",
      "assets/images/5.jpg",
      "assets/images/6.jpg",
      "assets/images/7.jpg",
      "assets/images/8.jpg",
      "assets/images/9.jpg",
      "assets/images/10.jpg",
    ],
    fallingInterval: 3000,       // мс между появлениями новой картинки (3 сек по дефолту)
    fallingSpeedDivisor: 3,      // во сколько раз медленнее конфетти
    fallingSize: 96,             // размер картинки на экране (px)
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
