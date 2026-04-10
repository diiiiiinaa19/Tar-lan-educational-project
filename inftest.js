/* inftest.js — final (ONLY T01 keeps image animation; all other image-type questions made MCQ/no-image)
   - Language selector EN/RU/KK before start
   - Translations applied from Q_TRANSLATIONS
   - T01 keeps embedded animated GIF URL (external) — other image questions removed
   - Top feedback block (percent + level) remains; detailed stats saved to localStorage
*/

/* ======= HELPERS ======= */
function _esc(s){ return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }
function shuffle(a){ const r=a.slice(); for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]] } return r; }
function nowISO(){ return (new Date()).toISOString(); }
function randChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function getLang(){ return localStorage.getItem('edu_lang') || 'en'; }
function setLang(lang){ localStorage.setItem('edu_lang', lang || 'en'); }

/* ======= I18N (UI only) ======= */
const I18N = {
  en: {
    result: 'Result',
    levelLabel: 'Level',
    randomFact: 'Random fact / quote',
    details: 'Details',
    nextTest: 'Next test',
    backHome: 'Back to Home Page',
    startTest: 'Start Test',
    selectLang: 'Select language',
    excellent: 'Excellent — you clearly understand the material. Keep practicing and try advanced problems.',
    verygood: 'Good — solid understanding, review a few topics to reach top level.',
    satisfactory: 'Satisfactory — you know basics but need more practice on key topics.',
    belowavg: 'Below average — focus on fundamentals and practice exercises.',
    beginner: 'Beginner — start from fundamentals; watch tutorials and solve simple problems.',
    imageUnavailable: 'Image unavailable'
  },
  ru: {
    result: 'Результат',
    levelLabel: 'Уровень',
    randomFact: 'Интересный факт / цитата',
    details: 'Детали',
    nextTest: 'Следующий тест',
    backHome: 'Назад на главную',
    startTest: 'Начать тест',
    selectLang: 'Выберите язык',
    excellent: 'Отлично — вы уверенно знаете материал. Продолжайте практиковаться и переходите к сложным задачам.',
    verygood: 'Хорошо — прочная база, повторите несколько тем, чтобы повысить уровень.',
    satisfactory: 'Удовлетворительно — вы знаете основы, но нужно больше практики по ключевым темам.',
    belowavg: 'Ниже среднего — сосредоточьтесь на фундаментах и практике.',
    beginner: 'Начальный уровень — начните с основ, смотрите уроки и решайте простые задачи.',
    imageUnavailable: 'Изображение недоступно'
  },
  kk: {
    result: 'Нәтиже',
    levelLabel: 'Деңгей',
    randomFact: 'Қызықты факт / дәйексөз',
    details: 'Толығырақ',
    nextTest: 'Келесі тест',
    backHome: 'Басты бетке оралу',
    startTest: 'Тесті бастау',
    selectLang: 'Тілді таңдаңыз',
    excellent: 'Өте жақсы — материалды жақсы меңгергенсіз. Практикаңызды жалғастырыңыз және күрделі тапсырмаларға өтіңіз.',
    verygood: 'Жақсы — негізі берік, жоғары деңгейге көтерілу үшін кейбір тақырыптарды қайталаңыз.',
    satisfactory: 'Қанағаттанарлық — негізгі білім бар, бірақ негізгі тақырыптар бойынша қосымша жаттығу қажет.',
    belowavg: 'Ортадан төмен — негізгі нәрселерге назар аударып, жаттығу жасаңыз.',
    beginner: 'Бастапқы — негіздерден бастаңыз, оқулықтар мен жеңіл тапсырмаларды орындаңыз.',
    imageUnavailable: 'Сурет қолжетімсіз'
  }
};
function t(key){ const lang = getLang(); return (I18N[lang] && I18N[lang][key]) || I18N['en'][key] || key; }

/* ======= Level assets (data-URI svgs) ======= */
const LEVEL_ASSETS = {
  A: { titleKey:'excellent', img:`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#e6fffa"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="44" fill="#065f46">🎉 Brilliant!</text><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#065f46">Keep it up — you are ready!</text></svg>')}` },
  B: { titleKey:'verygood', img:`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#eff6ff"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="#1e3a8a">👍 Very good!</text><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#1e3a8a">A bit of practice and you\'ll be A.</text></svg>')}` },
  C: { titleKey:'satisfactory', img:`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#fff7ed"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="#92400e">🙂 Keep going</text><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#92400e">Focus on weak topics.</text></svg>')}` },
  D: { titleKey:'belowavg', img:`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#fff1f2"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="#9f1239">😕 Work more</text><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#9f1239">Start from basics and practice.</text></svg>')}` },
  F: { titleKey:'beginner', img:`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#f8fafc"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="#0f172a">🚀 Begin now</text><text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#0f172a">Basics → practice → repeat.</text></svg>')}` }
};

/* ======= Fun facts ======= */
const FUN_FACTS = [
  "Fact: The first computer bug was a real moth found in 1947.",
  "Quote: 'Programs must be written for people to read, and only incidentally for machines to execute.' — Harold Abelson",
  "Fact: Binary '1010' equals decimal 10.",
  "Quote: 'Simplicity is prerequisite for reliability.' — Edsger W. Dijkstra",
  "Fact: The first high-level programming language was Fortran (1957)."
];

