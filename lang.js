// === lang.js ===

// lang.js - безопасная версия (использует camelCase ключи)

const translations = {
  ru: {
    home: "Главная",
    about: "О проекте",
    heroKicker: "Социально-образовательный проект",
    heroSubtitle: "Диагностические тесты по математике, английскому языку и информатике. Пройдите короткие задания и получите мгновенный фидбэк с подсказками.",
    heroBtn1: "Пройти тест",
    heroBtn2: "Подробнее",
    sectionAboutTitle: "Почему это важно",
    sectionAboutText: "Помогаем ученикам увидеть сильные стороны и пробелы. После каждого теста — понятный отчёт и темы для повторения.",
    testsTitle: "Выберите предмет",
    testsText: "Тест 10–15 минут. Сразу после — результаты и краткий разбор.",
    mathChip: "Математика",
    mathTitle: "Диагностика по математике",
    mathDesc: "Алгебра, геометрия, логика. Адаптивная сложность и фидбэк по темам.",
    engChip: "Английский",
    engTitle: "Диагностика по английскому",
    engDesc: "Грамматика, лексика, чтение. Выбор: Mixed / Grammar / Vocabulary / Reading.",
    infChip: "Информатика",
    infTitle: "Диагностика по информатике",
    infDesc: "Алгоритмы, логика, основы программирования и ИКТ. Краткий тест и мгновенный фидбэк.",
    mixed: "Смешанный",
    geometry: "Геометрия",
    algebra: "Алгебра",
    theory: "Теория",
    practice: "Практика",
    start: "Начать",
    footerText: "Сделано с заботой об образовании.",
  },
  kk: {
    home: "Басты бет",
    about: "Жоба туралы",
    heroKicker: "Әлеуметтік-білім беру жобасы",
    heroSubtitle: "Математика, ағылшын тілі және информатика пәндері бойынша диагностикалық тесттер. Қысқа тапсырмаларды орындап, бірден кері байланыс алыңыз.",
    heroBtn1: "Тестті бастау",
    heroBtn2: "Толығырақ",
    sectionAboutTitle: "Бұл не үшін маңызды",
    sectionAboutText: "Оқушыларға өз күшті және әлсіз жақтарын көруге көмектесеміз. Әр тесттен кейін — нақты есеп және қайталау тақырыптары.",
    testsTitle: "Пәнді таңдаңыз",
    testsText: "Тест 10–15 минут. Нәтиже және қысқаша талдау бірден көрсетіледі.",
    mathChip: "Математика",
    mathTitle: "Математика диагностикасы",
    mathDesc: "Алгебра, геометрия, логика. Тақырыптар бойынша бейімделген қиындық және фидбэк.",
    engChip: "Ағылшын тілі",
    engTitle: "Ағылшын тілі диагностикасы",
    engDesc: "Грамматика, сөздік қор, оқу. Таңдау: Mixed / Grammar / Vocabulary / Reading.",
    infChip: "Информатика",
    infTitle: "Информатика диагностикасы",
    infDesc: "Алгоритмдер, логика, бағдарламалау негіздері және АКТ. Қысқа тест және бірден нәтиже.",
    mixed: "Аралас",
    geometry: "Геометрия",
    algebra: "Алгебра",
    theory: "Теория",
    practice: "Тәжірибе",
    start: "Бастау",
    footerText: "Білімге қамқорлықпен жасалған.",
  },
  en: {
    home: "Home",
    about: "About",
    heroKicker: "Social-educational project",
    heroSubtitle: "Diagnostic tests in math, English, and informatics. Take short quizzes and get instant feedback with hints.",
    heroBtn1: "Start test",
    heroBtn2: "Learn more",
    sectionAboutTitle: "Why it matters",
    sectionAboutText: "We help students see their strengths and weaknesses. After each test — a clear report and topics for review.",
    testsTitle: "Choose a subject",
    testsText: "Test takes 10–15 minutes. Get results and feedback immediately.",
    mathChip: "Math",
    mathTitle: "Math diagnostics",
    mathDesc: "Algebra, geometry, logic. Adaptive difficulty and feedback by topics.",
    engChip: "English",
    engTitle: "English diagnostics",
    engDesc: "Grammar, vocabulary, reading. Types: Mixed / Grammar / Vocabulary / Reading.",
    infChip: "Informatics",
    infTitle: "Informatics diagnostics",
    infDesc: "Algorithms, logic, programming basics and ICT. Short test and instant feedback.",
    mixed: "Mixed",
    geometry: "Geometry",
    algebra: "Algebra",
    theory: "Theory",
    practice: "Practice",
    start: "Start",
    footerText: "Made with care for education.",
  }
};

// Установка языка и применение
function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations();
}

function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'ru';

  // активная кнопка
  document.querySelectorAll('.lang button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // меняем все элементы с data-key
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    const text = translations[lang] && translations[lang][key];
    if (typeof text !== 'undefined') {
      // если элемент — input или placeholder
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // навесить события на кнопки выбора языка
  document.querySelectorAll('.lang button').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  applyTranslations();
});


// === Сохранение языка ===
function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations();
}

// === Применение переводов ===
function applyTranslations() {
  const lang = localStorage.getItem("lang") || "ru";

  // Меняем активную кнопку языка
  document.querySelectorAll(".lang button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Меняем тексты с data-key
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    el.textContent = translations[lang][key] || el.textContent;
  });
}

// === При загрузке страницы применяем сохранённый язык ===
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "ru";
  applyTranslations();

  // Навешиваем события на кнопки
  document.querySelectorAll(".lang button").forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
});


