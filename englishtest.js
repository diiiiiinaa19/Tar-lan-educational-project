// englishtest.js - улучшенная версия с Grammar/Vocabulary/Reading (дизайн не меняется)
document.addEventListener("DOMContentLoaded", () => {
  const quizMount = document.getElementById("quizMount");
  const quizForm = document.getElementById("quizForm");
  const quizResult = document.getElementById("quizResult");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const selectedTypeSpan = document.querySelector('#selectedType span');

  // Банк вопросов по типам
  const allQuestions = {
    // GRAMMAR вопросы
    grammar: [
      { q: "I ______ bus on Mondays.", options: ["'m going to work wit", "'m going to work by", "go to work with", "go to work by"], answer: 3, topic: 'grammar_tenses' },
      { q: "Sorry, but this chair is ______.", options: ["me", "mine", "my", "our"], answer: 1, topic: 'grammar_pronouns' },
      { q: "How old ______? — I ______.", options: ["are you / am 20 years old", "have you / have 20 years old", "are you / am 20 years", "do you have / have 20 years"], answer: 0, topic: 'grammar_tenses' },
      { q: "I ______ to the cinema.", options: ["not usually go", "don't usually go", "don't go usually", "do not go usually"], answer: 1, topic: 'grammar_negatives' },
      { q: "Where ______ ?", options: ["your sister works", "your sister work", "does your sister work", "do your sister work"], answer: 2, topic: 'grammar_questions' },
      { q: "The test is ______ February.", options: ["in", "at", "on", "over"], answer: 0, topic: 'grammar_prepositions' },
      { q: "I eat pasta ______ week.", options: ["twice in a", "twice a", "one time a", "once in a"], answer: 1, topic: 'grammar_adverbs' },
      { q: "I don't have ______ free time.", options: ["many", "any", "a lot", "some"], answer: 1, topic: 'grammar_quantifiers' },
      { q: "_____ to the cinema tomorrow?", options: ["We will go", "Do we go", "We go", "Shall we go"], answer: 3, topic: 'grammar_future' },
      { q: "We went to the market ______ some vegetables.", options: ["to buy", "for buy", "for to buy", "for buying"], answer: 0, topic: 'grammar_infinitives' },
      { q: "When you called I ______ a shower.", options: ["had", "did have", "was having", "were having"], answer: 2, topic: 'grammar_past_continuous' },
      { q: "______ are very friendly and very intelligent.", options: ["Dolphins", "The dolphins", "A dolphin", "The dolphin"], answer: 0, topic: 'grammar_articles' },
      { q: "Somebody stole ______ yesterday.", options: ["the car of my moter", "my car mother", "my mother's car", "my mother car"], answer: 2, topic: 'grammar_possessives' },
      { q: "She is ______ her sister.", options: ["more happier than", "more happy that", "happier that", "happier than"], answer: 3, topic: 'grammar_comparatives' },
      { q: "I couldn't eat ______ before the exam.", options: ["nothing", "anything", "everything", "something"], answer: 1, topic: 'grammar_pronouns' },
      { q: "Please, pass me the remote. ______ TV.", options: ["I'm watching", "I will watch", "I'm going to watch", "I might watch"], answer: 0, topic: 'grammar_present_continuous' },
      { q: "I'll call you when I ______ home.", options: ["arrive", "'m going to arrive", "will arrive", "arrived"], answer: 0, topic: 'grammar_time_clauses' },
      { q: "______ Japan?", options: ["Have you ever gone in", "Do you have been in", "Have you ever been to", "Have you ever been into"], answer: 2, topic: 'grammar_present_perfect' },
      { q: "He drives very ______.", options: ["slow", "slower", "more sloly", "slowly"], answer: 3, topic: 'grammar_adverbs' },
      { q: "If I ______ you, I wouldn't do it.", options: ["was", "were", "would be", "am"], answer: 1, topic: 'grammar_conditionals' },
      { q: "We couldn't find a taxi, ______ we walked home.", options: ["so", "because", "but", "although"], answer: 0, topic: 'grammar_conjunctions' },
      { q: "Tomorrow I ______ get up early; it's my day off.", options: ["mustn't", "must", "haven't to", "don't have to"], answer: 3, topic: 'grammar_modals' },
      { q: "I ______ this coffee. It tastes horrible.", options: ["am not like", "don't like", "'m not liking", "not like"], answer: 1, topic: 'grammar_present_simple' },
      { q: "We ______ yesterday.", options: ["arrived", "did arrive", "have arrive", "have arrived"], answer: 0, topic: 'grammar_past_simple' },
      { q: "'We don't have any milk.' — 'Really? I ______ more.'", options: ["'m going to buy", "'ll buy", "'m buying", "buy"], answer: 1, topic: 'grammar_future' },
      { q: "German ______ in Germany, Austria and Switzerland.", options: ["is spoken", "spoken", "speaks", "is speak"], answer: 0, topic: 'grammar_passive' },
      { q: "If I tell you a secret, ______ anyone?", options: ["are you tell", "do you tell", "will you tell", "are you telling"], answer: 2, topic: 'grammar_conditionals' },
      { q: "She is the same age ______ me.", options: ["than", "that", "what", "as"], answer: 3, topic: 'grammar_comparatives' },
      { q: "It's obvious that you...", options: ["don't drive as faster as me", "drive faster than me", "drive more fast than I", "drive no faster than I"], answer: 1, topic: 'grammar_comparatives' },
      { q: "The boat sank, but they ______ swim to the shore.", options: ["could", "were able to", "can", "abled to"], answer: 1, topic: 'grammar_modals' }
    ],

    // VOCABULARY вопросы
    vocabulary: [
      { q: "Can you ______ the lights? I can't see.", options: ["open", "turn on", "start", "put on"], answer: 1, topic: 'vocab_phrasal_verbs' },
      { q: "He went on a business _____ to New York.", options: ["travel", "journey", "commute", "trip"], answer: 3, topic: 'vocab_travel' },
      { q: "My brother and I don't ______ very well.", options: ["get off", "get on", "go on", "break off"], answer: 1, topic: 'vocab_phrasal_verbs' },
      { q: "This painting ______ a fortune.", options: ["is worth", "is value", "values", "worths"], answer: 0, topic: 'vocab_expressions' },
      { q: "When I arrive home, I'm going to have a ______ bath.", options: ["relaxing", "relaxed", "relax", "relaxation"], answer: 0, topic: 'vocab_adjectives' },
      { q: "We ______ to seeing you next Thursday.", options: ["really want", "hope", "are looking forward", "really wish"], answer: 2, topic: 'vocab_expressions' },
      { q: "I'd like to go ______ in the park.", options: ["to walking", "for walk", "for a walk", "to walk"], answer: 2, topic: 'vocab_collocations' },
      { q: "Choose the synonym for 'huge':", options: ["tiny", "enormous", "small", "medium"], answer: 1, topic: 'vocab_synonyms' },
      { q: "Choose the opposite of 'ancient':", options: ["old", "modern", "historical", "traditional"], answer: 1, topic: 'vocab_antonyms' },
      { q: "A person who designs buildings is called an ______.", options: ["engineer", "architect", "artist", "designer"], answer: 1, topic: 'vocab_professions' },
      { q: "The weather is very ______ today - it keeps changing.", options: ["unpredictable", "predictable", "stable", "constant"], answer: 0, topic: 'vocab_adjectives' },
      { q: "I need to ______ an appointment with the dentist.", options: ["do", "make", "have", "take"], answer: 1, topic: 'vocab_collocations' },
      { q: "She has a great ______ of humor.", options: ["sense", "feeling", "idea", "thought"], answer: 0, topic: 'vocab_expressions' },
      { q: "The movie was so ______ that I fell asleep.", options: ["boring", "bored", "bore", "boredom"], answer: 0, topic: 'vocab_adjectives' },
      { q: "Could you ______ me a favor?", options: ["make", "do", "give", "take"], answer: 1, topic: 'vocab_collocations' },
      { q: "I'm trying to ______ weight.", options: ["lose", "loose", "miss", "drop"], answer: 0, topic: 'vocab_health' },
      { q: "Please ______ attention to the safety instructions.", options: ["give", "make", "pay", "take"], answer: 2, topic: 'vocab_collocations' },
      { q: "The company decided to ______ off 50 employees.", options: ["lay", "put", "take", "give"], answer: 0, topic: 'vocab_phrasal_verbs' },
      { q: "I need to ______ up my English for the exam.", options: ["brush", "clean", "wash", "polish"], answer: 0, topic: 'vocab_expressions' },
      { q: "It's raining ______ and dogs outside!", options: ["cats", "dogs", "animals", "pets"], answer: 0, topic: 'vocab_idioms' },
      { q: "I ______ a mistake in my calculations.", options: ["did", "made", "had", "took"], answer: 1, topic: 'vocab_collocations' },
      { q: "The deadline is ______ the corner.", options: ["around", "in", "at", "on"], answer: 0, topic: 'vocab_idioms' },
      { q: "She always ______ her promises.", options: ["keeps", "holds", "takes", "makes"], answer: 0, topic: 'vocab_collocations' },
      { q: "Let's ______ a break for 10 minutes.", options: ["do", "make", "have", "take"], answer: 3, topic: 'vocab_collocations' },
      { q: "I can't ______ his name right now.", options: ["remember", "remind", "memory", "memorize"], answer: 0, topic: 'vocab_confusing_words' }
    ],

    // READING вопросы с текстами
    reading: [
      { 
        q: "Read the text and answer: What is the main idea?\n\n'Coffee is one of the most popular beverages in the world. It originated in Ethiopia and spread to Yemen in the 15th century. Today, Brazil is the largest producer of coffee beans. Many people drink coffee for its caffeine content, which helps them stay alert and focused.'",
        options: ["Coffee's history and popularity", "How to make coffee", "Brazilian culture", "Health effects of caffeine"],
        answer: 0,
        topic: 'reading_main_idea'
      },
      { 
        q: "According to the previous text, where did coffee originate?",
        options: ["Brazil", "Yemen", "Ethiopia", "Arabia"],
        answer: 2,
        topic: 'reading_details'
      },
      { 
        q: "Read: 'Despite the rain, the concert was a huge success. The band played for three hours, and the audience loved every minute.' What does 'despite' mean here?",
        options: ["Because of", "Although there was", "Thanks to", "Without"],
        answer: 1,
        topic: 'reading_vocabulary'
      },
      { 
        q: "Read the advertisement: 'Looking for a quiet apartment near the city center. Must have 2 bedrooms and parking. Contact John at 555-1234.' What is John looking for?",
        options: ["A job", "A roommate", "An apartment to rent", "A car"],
        answer: 2,
        topic: 'reading_comprehension'
      },
      { 
        q: "Read: 'Sarah couldn't believe her eyes. The surprise party was exactly what she needed after such a difficult week.' How did Sarah feel?",
        options: ["Angry", "Happy and surprised", "Tired", "Disappointed"],
        answer: 1,
        topic: 'reading_inference'
      },
      { 
        q: "From the email: 'Dear Sir/Madam, I am writing to complain about the service I received at your restaurant last night...' What is the purpose of this email?",
        options: ["To make a reservation", "To express dissatisfaction", "To apply for a job", "To thank someone"],
        answer: 1,
        topic: 'reading_purpose'
      },
      { 
        q: "Read: 'The museum is open from Tuesday to Sunday, 9 AM to 6 PM. Closed on Mondays. Admission: Adults $15, Children $8.' When is the museum closed?",
        options: ["Sundays", "Mondays", "Tuesdays", "Weekends"],
        answer: 1,
        topic: 'reading_details'
      },
      { 
        q: "Read: 'Although technology has made our lives easier, some people argue that we have become too dependent on our devices.' What is the author's tone?",
        options: ["Completely negative", "Completely positive", "Balanced/neutral", "Angry"],
        answer: 2,
        topic: 'reading_tone'
      },
      {
        q: "You see this sign at a store: '50% OFF - EVERYTHING MUST GO!' What can you infer?",
        options: ["The store is doing very well", "The store is probably closing", "Everything is very expensive", "You must leave the store"],
        answer: 1,
        topic: 'reading_inference'
      },
      {
        q: "Read the recipe instruction: 'Preheat the oven to 180°C. Mix flour, sugar, and eggs in a bowl. Bake for 25 minutes.' What should you do FIRST?",
        options: ["Mix ingredients", "Bake", "Heat the oven", "Add sugar"],
        answer: 2,
        topic: 'reading_sequence'
      },
      {
        q: "From a weather forecast: 'Tomorrow will be partly cloudy with a 70% chance of rain in the afternoon. Temperature: 15-20°C.' Should you bring an umbrella tomorrow?",
        options: ["No, definitely not", "Yes, probably a good idea", "Only in the morning", "Only if it's cold"],
        answer: 1,
        topic: 'reading_practical'
      },
      {
        q: "Notice: 'All students must submit their assignments by Friday, 5 PM. Late submissions will NOT be accepted.' What happens if you submit on Saturday?",
        options: ["It will be accepted", "It won't be accepted", "You get extra credit", "You must pay a fee"],
        answer: 1,
        topic: 'reading_comprehension'
      },
      {
        q: "Text message: 'Hey! Running 10 min late. Start without me!' What should you do?",
        options: ["Wait for them", "Cancel everything", "Start the activity", "Go home"],
        answer: 2,
        topic: 'reading_practical'
      },
      {
        q: "Job posting: 'Required: 3+ years experience, Bachelor's degree, fluent English. Preferred: Spanish skills.' Which is NOT required?",
        options: ["3 years experience", "Bachelor's degree", "Spanish skills", "English fluency"],
        answer: 2,
        topic: 'reading_details'
      },
      {
        q: "Read: 'The new smartphone features a 6.5-inch display, 128GB storage, and a 48MP camera. Battery life: up to 24 hours.' What is NOT mentioned?",
        options: ["Screen size", "Storage capacity", "Price", "Camera quality"],
        answer: 2,
        topic: 'reading_details'
      }
    ],

    // ОТКРЫТЫЕ ВОПРОСЫ (short answer)
    open: [
      {
        q: "Complete the sentence with ONE word: 'I have been living here ______ 2015.'",
        type: 'short',
        acceptedAnswers: ['since'],
        correctAnswer: 'since',
        topic: 'grammar_prepositions'
      },
      {
        q: "Write the past tense of 'go':",
        type: 'short',
        acceptedAnswers: ['went'],
        correctAnswer: 'went',
        topic: 'grammar_irregular_verbs'
      },
      {
        q: "Write a synonym for the word 'happy' (one word):",
        type: 'short',
        acceptedAnswers: ['joyful', 'cheerful', 'glad', 'pleased', 'delighted', 'content', 'joyous'],
        correctAnswer: 'joyful',
        topic: 'vocab_synonyms'
      },
      {
        q: "Complete: 'If I ______ rich, I would travel the world.' (one word)",
        type: 'short',
        acceptedAnswers: ['were', 'was'],
        correctAnswer: 'were',
        topic: 'grammar_conditionals'
      },
      {
        q: "What is the opposite of 'expensive'? (one word)",
        type: 'short',
        acceptedAnswers: ['cheap', 'inexpensive', 'affordable'],
        correctAnswer: 'cheap',
        topic: 'vocab_antonyms'
      }
    ],

    // ВОПРОСЫ С КАРТИНКАМИ (image-based)
    image: [
      {
        q: "What do you see in this picture?",
        type: 'image',
        imageEmoji: '🏖️',
        imageDesc: 'Beach scene with sun, sand and water',
        options: ["A beach", "A mountain", "A forest", "A city"],
        answer: 0,
        topic: 'vocab_places'
      },
      {
        q: "What is this person doing?",
        type: 'image',
        imageEmoji: '🏃‍♂️',
        imageDesc: 'Person running',
        options: ["Walking", "Running", "Swimming", "Dancing"],
        answer: 1,
        topic: 'vocab_actions'
      },
      {
        q: "What weather is shown here?",
        type: 'image',
        imageEmoji: '🌧️',
        imageDesc: 'Rainy weather with clouds',
        options: ["Sunny", "Rainy", "Snowy", "Windy"],
        answer: 1,
        topic: 'vocab_weather'
      },
      {
        q: "How many apples are there?",
        type: 'image',
        imageEmoji: '🍎🍎🍎',
        imageDesc: 'Three red apples',
        options: ["Two", "Three", "Four", "Five"],
        answer: 1,
        topic: 'vocab_numbers'
      },
      {
        q: "What time is it?",
        type: 'image',
        imageEmoji: '🕐',
        imageDesc: 'Clock showing 1 oclock',
        options: ["One o'clock", "Two o'clock", "Three o'clock", "Four o'clock"],
        answer: 0,
        topic: 'vocab_time'
      }
    ],

    // DRAG & DROP ВОПРОСЫ (sentence ordering)
    dragdrop: [
      {
        q: "Arrange the words to make a correct sentence:",
        type: 'dragdrop',
        words: ['I', 'school', 'to', 'go', 'every', 'day'],
        correctOrder: ['I', 'go', 'to', 'school', 'every', 'day'],
        topic: 'grammar_word_order'
      },
      {
        q: "Put the words in the correct order:",
        type: 'dragdrop',
        words: ['is', 'name', 'what', 'your', '?'],
        correctOrder: ['what', 'is', 'your', 'name', '?'],
        topic: 'grammar_questions'
      },
      {
        q: "Make a correct sentence from these words:",
        type: 'dragdrop',
        words: ['playing', 'children', 'are', 'the', 'park', 'in', 'the'],
        correctOrder: ['the', 'children', 'are', 'playing', 'in', 'the', 'park'],
        topic: 'grammar_present_continuous'
      },
      {
        q: "Arrange these words correctly:",
        type: 'dragdrop',
        words: ['have', 'I', 'never', 'Paris', 'been', 'to'],
        correctOrder: ['I', 'have', 'never', 'been', 'to', 'Paris'],
        topic: 'grammar_present_perfect'
      },
      {
        q: "Put the words in order to make a question:",
        type: 'dragdrop',
        words: ['you', 'do', 'where', 'live', '?'],
        correctOrder: ['where', 'do', 'you', 'live', '?'],
        topic: 'grammar_questions'
      }
    ]
  };

  // Объединяем все вопросы для mixed режима
  const mixedQuestions = [
    ...allQuestions.grammar.slice(0, 4),
    ...allQuestions.vocabulary.slice(0, 2),
    ...allQuestions.reading.slice(0, 2),
    ...allQuestions.image.slice(0, 1),
    ...allQuestions.dragdrop.slice(0, 1)
  ];

  // Функция перемешивания
  function shuffle(arr) { 
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // DOM refs for buttons
  const btnMixed = document.getElementById('btnMixed');
  const btnGrammar = document.getElementById('btnGrammar');
  const btnVocab = document.getElementById('btnVocab');
  const btnReading = document.getElementById('btnReading');

  // checks current type
  let currentType = new URLSearchParams(location.search).get('type') || 'mixed';
  setActiveTypeButton(currentType);

  // remembers current type
  function setActiveTypeButton(type) {
    currentType = type || 'mixed';
    if (selectedTypeSpan) selectedTypeSpan.textContent = currentType;
    [btnMixed, btnGrammar, btnVocab, btnReading].filter(Boolean).forEach(b => b.classList.toggle('btn-primary', b.dataset.type === type));
    [btnMixed, btnGrammar, btnVocab, btnReading].filter(Boolean).forEach(b => b.classList.toggle('btn-outline-primary', b.dataset.type !== type));
  }

  // меняет уровень
  [btnMixed, btnGrammar, btnVocab, btnReading].filter(Boolean).forEach(b => {
    b.addEventListener('click', () => {
      setActiveTypeButton(b.dataset.type);
      const p = new URLSearchParams(location.search);
      p.set('type', b.dataset.type);
      history.replaceState({}, '', location.pathname + '?' + p.toString());
    });
  });

  // вызывает кнопку старт для выбранного уровня
  if (startBtn) startBtn.addEventListener('click', () => startTest(currentType));
  if (restartBtn) restartBtn.addEventListener('click', () => startTest(currentType));

  // функция запуска теста
  function startTest(type) {
    quizResult.innerHTML = '';
    quizForm.classList.remove('d-none');
    
    let pool;
    if (type === 'mixed') {
      // Для mixed берем случайные вопросы из каждой категории
      const grammarSample = shuffle(allQuestions.grammar).slice(0, 3);
      const vocabSample = shuffle(allQuestions.vocabulary).slice(0, 3);
      const readingSample = shuffle(allQuestions.reading).slice(0, 2);
      const imageSample = shuffle(allQuestions.image).slice(0, 1);
      const dragdropSample = shuffle(allQuestions.dragdrop).slice(0, 1);
      pool = [...grammarSample, ...vocabSample, ...readingSample, ...imageSample, ...dragdropSample];
    } else if (type === 'grammar') {
      pool = [...allQuestions.grammar, ...allQuestions.dragdrop];
    } else if (type === 'vocabulary') {
      pool = [...allQuestions.vocabulary, ...allQuestions.image];
    } else if (type === 'reading') {
      pool = [...allQuestions.reading, ...allQuestions.open.slice(0, 2)];
    }

    // Перемешиваем и берем 10 вопросов
    const selected = shuffle(pool).slice(0, 10);
    // save selected on form element
    quizForm._questions = selected;
    
    // генерация нтмл кода к каждому вопросу
    quizMount.innerHTML = selected.map((q, i) => {
      if (q.type === 'short') {
        return `<div class="quiz-card card p-3">
          <h5>Q${i + 1}. ${q.q}</h5>
          <input type="text" name="q${i}" class="form-control mt-2" placeholder="Type your answer here" required>
          <small class="text-muted mt-1">Write your answer in lowercase</small>
        </div>`;
      } else if (q.type === 'image') {
        return `<div class="quiz-card card p-3">
          <h5>Q${i + 1}. ${q.q}</h5>
          <div class="text-center my-3">
            <div style="font-size: 80px; line-height: 1;">${q.imageEmoji}</div>
            <small class="text-muted">${q.imageDesc}</small>
          </div>
          ${q.options.map((opt, j) => `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="q${i}" id="q${i}-${j}" value="${j}" required>
              <label class="form-check-label" for="q${i}-${j}">${opt}</label>
            </div>
          `).join('')}
        </div>`;
      } else if (q.type === 'dragdrop') {
        const shuffledWords = shuffle(q.words);
        return `<div class="quiz-card card p-3">
          <h5>Q${i + 1}. ${q.q}</h5>
          <div class="alert alert-info" style="font-size: 0.9rem;">
            <strong>Instructions:</strong> Click on words in the correct order to build the sentence.
          </div>
          <div class="mb-3">
            <div class="dragdrop-words mb-3" id="words-${i}" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 15px; background: #f8f9fa; border-radius: 8px; min-height: 60px;">
              ${shuffledWords.map((word, idx) => `
                <button type="button" class="btn btn-outline-primary btn-sm word-btn" data-word="${word}" data-question="${i}">
                  ${word}
                </button>
              `).join('')}
            </div>
            <div class="dragdrop-answer" id="answer-${i}" style="min-height: 50px; padding: 15px; background: #e9ecef; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
              <small class="text-muted" id="placeholder-${i}">Click words above to build your sentence...</small>
            </div>
            <input type="hidden" name="q${i}" id="hidden-${i}">
          </div>
          <button type="button" class="btn btn-sm btn-warning" onclick="resetDragDrop(${i})">Reset</button>
        </div>`;
      } else {
        return `<div class="quiz-card card p-3">
          <h5>Q${i + 1}. ${q.q}</h5>
          ${q.options.map((opt, j) => `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="q${i}" id="q${i}-${j}" value="${j}" required>
              <label class="form-check-label" for="q${i}-${j}">${opt}</label>
            </div>
          `).join('')}
        </div>`;
      }
    }).join('');
    
    // Initialize drag and drop functionality
    initDragDrop();
    
    // show restart button after start
    restartBtn.classList.add('d-none');
    // scroll to form
    setTimeout(() => window.scrollTo({ top: quizForm.offsetTop - 10, behavior: 'smooth' }), 120);
  }

  // Проверка открытого ответа
  function checkShortAnswer(userAnswer, question) {
    const normalized = userAnswer.toLowerCase().trim();
    return question.acceptedAnswers.some(ans => ans.toLowerCase() === normalized);
  }

  // Проверка drag & drop ответа
  function checkDragDropAnswer(userAnswer, question) {
    if (!userAnswer || userAnswer.trim() === '') return false;
    
    const userArray = userAnswer.split(' ').filter(w => w.length > 0);
    const correctArray = question.correctOrder;
    
    if (userArray.length !== correctArray.length) return false;
    
    return userArray.every((word, idx) => word.toLowerCase() === correctArray[idx].toLowerCase());
  }

  // Initialize drag and drop functionality
  function initDragDrop() {
    document.querySelectorAll('.word-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const questionIdx = this.dataset.question;
        const word = this.dataset.word;
        const answerDiv = document.getElementById(`answer-${questionIdx}`);
        const hiddenInput = document.getElementById(`hidden-${questionIdx}`);
        const placeholder = document.getElementById(`placeholder-${questionIdx}`);
        
        // Remove placeholder if exists
        if (placeholder) placeholder.remove();
        
        // Create selected word badge
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary';
        badge.style.fontSize = '0.95rem';
        badge.style.padding = '8px 12px';
        badge.style.cursor = 'pointer';
        badge.textContent = word;
        badge.dataset.word = word;
        badge.dataset.question = questionIdx;
        
        // Click on badge to remove it
        badge.addEventListener('click', function() {
          this.remove();
          // Re-enable the original button
          document.querySelectorAll(`.word-btn[data-question="${questionIdx}"][data-word="${word}"]`).forEach(b => {
            b.disabled = false;
            b.classList.remove('d-none');
          });
          updateDragDropAnswer(questionIdx);
        });
        
        answerDiv.appendChild(badge);
        
        // Disable and hide the clicked button
        this.disabled = true;
        this.classList.add('d-none');
        
        // Update hidden input
        updateDragDropAnswer(questionIdx);
      });
    });
  }

  // Update drag & drop answer in hidden input
  function updateDragDropAnswer(questionIdx) {
    const answerDiv = document.getElementById(`answer-${questionIdx}`);
    const hiddenInput = document.getElementById(`hidden-${questionIdx}`);
    const badges = answerDiv.querySelectorAll('.badge');
    
    if (badges.length === 0) {
      hiddenInput.value = '';
      // Re-add placeholder
      const placeholder = document.createElement('small');
      placeholder.className = 'text-muted';
      placeholder.id = `placeholder-${questionIdx}`;
      placeholder.textContent = 'Click words above to build your sentence...';
      answerDiv.appendChild(placeholder);
    } else {
      const words = Array.from(badges).map(b => b.dataset.word);
      hiddenInput.value = words.join(' ');
    }
  }

  // Reset drag & drop question
  window.resetDragDrop = function(questionIdx) {
    const answerDiv = document.getElementById(`answer-${questionIdx}`);
    const wordsDiv = document.getElementById(`words-${questionIdx}`);
    const hiddenInput = document.getElementById(`hidden-${questionIdx}`);
    
    // Remove all badges
    answerDiv.querySelectorAll('.badge').forEach(b => b.remove());
    
    // Re-enable all buttons
    wordsDiv.querySelectorAll('.word-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('d-none');
    });
    
    // Clear hidden input
    hiddenInput.value = '';
    
    // Add placeholder back
    const placeholder = document.createElement('small');
    placeholder.className = 'text-muted';
    placeholder.id = `placeholder-${questionIdx}`;
    placeholder.textContent = 'Click words above to build your sentence...';
    answerDiv.appendChild(placeholder);
  };

  //Функция конфетти
  function launchConfetti() {
    const duration = 3 * 1000; // 3 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // конфетти с двух сторон
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  }

  // Анализ результатов по темам
  function analyzeTopics(questions, results) {
    const topicStats = {};
    
    questions.forEach((q, i) => {
      const topic = q.topic || 'other';
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].total++;
      
      // Проверяем результат для этого вопроса
      if (results[i] && results[i].ok === true) {
        topicStats[topic].correct++;
      }
    });

    return topicStats;
  }

  // Генерация рекомендаций
  function generateRecommendations(topicStats, percent) {
    const recommendations = [];
    const topicNames = {
      'grammar_tenses': 'Grammar: Tenses',
      'grammar_pronouns': 'Grammar: Pronouns',
      'grammar_prepositions': 'Grammar: Prepositions',
      'grammar_articles': 'Grammar: Articles',
      'grammar_conditionals': 'Grammar: Conditionals',
      'grammar_comparatives': 'Grammar: Comparatives',
      'grammar_modals': 'Grammar: Modal verbs',
      'grammar_passive': 'Grammar: Passive voice',
      'vocab_phrasal_verbs': 'Vocabulary: Phrasal Verbs',
      'vocab_collocations': 'Vocabulary: Collocations',
      'vocab_idioms': 'Vocabulary: Idioms',
      'vocab_synonyms': 'Vocabulary: Synonyms',
      'vocab_antonyms': 'Vocabulary: Antonyms',
      'reading_main_idea': 'Reading: Main Ideas',
      'reading_details': 'Reading: Details',
      'reading_inference': 'Reading: Inferences',
      'reading_comprehension': 'Reading: Comprehension'
    };

    // гифки для разных результатов
    const memes = {
      perfect: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjBxY2VqZzB5dTBvbGVrZGNkZm1xZzNwczZsaHM4Ym0zYzBhY3RpNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9582DNuQppxC/giphy.gif',
      excellent: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXh3MjB5bHJwcWJkaTQ2OGQ4cDY5NXN6Zzd5ZGp5Z3lyZWg5aHVwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4cqiYI30juCOGY/giphy.gif',
      good: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzBpMGJ4ZmUyeWRnOXBsaGRneWZqMHQ2NXJ1YjF3Yjg4dndoMjRoZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKF1fSIs1R19B8k/giphy.gif',
      okay: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzh3ZGFvdmExN3oyYm9ucTkxNnhjdDVsMHMwdGd6OWtvbDg3ZGRwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbzmrabLQFE7yroYbA/giphy.gif',
      keep_going: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWFxZm9sZ2RoNjR5azN4ZHh1aG9iYmttZmltcTc5YWV1NzJqOGx3bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vQZ8ko4l0nvjm2Q/giphy.gif'
    };

    let selectedMeme = '';
    if (percent === 100) {
      selectedMeme = memes.perfect;
      recommendations.push("🎉 <strong>PERFECT SCORE!</strong> You're absolutely crushing it! 💯");
    } else if (percent >= 90) {
      selectedMeme = memes.excellent;
      recommendations.push("🔥 <strong>Outstanding!</strong> You're on fire! Keep up the amazing work! 🌟");
    } else if (percent >= 75) {
      selectedMeme = memes.good;
      recommendations.push("👏 <strong>Great job!</strong> You're doing really well! Just a bit more practice and you'll be perfect! ✨");
    } else if (percent >= 60) {
      selectedMeme = memes.okay;
      recommendations.push("💪 <strong>Good effort!</strong> You're making progress! Keep practicing and you'll improve! 📚");
    } else if (percent >= 40) {
      selectedMeme = memes.keep_going;
      recommendations.push("🌱 <strong>Keep going!</strong> Learning takes time. Focus on the topics below and you'll see improvement! 🎯");
    } else {
      selectedMeme = memes.keep_going;
      recommendations.push("💪 <strong>Don't give up!</strong> Everyone starts somewhere. Practice makes perfect! You got this! 🚀");
    }

    // Добавляем гифку
    if (selectedMeme) {
      recommendations.push(`<div class="text-center my-3"><img src="${selectedMeme}" alt="reaction" style="max-width: 300px; width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>`);
    }

    // Находим слабые темы
    const weakTopics = [];
    Object.keys(topicStats).forEach(topic => {
      const stat = topicStats[topic];
      const topicPercent = (stat.correct / stat.total) * 100;
      if (topicPercent < 70) {
        weakTopics.push({ topic, percent: topicPercent, ...stat });
      }
    });

    weakTopics.sort((a, b) => a.percent - b.percent);

    // Добавляем рекомендации по слабым темам
    if (weakTopics.length > 0) {
      recommendations.push("<br><strong>Topics to focus on:</strong><ul>");
      weakTopics.slice(0, 3).forEach(item => {
        const topicName = topicNames[item.topic] || item.topic;
        recommendations.push(
          `<li>${topicName}: ${item.correct}/${item.total} correct (${Math.round(item.percent)}%)</li>`
        );
      });
      recommendations.push("</ul>");
    }

    // Общие советы
    recommendations.push("<br><strong>Study tips:</strong><ul>");
    if (currentType === 'grammar' || weakTopics.some(t => t.topic.includes('grammar'))) {
      recommendations.push("<li>Practice grammar exercises daily (10-15 minutes)</li>");
      recommendations.push("<li>Read example sentences and create your own</li>");
    }
    if (currentType === 'vocabulary' || weakTopics.some(t => t.topic.includes('vocab'))) {
      recommendations.push("<li>Learn 5-10 new words every day</li>");
      recommendations.push("<li>Use flashcards or apps like Quizlet</li>");
      recommendations.push("<li>Try to use new words in sentences</li>");
    }
    if (currentType === 'reading' || weakTopics.some(t => t.topic.includes('reading'))) {
      recommendations.push("<li>Read English texts daily (news, articles, books)</li>");
      recommendations.push("<li>Practice identifying main ideas and details</li>");
      recommendations.push("<li>Learn to guess meaning from context</li>");
    }
    recommendations.push("</ul>");

    // Случайный facт
    if (Math.random() > 0.5) {
      const funFacts = [
        "💡 <strong>Fun Fact:</strong> The word 'set' has the most definitions in English - over 430 different meanings!",
        "💡 <strong>Fun Fact:</strong> English is the official language of the sky! All pilots must speak English on international flights.",
        "💡 <strong>Fun Fact:</strong> Shakespeare invented over 1,700 words including 'bedroom', 'lonely', and 'eyeball'!",
        "💡 <strong>Fun Fact:</strong> The shortest complete sentence in English is 'I am.'",
        "💡 <strong>Fun Fact:</strong> 'Go' is the shortest grammatically correct sentence in English.",
        "💡 <strong>Fun Fact:</strong> The word 'queue' is the only word pronounced the same way even if you remove the last 4 letters!",
        "💡 <strong>Fun Fact:</strong> A new word is added to the English dictionary every 2 hours!",
        "💡 <strong>Fun Fact:</strong> The most commonly used letter in English is 'E'.",
        "💡 <strong>Fun Fact:</strong> 'Pneumonoultramicroscopicsilicovolcanoconiosis' is the longest word in English (45 letters)!",
        "💡 <strong>Fun Fact:</strong> The word 'goodbye' comes from 'God be with you'.",
        "💡 <strong>Fun Fact:</strong> English has more words than most languages - over 170,000 words in current use!",
        "💡 <strong>Fun Fact:</strong> The word 'tongue twister' is itself a tongue twister!",
        "💡 <strong>Fun Fact:</strong> 'Bookkeeper' is the only word in English with three consecutive double letters!",
        "💡 <strong>Fun Fact:</strong> The dot over the letter 'i' and 'j' is called a 'tittle'.",
        "💡 <strong>Fun Fact:</strong> 'Almost' is the longest word with all letters in alphabetical order."
      ];
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      recommendations.push(`<br><div class="alert alert-info" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">${randomFact}</div>`);
    }

    return recommendations.join('');
  }

  // кнопка сабмит и считывание правильных ответов
  quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    

    // Проверяем что все обязательные поля заполнены
    const questions = quizForm._questions || [];
    let allAnswered = true;
    
    questions.forEach((q, i) => {
      if (q.type === 'dragdrop') {
        const hidden = document.getElementById(`hidden-${i}`);
        if (!hidden || !hidden.value || hidden.value.trim() === '') {
          allAnswered = false;
          alert(`Please answer Question ${i + 1} (Drag & Drop)`);
        }
      } else if (q.type === 'short') {
        const input = quizForm.querySelector(`input[name="q${i}"]`);
        if (!input || !input.value || input.value.trim() === '') {
          allAnswered = false;
          alert(`Please answer Question ${i + 1}`);
        }
      } else {
        const chosen = quizForm.querySelector(`input[name="q${i}"]:checked`);
        if (!chosen) {
          allAnswered = false;
          alert(`Please answer Question ${i + 1}`);
        }
      }
    });
    


    if (!allAnswered) return;
    
    let score = 0;
    const feedback = [];
    const results = [];

    // цикл проходит по всем вопросам и сравнивает их потом готовит фитбэк
    questions.forEach((q, i) => {
      let ok = false;
      let userAnswer = null;

      if (q.type === 'short') {
        const input = quizForm.querySelector(`input[name="q${i}"]`);
        userAnswer = input ? input.value : '';
        ok = checkShortAnswer(userAnswer, q);
        feedback.push({ 
          ok, 
          i: i + 1, 
          userAnswer, 
          correctAnswer: q.correctAnswer,
          type: 'short'
        });
      } else if (q.type === 'dragdrop') {
        const hidden = quizForm.querySelector(`input[name="q${i}"]`);
        userAnswer = hidden ? hidden.value : '';
        ok = checkDragDropAnswer(userAnswer, q);
        feedback.push({
          ok,
          i: i + 1,
          userAnswer,
          correctAnswer: q.correctOrder.join(' '),
          type: 'dragdrop'
        });


      } else if (q.type === 'image') {
        const chosen = quizForm.querySelector(`input[name="q${i}"]:checked`);
        const val = chosen ? parseInt(chosen.value, 10) : null;
        ok = val !== null && val === q.answer;
        feedback.push({ 
          ok, 
          i: i + 1, 
          chosen: val, 
          correct: q.answer,
          type: 'image',
          options: q.options
        });
        
      } else {
        const chosen = quizForm.querySelector(`input[name="q${i}"]:checked`);
        const val = chosen ? parseInt(chosen.value, 10) : null;
        ok = val !== null && val === q.answer;
        feedback.push({ 
          ok, 
          i: i + 1, 
          chosen: val, 
          correct: q.answer,
          type: 'mcq'
        });
      }

      if (ok) score++;
      results.push({ ok, topic: q.topic });
    });

    // баллы на проценты
    const percent = Math.round((score / Math.max(1, questions.length)) * 100);

    //конфетти при результате 90%+
    if (percent >= 90) {
      launchConfetti();
    }

    // Анализ по темам
    const topicStats = analyzeTopics(questions, results);
    const recommendations = generateRecommendations(topicStats, percent);

    // render feedback
    let fbHtml = `<div class="card p-3"><div class="alert ${percent >= 70 ? 'alert-success' : 'alert-warning'}"><strong>Result:</strong> ${percent}% (${score}/${questions.length})</div>`;
    
    // Рекомендации
    fbHtml += `<div class="mb-3"><strong>📊 Feedback & Recommendations:</strong><br>${recommendations}</div>`;
    
    fbHtml += `<div><strong>Details:</strong><ul>`;



    // вывод фитбэка по каждому вопросу
    feedback.forEach(f => {
      if (f.type === 'short') {
        fbHtml += `<li class="${f.ok ? 'text-success' : 'text-danger'}">Q${f.i} — ${f.ok ? 'Correct' : `Incorrect (your answer: "${f.userAnswer}"; correct: "${f.correctAnswer}")`}</li>`;
      } else if (f.type === 'dragdrop') {
        fbHtml += `<li class="${f.ok ? 'text-success' : 'text-danger'}">Q${f.i} — ${f.ok ? 'Correct' : `Incorrect (your order: "${f.userAnswer}"; correct: "${f.correctAnswer}")`}</li>`;
      } else if (f.type === 'image') {
        fbHtml += `<li class="${f.ok ? 'text-success' : 'text-danger'}">Q${f.i} — ${f.ok ? 'Correct' : 'Incorrect (your: ' + (f.chosen == null ? 'no answer' : f.options[f.chosen]) + '; correct: ' + f.options[f.correct] + ')'}</li>`;
      } else {
        fbHtml += `<li class="${f.ok ? 'text-success' : 'text-danger'}">Q${f.i} — ${f.ok ? 'Correct' : 'Incorrect (your: ' + (f.chosen == null ? 'no answer' : questions[f.i - 1].options[f.chosen]) + '; correct: ' + questions[f.i - 1].options[f.correct] + ')'}</li>`;
      }
    });
    fbHtml += `</ul></div>`;
    fbHtml += `<div class="mt-3 d-flex gap-2"><button id="nextTypeBtn" class="btn btn-primary btn-sm">Next type</button><a class="btn btn-outline-secondary btn-sm" href="index.html">Back to Home</a></div>`;
    fbHtml += `</div>`;
    quizResult.innerHTML = fbHtml;

    // сохраняет результаты в локалсторадж
    const entry = {
      ts: (new Date()).toISOString(),
      user: (localStorage.getItem('edu_current') ? JSON.parse(localStorage.getItem('edu_current')).name : (localStorage.getItem('currentUser') || 'Guest')),
      category: `english_${currentType}`,
      score: `${score}/${questions.length}`,
      percent: percent,
      topicBreakdown: topicStats
    };



    // push into quiz_history_v1 сохраняет в браузере
    try {
      const key = 'quiz_history_v1';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(entry);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(e) { console.warn('save quiz_history_v1 failed', e); }

    try {
      const oldKey = 'edu_history';
      const arr2 = JSON.parse(localStorage.getItem(oldKey) || '[]');
      arr2.push({ timestamp: entry.ts, user: entry.user, category: entry.category, score: entry.score, percent: entry.percent });
      localStorage.setItem(oldKey, JSON.stringify(arr2));
    } catch(e) { console.warn('save edu_history failed', e); }

    // show restart and wire next type 
    if (restartBtn) restartBtn.classList.remove('d-none');
    // если нажать некст левел и откроется след уровень
    const nextBtn = document.getElementById('nextTypeBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // cycle mixed->grammar->vocabulary->reading->mixed
        const order = ['mixed', 'grammar', 'vocabulary', 'reading'];
        const idx = order.indexOf(currentType);
        const next = order[(idx + 1) % order.length];
        setActiveTypeButton(next);
        startTest(next);
        quizResult.innerHTML = '';
      }, { once: true });
    }
  });



  // автостарт проверяет ссылку на уровень
  const urlType = new URLSearchParams(location.search).get('type');
  if (urlType) setActiveTypeButton(urlType);
  startTest(currentType);
});