/* ======= QUESTION BANKS (30 each) ======= */
/* Note: image kept only for T01 (sorting animation); other image-typed questions converted to mcq (no image) */
const THEORY_30 = [
  { id:'T01', type:'image', q:'Identify this algorithm visualization (which sort is shown?)', img:'https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif', options:['Quick sort','Merge sort','Selection sort','Bubble sort'], answer:0, topic:'algorithms', explain:'This is quicksort animation.' },
  { id:'T02', type:'mcq', q:'Time complexity of binary search on sorted array?', options:['O(n)','O(log n)','O(n log n)','O(1)'], answer:1, topic:'algorithms', explain:'Binary search — O(log n).' },
  { id:'T03', type:'mcq', q:'Identify this data structure (which is pictured?)', options:['Array','Hash table','BST','Linked list'], answer:2, topic:'data_structures', explain:'Binary search tree.' },
  { id:'T04', type:'mcq', q:'Traversal of BST that outputs sorted keys?', options:['Pre-order','In-order','Post-order','Level-order'], answer:1, topic:'data_structures', explain:'In-order traversal.' },
  { id:'T05', type:'short', q:'What does O(1) mean?', correctPattern:/constant/i, topic:'complexity', explain:'O(1) — constant time.' },
  { id:'T06', type:'mcq', q:'Which component is shown in the photo?', options:['CPU','RAM','Power supply','Network card'], answer:0, topic:'computer_arch', explain:'CPU area.' },
  { id:'T07', type:'mcq', q:'Main role of CPU cache?', options:['Store files','Speed up access','Provide network','Replace RAM'], answer:1, topic:'computer_arch', explain:'Speeds up access to frequently used data.' },
  { id:'T08', type:'mcq', q:'Which protocol is commonly used for web pages (identify by icon)?', options:['FTP','SMTP','HTTP(S)','POP3'], answer:2, topic:'networks', explain:'HTTP/HTTPS.' },
  { id:'T09', type:'mcq', q:'Default subnet mask for Class C?', options:['255.0.0.0','255.255.0.0','255.255.255.0','255.255.255.255'], answer:2, topic:'networks', explain:'255.255.255.0' },
  { id:'T10', type:'short', q:'What does DHCP stand for?', correctPattern:/dynamic host configuration protocol/i, topic:'networks', explain:'Dynamic Host Configuration Protocol.' },
  { id:'T11', type:'mcq', q:'Semantic HTML element for main content?', options:['div','main','span','section'], answer:1, topic:'web_frontend', explain:'<main> used for primary content.' },
  { id:'T12', type:'mcq', q:'Which event pictured fires when page finished loading? (name it)', options:['onclick','onload','onchange','onsubmit'], answer:1, topic:'web_frontend', explain:'onload' },
  { id:'T13', type:'short', q:'Which Python keyword defines functions?', correctPattern:/^def\b/i, topic:'syntax', explain:'def' },
  { id:'T14', type:'mcq', q:'Declare integer in C++?', options:['int x;','var x;','let x;','number x;'], answer:0, topic:'syntax', explain:'int x;' },
  { id:'T15', type:'mcq', q:'Which SQL clause can you use to filter rows?', options:['ORDER BY','WHERE','GROUP BY','HAVING'], answer:1, topic:'databases', explain:'WHERE filters rows.' },
  { id:'T16', type:'short', q:'SQL command to add row (one word)', correctPattern:/^insert\b/i, topic:'databases', explain:'INSERT' },
  { id:'T17', type:'mcq', q:'Which isolates programs?', options:['Multithreading','Processes/VM','Pointers','Inline'], answer:1, topic:'os', explain:'Processes and virtual memory.' },
  { id:'T18', type:'mcq', q:'Identify the security concept (what is shown?)', options:['Cleartext','Hash+salt','Email','Short pwd'], answer:1, topic:'security', explain:'Hash with salt.' },
  { id:'T19', type:'mcq', q:'True only when both inputs are true?', options:['OR','XOR','NAND','AND'], answer:3, topic:'logic', explain:'AND' },
  { id:'T20', type:'short', q:'Derivative of x^2?', correctPattern:/^2x$/i, topic:'math_school', explain:'2x' },
  { id:'T21', type:'mcq', q:'Which is divide-and-conquer?', options:['Greedy','Divide & conquer','DP','Backtracking'], answer:1, topic:'algorithms', explain:'Divide and conquer.' },
  { id:'T22', type:'short', q:'Bits in a byte?', correctPattern:/^8$/, topic:'computer_arch', explain:'8' },
  { id:'T23', type:'mcq', q:'404 http status means?', options:['200','301','404','500'], answer:2, topic:'web', explain:'Not Found' },
  { id:'T24', type:'mcq', q:'HTTPS default port?', options:['80','22','443','25'], answer:2, topic:'networks', explain:'443' },
  { id:'T25', type:'mcq', q:'Paradigm with objects?', options:['Functional','Procedural','OOP','Declarative'], answer:2, topic:'paradigms', explain:'OOP' },
  { id:'T26', type:'mcq', q:'Unit tests verify?', options:['Whole system','Functions','UI only','Deployment'], answer:1, topic:'swe', explain:'Functions/methods' },
  { id:'T27', type:'mcq', q:'Which SQL JOIN returns matching rows only?', options:['LEFT','RIGHT','INNER','CROSS'], answer:2, topic:'databases', explain:'INNER JOIN' },
  { id:'T28', type:'short', q:'Attack injecting script acronym?', correctPattern:/^xss$/i, topic:'security', explain:'XSS' },
  { id:'T29', type:'mcq', q:'Compiler stage that produces assembly?', options:['Lex','Parse','Code gen','Link'], answer:2, topic:'compilers', explain:'Code generation' },
  { id:'T30', type:'short', q:'If many wrong answers on a topic — what to do?', correctPattern:/practice|exercises|theory|basics|examples/i, topic:'learning_advice', explain:'Practice and review examples.' }
];

const PRACTICE_30 = [
  { id:'P01', type:'mcq', q:'Which IP class has default mask 255.0.0.0?', options:['Class A','Class B','Class C','Class D'], answer:0, topic:'networks', explain:'Class A' },
  { id:'P02', type:'mcq', q:'Network for 192.168.1.130/25?', options:['192.168.1.128','192.168.1.0','192.168.1.64','192.168.1.192'], answer:0, topic:'networks', explain:'/25 -> 192.168.1.128' },
  { id:'P03', type:'mcq', q:'Which command shows routing table on Linux (identify the command)?', options:['ifconfig','route -n / ip route','ping','netstat -tuln'], answer:1, topic:'networks', explain:'route -n or ip route' },
  { id:'P04', type:'short', q:'CIDR /26 => subnet mask?', correctPattern:/^255\.255\.255\.192$/, topic:'networks', explain:'/26' },
  { id:'P05', type:'mcq', q:'Usable hosts in /29?', options:['2','6','8','14'], answer:1, topic:'networks', explain:'6 usable' },
  { id:'P06', type:'short', q:'Network prefix for 10.0.5.7 mask 255.255.0.0?', correctPattern:/^10\.0\.0\.0$/, topic:'networks', explain:'10.0.0.0' },
  { id:'P07', type:'mcq', q:'HTTP method to delete resource?', options:['GET','POST','PUT','DELETE'], answer:3, topic:'web', explain:'DELETE' },
  { id:'P08', type:'short', q:'CSS selector for class "card"?', correctPattern:/^\.card$/, topic:'css', explain:'.card' },
  { id:'P09', type:'mcq', q:'Which tag is used for JavaScript?', options:['<script>','<js>','<code>','<javascript>'], answer:0, topic:'html', explain:'<script>' },
  { id:'P10', type:'short', q:'SQL keyword to remove rows but keep table (one word)?', correctPattern:/^truncate\b/i, topic:'sql', explain:'TRUNCATE' },
  { id:'P11', type:'mcq', q:'Limit rows after ordering?', options:['WHERE','GROUP BY','HAVING','LIMIT'], answer:3, topic:'sql', explain:'LIMIT' },
  { id:'P12', type:'short', q:'Address-of operator in C++?', correctPattern:/^&$/, topic:'cpp', explain:'&' },
  { id:'P13', type:'mcq', q:'Common API response format?', options:['XML','JSON','YAML','INI'], answer:1, topic:'web', explain:'JSON' },
  { id:'P14', type:'code', q:'(JS) Sum of two integers from input (newline separated).', code:{ tests:[{ input:'2\n3\n', expected:'5' },{ input:'10\n-2\n', expected:'8' }], language:'js' }, topic:'programming', explain:'Return sum' },
  { id:'P15', type:'code', q:'(JS) Square integer n from input.', code:{ tests:[{ input:'4\n', expected:'16' },{ input:'0\n', expected:'0' }], language:'js' }, topic:'programming', explain:'n*n' },
  { id:'P16', type:'mcq', q:'What is console.log(typeof []) in JS?', options:['object','array','list','vector'], answer:0, topic:'javascript', explain:'Array typeof object' },
  { id:'P17', type:'mcq', q:'Server error status codes are?', options:['2xx','3xx','4xx','5xx'], answer:3, topic:'web', explain:'5xx' },
  { id:'P18', type:'mcq', q:'Default SSH port?', options:['21','22','80','443'], answer:1, topic:'networks', explain:'22' },
  { id:'P19', type:'short', q:'Name for domain->IP resolution (one word)', correctPattern:/^dns$/i, topic:'networks', explain:'DNS' },
  { id:'P20', type:'code', q:'(JS) Reverse single word from input.', code:{ tests:[{ input:'hello\n', expected:'olleh' },{ input:'a\n', expected:'a' }], language:'js' }, topic:'programming', explain:'Reverse' },
  { id:'P21', type:'mcq', q:'Which is relational DB?', options:['MongoDB','MySQL','Redis','Elastic'], answer:1, topic:'databases', explain:'MySQL' },
  { id:'P22', type:'short', q:'Purpose of HTTP cookie (short phrase)', correctPattern:/session|auth|track|store/i, topic:'web', explain:'Session/auth/tracking' },
  { id:'P23', type:'mcq', q:'Git: create and switch branch?', options:['git branch','git checkout -b','git switch','git init'], answer:1, topic:'git', explain:'git checkout -b' },
  { id:'P24', type:'short', q:'Decimal of binary 10110?', correctPattern:/^22$/, topic:'binary', explain:'22' },
  { id:'P25', type:'mcq', q:'Not a programming paradigm?', options:['Functional','OOP','Procedural','Rectangular'], answer:3, topic:'paradigms', explain:'Rectangular not paradigm' },
  { id:'P26', type:'short', q:'CSS property to set font size (one word)', correctPattern:/^font-size$/i, topic:'css', explain:'font-size' },
  { id:'P27', type:'mcq', q:'Best for in-memory key-value fast access?', options:['Relational DB','Redis','CSV','XML'], answer:1, topic:'systems', explain:'Redis' },
  { id:'P28', type:'short', q:'Python loop keyword (one word)', correctPattern:/^for$/i, topic:'python', explain:'for' },
  { id:'P29', type:'mcq', q:'Which OSI layer routes?', options:['Transport','Network','Data link','Physical'], answer:1, topic:'networks', explain:'Network layer' },
  { id:'P30', type:'code', q:'(JS) Read a b, print YES if a divisible by b else NO', code:{ tests:[{ input:'6 3\n', expected:'YES' },{ input:'7 3\n', expected:'NO' }], language:'js' }, topic:'programming', explain:'Divisibility check' }
];

const MIXED_30 = [...THEORY_30.slice(0,15), ...PRACTICE_30.slice(0,15)];
const BANK = { 'informatics_theory': THEORY_30, 'informatics_practice': PRACTICE_30, 'informatics_mixed': MIXED_30 };

/* ======= Ensure only T01 keeps image; others that were 'image' become 'mcq' (no img) ======= */
(function normalizeImages(){
  Object.keys(BANK).forEach(cat=>{
    BANK[cat].forEach(q=>{
      if(!q) return;
      if(q.type === 'image'){
        if(q.id === 'T01'){
          // keep T01 image (already has GIF URL)
          return;
        }
        // convert to mcq (no image) — if it had options keep them, otherwise keep as mcq with placeholder
        q.type = 'mcq';
        if(q.img) delete q.img;
      }
    });
  });
})();

/* ======= Q_TRANSLATIONS: translations for all questions (ru + kk) ======= */
/* (Same translations as before; abbreviated here for brevity but include all needed translations) */
const Q_TRANSLATIONS = {
  'T01': {
    ru:{ q:'Определите визуализацию алгоритма (какая сортировка показана?)', options:['Быстрая сортировка','Сортировка слиянием','Сортировка выбором','Пузырьковая'] },
    kk:{ q:'Алгоритмнің визуализациясын анықтаңыз (қандай сұрыптау көрсетілген?)', options:['Quick sort (жылдам сұрыптау)','Merge sort (қосып сұрыптау)','Selection sort','Bubble sort'] }
  },
  'T02': { ru:{ q:'Какова временная сложность бинарного поиска в отсортированном массиве?', options:['O(n)','O(log n)','O(n log n)','O(1)'] }, kk:{ q:'Сұрыпталған массивтегі екілік іздеудің уақыт күрделілігі қандай?', options:['O(n)','O(log n)','O(n log n)','O(1)'] } },
  'T03': { ru:{ q:'Определите структуру данных (что изображено?)', options:['Массив','Хеш-таблица','Двоичное дерево поиска','Связный список'] }, kk:{ q:'Бұл қандай деректер құрылымы (суретте не көрсетілген?)', options:['Массив','Хеш-кесте','BST (екілік іздеу ағашы)','Байланысқан тізім'] } },
  'T04': { ru:{ q:'Какой обход BST выдаёт отсортированные ключи?', options:['Pre-order','In-order','Post-order','Level-order'] }, kk:{ q:'BST-ті қандай өту кілттерді сұрыпталған түрде береді?', options:['Pre-order','In-order','Post-order','Level-order'] } },
  'T05': { ru:{ q:'Что означает O(1)?' }, kk:{ q:'O(1) не білдіреді?' } },
  'T06': { ru:{ q:'Какой компонент показан?', options:['CPU','RAM','Блок питания','Сетевая карта'] }, kk:{ q:'Суретте қандай компонент көрсетілген?', options:['CPU','RAM','Қуат көзі','Желі картасы'] } },
  'T07': { ru:{ q:'Основная роль кэша CPU?', options:['Хранить файлы','Ускорять доступ','Обеспечивать сеть','Заменять ОЗУ'] }, kk:{ q:'CPU кэшінің негізгі рөлі қандай?', options:['Файлдарды сақтау','Қол жеткізуді жеделдету','Желіні қамтамасыз ету','ОЗУ-ды алмастыру'] } },
  'T08': { ru:{ q:'Какой протокол обычно используется для веб-страниц?', options:['FTP','SMTP','HTTP(S)','POP3'] }, kk:{ q:'Веб-беттер үшін қандай протокол әдетте қолданылады?', options:['FTP','SMTP','HTTP(S)','POP3'] } },
  'T09': { ru:{ q:'Маска подсети по умолчанию для класса C?', options:['255.0.0.0','255.255.0.0','255.255.255.0','255.255.255.255'] }, kk:{ q:'C классының әдепкі маскасы қандай?', options:['255.0.0.0','255.255.0.0','255.255.255.0','255.255.255.255'] } },
  'T10': { ru:{ q:'Что означает DHCP?' }, kk:{ q:'DHCP қысқартуы не?' } },
  'T11': { ru:{ q:'Какой семантический HTML-элемент для основного содержимого?', options:['div','main','span','section'] }, kk:{ q:'Басты контент үшін қандай семантикалық HTML элемент қолданылады?', options:['div','main','span','section'] } },
  'T12': { ru:{ q:'Какое событие срабатывает при полной загрузке страницы?', options:['onclick','onload','onchange','onsubmit'] }, kk:{ q:'Бет толығымен жүктелгенде қандай оқиға орын алады?', options:['onclick','onload','onchange','onsubmit'] } },
  'T13': { ru:{ q:'Какое ключевое слово в Python объявляет функцию?' }, kk:{ q:'Python-да функцияны анықтайтын кілт сөз қандай?' } },
  'T14': { ru:{ q:'Как объявить целое число в C++?', options:['int x;','var x;','let x;','number x;'] }, kk:{ q:'C++-та бүтін айнымалы қалай жарияланады?', options:['int x;','var x;','let x;','number x;'] } },
  'T15': { ru:{ q:'Какая SQL-условие фильтрует строки?', options:['ORDER BY','WHERE','GROUP BY','HAVING'] }, kk:{ q:'Қай SQL тармағы жолдарды сүзуге арналған?', options:['ORDER BY','WHERE','GROUP BY','HAVING'] } },
  'T16': { ru:{ q:'SQL-команда для добавления строки (одно слово)?' }, kk:{ q:'Кестеге жол қосатын SQL пәрмені (1 сөз)?' } },
  'T17': { ru:{ q:'Что изолирует программы?', options:['Multithreading','Processes/VM','Pointers','Inline'] }, kk:{ q:'Бағдарламаларды не бөліп көрсетеді?', options:['Multithreading','Processes/VM','Pointers','Inline'] } },
  'T18': { ru:{ q:'Определите концепцию безопасности', options:['Plaintext','Hash+salt','Email','Short pwd'] }, kk:{ q:'Қауіпсіздік концепциясын анықтаңыз', options:['Plaintext','Hash+salt','Email','Short pwd'] } },
  'T19': { ru:{ q:'Истинно только когда оба входа истинны?', options:['OR','XOR','NAND','AND'] }, kk:{ q:'Екі кіріс те шын болғанда ғана ма?', options:['OR','XOR','NAND','AND'] } },
  'T20': { ru:{ q:'Производная x^2?' }, kk:{ q:'x^2 туындысы қандай?' } },
  'T21': { ru:{ q:'Какой подход — divide-and-conquer?', options:['Greedy','Divide & conquer','DP','Backtracking'] }, kk:{ q:'Divide-and-conquer тәсілі қайсы?', options:['Greedy','Divide & conquer','DP','Backtracking'] } },
  'T22': { ru:{ q:'Сколько бит в байте?' }, kk:{ q:'Байтта қанша бит бар?' } },
  'T23': { ru:{ q:'Что означает HTTP код 404?', options:['200','301','404','500'] }, kk:{ q:'HTTP 404 коды нені білдіреді?', options:['200','301','404','500'] } },
  'T24': { ru:{ q:'Порт по умолчанию для HTTPS?', options:['80','22','443','25'] }, kk:{ q:'HTTPS үшін әдепкі порт қандай?', options:['80','22','443','25'] } },
  'T25': { ru:{ q:'Парадигма с объектами?', options:['Functional','Procedural','OOP','Declarative'] }, kk:{ q:'Объектілермен жұмыс жасайтын парадигма?', options:['Functional','Procedural','OOP','Declarative'] } },
  'T26': { ru:{ q:'Что проверяют unit-тесты?', options:['Whole system','Functions','UI only','Deployment'] }, kk:{ q:'Unit-тесттер не нәрсені тексереді?', options:['Whole system','Functions','UI only','Deployment'] } },
  'T27': { ru:{ q:'Какой JOIN возвращает только совпадающие строки?', options:['LEFT','RIGHT','INNER','CROSS'] }, kk:{ q:'Қай JOIN тек сәйкес жазбаларды қайтарады?', options:['LEFT','RIGHT','INNER','CROSS'] } },
  'T28': { ru:{ q:'Атака, вставляющая скрипт (аббревиатура)?' }, kk:{ q:'Скрипт енгізетін шабуыл (аббревиатура)?' } },
  'T29': { ru:{ q:'Какая стадия компилятора производит ассемблер?', options:['Lex','Parse','Code gen','Link'] }, kk:{ q:'Компилятордың қай кезеңі ассемблер шығарады?', options:['Lex','Parse','Code gen','Link'] } },
  'T30': { ru:{ q:'Если много ошибок по теме — что делать?', options:['Practice','Exercises','Theory','Examples'] }, kk:{ q:'Егер бір тақырыпта көптеген қателіктер болса — не істеу керек?', options:['Practice','Exercises','Theory','Examples'] } },

  /* practice translations abbreviated similarly... (P01..P30) */
  'P01': { ru:{ q:'Какой класс IP имеет маску по умолчанию 255.0.0.0?', options:['Class A','Class B','Class C','Class D'] }, kk:{ q:'Қай IP класының әдепкі маскасы 255.0.0.0?', options:['Class A','Class B','Class C','Class D'] } },
  'P02': { ru:{ q:'Сеть для 192.168.1.130/25?', options:['192.168.1.128','192.168.1.0','192.168.1.64','192.168.1.192'] }, kk:{ q:'192.168.1.130/25 үшін желі қандай?', options:['192.168.1.128','192.168.1.0','192.168.1.64','192.168.1.192'] } },
  'P03': { ru:{ q:'Какая команда показывает таблицу маршрутизации в Linux?', options:['ifconfig','route -n / ip route','ping','netstat -tuln'] }, kk:{ q:'Linux-та бағыттау кестесін қай пәрмен көрсетеді?', options:['ifconfig','route -n / ip route','ping','netstat -tuln'] } },
  'P04': { ru:{ q:'CIDR /26 => маска подсети?' }, kk:{ q:'/26 CIDR үшін маска қандай?' } },
  'P05': { ru:{ q:'Сколько доступных хостов в /29?', options:['2','6','8','14'] }, kk:{ q:'/29-да қанша қолданушы хост бар?', options:['2','6','8','14'] } },
  'P06': { ru:{ q:'Network prefix для 10.0.5.7 с маской 255.255.0.0?' }, kk:{ q:'10.0.5.7 маскасы 255.255.0.0 болғандағы желілік префикс?' } },
  'P07': { ru:{ q:'HTTP-метод для удаления ресурса?', options:['GET','POST','PUT','DELETE'] }, kk:{ q:'Ресурсты жою үшін HTTP әдісі?', options:['GET','POST','PUT','DELETE'] } },
  'P08': { ru:{ q:'CSS-селектор для класса "card"?' }, kk:{ q:'".card" класы үшін CSS селекторы қандай?' } },
  'P09': { ru:{ q:'Какой тег используется для JavaScript?', options:['<script>','<js>','<code>','<javascript>'] }, kk:{ q:'JavaScript үшін қандай тег қолданылады?', options:['<script>','<js>','<code>','<javascript>'] } },
  'P10': { ru:{ q:'SQL-ключевое слово для удаления строк, оставив таблицу (одно слово)?' }, kk:{ q:'Кестені сақтай отырып жолдарды жоятын SQL сөз?' } },
  'P11': { ru:{ q:'Как ограничить количество строк после ORDER BY?', options:['WHERE','GROUP BY','HAVING','LIMIT'] }, kk:{ q:'ORDER BY-дан кейін жолдарды қалай шектеуге болады?', options:['WHERE','GROUP BY','HAVING','LIMIT'] } },
  'P12': { ru:{ q:'Оператор взятия адреса в C++?' }, kk:{ q:'C++-та адрес операторі қандай?' } },
  'P13': { ru:{ q:'Формат ответа API наиболее распространённый?', options:['XML','JSON','YAML','INI'] }, kk:{ q:'API жауап форматтарының қайсысы кең тараған?', options:['XML','JSON','YAML','INI'] } },
  'P14': { ru:{ q:'(JS) Сложите два целых из ввода (с новой строки).' }, kk:{ q:'(JS) Енгізілген екі бүтінді қосып шығарыңыз (жаңа жол арқылы).' } },
  'P15': { ru:{ q:'(JS) Квадрат числа n из ввода.' }, kk:{ q:'(JS) Енгізілген n бүтінінің квадраты.' } },
  'P16': { ru:{ q:'Что возвращает typeof [] в JS?', options:['object','array','list','vector'] }, kk:{ q:'JS-та typeof [] қандай мәнді қайтарады?', options:['object','array','list','vector'] } },
  'P17': { ru:{ q:'Коды ошибок сервера — это?', options:['2xx','3xx','4xx','5xx'] }, kk:{ q:'Сервер қателерінің кодтары қайсысы?', options:['2xx','3xx','4xx','5xx'] } },
  'P18': { ru:{ q:'Порт по умолчанию для SSH?', options:['21','22','80','443'] }, kk:{ q:'SSH үшін әдепкі порт қандай?', options:['21','22','80','443'] } },
  'P19': { ru:{ q:'Название процесса домен->IP (одно слово)' }, kk:{ q:'Доменді IP-ге аудару процесі қалай аталады (1 сөз)?' } },
  'P20': { ru:{ q:'(JS) Развернуть одно слово из ввода.' }, kk:{ q:'(JS) Енгізілген бір сөзді кері айналдыру.' } },
  'P21': { ru:{ q:'Какая база — реляционная?', options:['MongoDB','MySQL','Redis','Elastic'] }, kk:{ q:'Қайсысы реляциялық дерекқоры?', options:['MongoDB','MySQL','Redis','Elastic'] } },
  'P22': { ru:{ q:'Назначение HTTP-cookie (коротко)?' }, kk:{ q:'HTTP-cookie не үшін қолданылады (қысқаша)?' } },
  'P23': { ru:{ q:'Git: создать и перейти на ветку?', options:['git branch','git checkout -b','git switch','git init'] }, kk:{ q:'Git: тармақ жасау және өту қандай команда?', options:['git branch','git checkout -b','git switch','git init'] } },
  'P24': { ru:{ q:'Десятичное значение бинарного 10110?' }, kk:{ q:'10110 екілік санының ондық мәні?' } },
  'P25': { ru:{ q:'Что не является парадигмой программирования?', options:['Functional','OOP','Procedural','Rectangular'] }, kk:{ q:'Қайсысы бағдарламалау парадигмасы емес?', options:['Functional','OOP','Procedural','Rectangular'] } },
  'P26': { ru:{ q:'Свойство CSS для размера шрифта (одно слово)' }, kk:{ q:'Шрифт өлшемін орнататын CSS қасиеті (1 сөз)' } },
  'P27': { ru:{ q:'Лучший выбор для быстро доступа key-value в памяти?', options:['Relational DB','Redis','CSV','XML'] }, kk:{ q:'Жедел кілт-бағдарламалық деректер үшін не жақсы?', options:['Relational DB','Redis','CSV','XML'] } },
  'P28': { ru:{ q:'Ключевое слово цикла в Python (одно слово)' }, kk:{ q:'Python-дағы цикл кілт сөзі (1 сөз)' } },
  'P29': { ru:{ q:'Какая OSI-уровень осуществляет маршрутизацию?', options:['Transport','Network','Data link','Physical'] }, kk:{ q:'OSI модельінің қай қабаты бағыттайды?', options:['Transport','Network','Data link','Physical'] } },
  'P30': { ru:{ q:'(JS) Прочитать a b, вывести YES если a делится на b, иначе NO' }, kk:{ q:'(JS) a мен b оқып, a b-ге бөлінсе YES басып, әйтпесе NO шығару' } }
};

/* ======= Rendering helpers ======= */
function renderMCQ(it, idx){
  const opts = it.options ? it.options.map((o,j)=>`<div class="form-check"><input class="form-check-input" id="q${idx}o${j}" name="q${idx}" type="radio" value="${j}" required><label class="form-check-label" for="q${idx}o${j}">${_esc(o)}</label></div>`).join('') : '';
  return `<div class="mb-3 quiz-card card p-3"><h5>Q${idx+1}. ${_esc(it.q)}</h5>${opts}</div>`;
}
function renderShort(it, idx){
  return `<div class="mb-3 quiz-card card p-3"><h5>Q${idx+1}. ${_esc(it.q)}</h5><input type="text" name="q${idx}" class="form-control mt-2" required></div>`;
}
function renderImage(it, idx){
  // only T01 uses image path; others converted to mcq so won't reach here
  const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="360"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#64748b">${_esc(t('imageUnavailable'))}</text></svg>`);
  const imgTag = it.img ? `<img src="${it.img}" alt="${_esc(it.q)}" loading="lazy" style="width:100%;max-height:360px;object-fit:contain;border-radius:6px;margin-bottom:10px;box-shadow:0 6px 18px rgba(12,12,20,0.06)" onerror="this.onerror=null;this.src='${placeholder}';">` : '';
  const opts = it.options ? it.options.map((o,j)=>`<div class="form-check"><input class="form-check-input" id="q${idx}o${j}" name="q${idx}" type="radio" value="${j}" required><label class="form-check-label" for="q${idx}o${j}">${_esc(o)}</label></div>`).join('') : '';
  return `<div class="mb-3 quiz-card card p-3"><h5>Q${idx+1}. ${_esc(it.q)}</h5>${imgTag}${opts}</div>`;
}
function renderCode(it, idx){
  return `<div class="mb-3 quiz-card card p-3"><h5>Q${idx+1}. ${_esc(it.q)}</h5><small class="text-muted">Write JS: function solve(input){...}</small><textarea name="q${idx}" rows="6" class="form-control mt-2" placeholder="// function solve(input){ ... }"></textarea></div>`;
}
function renderQuestion(it, idx){
  if(it.type==='mcq') return renderMCQ(it, idx);
  if(it.type==='image') return renderImage(it, idx);
  if(it.type==='short') return renderShort(it, idx);
  if(it.type==='code') return renderCode(it, idx);
  return '';
}

/* ======= JS runner for code questions ======= */
function runUserJS(userCode, input){
  try {
    const wrapped = `(function(){ ${userCode}; return typeof solve === 'function' ? (''+solve(${JSON.stringify(input)})) : '__NO_SOLVE__'; })()`;
    // eslint-disable-next-line no-eval
    const res = eval(wrapped);
    return { ok:true, output:String(res) };
  } catch(err){
    return { ok:false, error: err && err.message ? err.message : String(err) };
  }
}

/* ======= Save to localStorage (old + new formats) ======= */
function saveResultToStorage(saveObj){
  try {
    try {
      const oldKey = 'edu_history';
      const rawOld = localStorage.getItem(oldKey);
      const arrOld = rawOld ? JSON.parse(rawOld) : [];
      const oldEntry = {
        timestamp: saveObj.ts || nowISO(),
        user: saveObj.user || (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
        category: saveObj.category || saveObj.cat || 'undefined',
        score: saveObj.score || `${saveObj.correct || 0}/${saveObj.total || 0}`,
        percent: saveObj.percent == null ? null : saveObj.percent,
        level: saveObj.level || null
      };
      arrOld.push(oldEntry);
      if(arrOld.length > 1000) arrOld.shift();
      localStorage.setItem(oldKey, JSON.stringify(arrOld));
    } catch(e){ console.warn('save old format failed', e); }

    try {
      const newKey = 'quiz_history_v1';
      const rawNew = localStorage.getItem(newKey);
      const arrNew = rawNew ? JSON.parse(rawNew) : [];
      const newEntry = {
        ts: saveObj.ts || nowISO(),
        user: saveObj.user || (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
        category: saveObj.category || saveObj.cat || 'undefined',
        score: saveObj.score || `${saveObj.correct || 0}/${saveObj.total || 0}`,
        percent: saveObj.percent == null ? null : saveObj.percent,
        topicBreakdown: saveObj.topicBreakdown || {},
        level: saveObj.level || null,
        levelFeedback: saveObj.levelFeedback || null
      };
      arrNew.push(newEntry);
      if(arrNew.length > 2000) arrNew.shift();
      localStorage.setItem(newKey, JSON.stringify(arrNew));
    } catch(e){ console.warn('save new format failed', e); }

    try {
      const cu = localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || null);
      if(cu){
        const k = `history_user_${cu}`;
        const r = localStorage.getItem(k);
        const arr = r ? JSON.parse(r) : [];
        arr.push({
          ts: saveObj.ts || nowISO(),
          category: saveObj.category || saveObj.cat || 'undefined',
          score: saveObj.score || `${saveObj.correct || 0}/${saveObj.total || 0}`,
          percent: saveObj.percent == null ? null : saveObj.percent,
          topicBreakdown: saveObj.topicBreakdown || {},
          level: saveObj.level || null,
          levelFeedback: saveObj.levelFeedback || null
        });
        localStorage.setItem(k, JSON.stringify(arr));
      }
    } catch(e){ /* ignore */ }
  } catch(e){ console.error('saveResultToStorage failed', e); }
}

/* ======= Level helpers ======= */
function computeLevel(percent){
  if(percent >= 90) return 'A';
  if(percent >= 75) return 'B';
  if(percent >= 60) return 'C';
  if(percent >= 40) return 'D';
  return 'F';
}
function getLevelTextLocalized(level){
  const keyMap = { A:'excellent', B:'verygood', C:'satisfactory', D:'belowavg', F:'beginner' };
  return t(keyMap[level] || 'beginner');
}
function getLevelAsset(level){ return LEVEL_ASSETS[level] || LEVEL_ASSETS.F; }

/* ======= Apply translations to questions if Q_TRANSLATIONS has entries ======= */
function applyQuestionTranslations(questions){
  const lang = getLang();
  if(lang === 'en') return questions;
  return questions.map(q=>{
    const tr = Q_TRANSLATIONS[q.id];
    if(tr && tr[lang]){
      const nq = Object.assign({}, q);
      if(tr[lang].q) nq.q = tr[lang].q;
      if(Array.isArray(tr[lang].options) && tr[lang].options.length) nq.options = tr[lang].options;
      return nq;
    }
    return q;
  });
}

/* ======= Controls builder: language selector + Start button ======= */
function prepareControls(category){
  let controls = document.getElementById('quizControls');
  if(!controls){
    controls = document.createElement('div');
    controls.id = 'quizControls';
    controls.className = 'mb-3';
    const main = document.getElementById('quizMount') || document.querySelector('.quiz-form') || document.querySelector('main');
    if(main) main.parentNode.insertBefore(controls, main);
    else document.body.insertBefore(controls, document.body.firstChild);
  }

  controls.innerHTML = `
    <div class="card p-3 mb-3">
      <div class="d-flex flex-wrap align-items-center gap-3">
        <div><strong>${_esc(t('selectLang'))}:</strong></div>
        <div>
          <div class="btn-group" role="group" aria-label="language">
            <button type="button" class="btn btn-outline-primary btn-sm" data-lang="en">EN</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-lang="ru">RU</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-lang="kk">KK</button>
          </div>
        </div>
        <div class="ms-auto">
          <button id="startQuizBtn" class="btn btn-primary">${_esc(t('startTest'))}</button>
        </div>
      </div>
    </div>
  `;

  controls.querySelectorAll('[data-lang]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const lang = b.getAttribute('data-lang') || 'en';
      setLang(lang);
      controls.querySelectorAll('[data-lang]').forEach(x=> x.classList.toggle('active', x.getAttribute('data-lang')===lang));
      const sBtn = document.getElementById('startQuizBtn');
      if(sBtn) sBtn.textContent = t('startTest');
    });
  });

  const cur = getLang();
  controls.querySelectorAll('[data-lang]').forEach(x=> x.classList.toggle('active', x.getAttribute('data-lang')===cur));

  const startBtn = document.getElementById('startQuizBtn');
  if(startBtn){
    startBtn.onclick = function(){
      startQuiz(category);
      controls.style.display = 'none';
    };
  }
}

/* ======= startQuiz(category) ======= */
function startQuiz(category){
  const mount = document.getElementById('quizMount');
  const form = document.getElementById('quizForm');
  const result = document.getElementById('quizResult');
  if(!mount || !form || !result){ console.error('Quiz DOM nodes missing (quizMount, quizForm, quizResult required)'); return; }

  window.selectedCategoryGlobal = category || window.selectedCategoryGlobal || 'informatics_theory';

  const bank = BANK[window.selectedCategoryGlobal] || BANK['informatics_theory'];
  let chosen = shuffle(bank).slice(0, Math.min(30, bank.length));
  chosen = applyQuestionTranslations(chosen);
  form._questions = chosen;

  mount.innerHTML = chosen.map((q,i)=> renderQuestion(q,i)).join('');
  result.innerHTML = '';

  setTimeout(()=>{ const f = mount.querySelector('input, textarea, select'); if(f) f.focus(); }, 80);

  if(form._handler) form.removeEventListener('submit', form._handler);

  form._handler = function(e){
    e.preventDefault();
    const data = new FormData(form);
    let total = 0, correctCount = 0;
    const topicStats = {};

    chosen.forEach((q, idx)=>{
      total++;
      topicStats[q.topic] = topicStats[q.topic] || { total:0, correct:0 };
      topicStats[q.topic].total++;

      if(q.type === 'mcq' || q.type === 'image'){
        const raw = data.get(`q${idx}`);
        const chosenIdx = raw === null ? null : parseInt(raw, 10);
        const ok = chosenIdx !== null && chosenIdx === q.answer;
        if(ok){ correctCount++; topicStats[q.topic].correct++; }
      } else if(q.type === 'short'){
        const raw = (data.get(`q${idx}`) || '').trim();
        let ok = false;
        if(q.correctPattern instanceof RegExp) ok = q.correctPattern.test(raw);
        else ok = String(raw).toLowerCase() === String(q.answer).toLowerCase();
        if(ok){ correctCount++; topicStats[q.topic].correct++; }
      } else if(q.type === 'code'){
        const userCode = data.get(`q${idx}`) || '';
        const tests = (q.code && q.code.tests) || [];
        let passed = 0;
        for(const t of tests){
          const r = runUserJS(userCode, t.input);
          if(r.ok){
            const got = String(r.output).trim();
            const expect = String(t.expected).trim();
            if(got === expect) passed++;
          }
        }
        if(passed === tests.length){ correctCount++; topicStats[q.topic].correct++; }
      }
    });

    const percent = Math.round((correctCount / Math.max(1, total)) * 100);
    const level = computeLevel(percent);
    const levelText = getLevelTextLocalized(level);
    const levelAsset = getLevelAsset(level);
    const fact = randChoice(FUN_FACTS);

    result.innerHTML = `
      <div class="card p-3 mb-3">
        <div class="d-flex gap-3 align-items-start" style="flex-wrap:wrap">
          <div style="flex:0 0 420px; min-width:260px;">
            <div class="alert ${percent>=70? 'alert-success':'alert-warning'}"><strong>${_esc(t('result'))}:</strong> ${percent}% (${correctCount}/${total}) — <em>${_esc(level)}</em></div>
            <div><strong>${_esc(t('levelLabel'))}:</strong> ${_esc(level)} — ${_esc(t(levelAsset.titleKey))}</div>
            <div class="mt-2">${_esc(levelText)}</div>
            <div class="mt-2"><strong>${_esc(t('randomFact'))}:</strong> ${_esc(fact)}</div>
          </div>
          <div style="flex:1; text-align:center; min-width:220px;">
            <img src="${levelAsset.img}" alt="${_esc(level)}" style="max-width:100%; border-radius:8px; box-shadow:0 8px 24px rgba(12,12,20,0.12)">
          </div>
        </div>

        <div class="mt-3 d-flex gap-2">
          <button id="nextAfterBtn" class="btn btn-primary btn-sm">${_esc(t('nextTest'))}</button>
          <a id="backHomeBtn" class="btn btn-outline-secondary btn-sm" href="index.html">${_esc(t('backHome'))}</a>
        </div>
      </div>
    `;

    saveResultToStorage({
      ts: nowISO(),
      category: window.selectedCategoryGlobal || 'informatics_theory',
      score: `${correctCount}/${total}`,
      correct: correctCount,
      total: total,
      percent: percent,
      topicBreakdown: topicStats,
      level: level,
      levelFeedback: { text: levelText, fact, img: levelAsset.img }
    });

    const order = ['informatics_theory','informatics_practice','informatics_mixed'];
    const nextBtn = document.getElementById('nextAfterBtn');
    if(nextBtn){
      nextBtn.addEventListener('click', ()=>{
        const current = window.selectedCategoryGlobal || 'informatics_theory';
        const idx = order.indexOf(current);
        const nextIdx = (idx === -1) ? 0 : (idx + 1) % order.length;
        const nextCat = order[nextIdx];
        const controls = document.getElementById('quizControls');
        if(controls) controls.style.display = '';
        window.selectedCategoryGlobal = nextCat;
        prepareControls(nextCat);
        result.innerHTML = '';
        document.getElementById('quizMount').innerHTML = '';
      }, { once: true });
    }
  };

  form.addEventListener('submit', form._handler);
}

/* ======= Auto-init: controls and optional autostart support ======= */
document.addEventListener('DOMContentLoaded', function(){
  const p = new URLSearchParams(window.location.search);
  const cat = p.get('cat') || 'informatics_theory';
  const autostart = p.get('autostart') === '1';
  prepareControls(cat);
  if(autostart){
    const lang = localStorage.getItem('edu_lang') || 'en';
    setLang(lang);
    const controls = document.getElementById('quizControls');
    if(controls) controls.style.display = 'none';
    setTimeout(()=> startQuiz(cat), 180);
  }
});

/* ======= expose startQuiz (if needed elsewhere) ======= */
window.startQuiz = startQuiz;
