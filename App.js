import { useState, useEffect, useCallback, useRef } from "react";

// ─── 100 VERBS ───────────────────────────────────────────────────────────────
const verbs = [
  { infinitive:"be",         pron:"/biː/",          past:"was/were",   pastPron:"/wʌz/wər/",       participle:"been",       partPron:"/bɪn/",          spanish:"ser/estar" },
  { infinitive:"have",       pron:"/hæv/",          past:"had",        pastPron:"/hæd/",            participle:"had",        partPron:"/hæd/",          spanish:"tener/haber" },
  { infinitive:"do",         pron:"/duː/",          past:"did",        pastPron:"/dɪd/",            participle:"done",       partPron:"/dʌn/",          spanish:"hacer" },
  { infinitive:"say",        pron:"/seɪ/",          past:"said",       pastPron:"/sɛd/",            participle:"said",       partPron:"/sɛd/",          spanish:"decir" },
  { infinitive:"go",         pron:"/ɡoʊ/",          past:"went",       pastPron:"/wɛnt/",           participle:"gone",       partPron:"/ɡɒn/",          spanish:"ir" },
  { infinitive:"get",        pron:"/ɡɛt/",          past:"got",        pastPron:"/ɡɒt/",            participle:"gotten",     partPron:"/ˈɡɒtən/",       spanish:"obtener/conseguir" },
  { infinitive:"make",       pron:"/meɪk/",         past:"made",       pastPron:"/meɪd/",           participle:"made",       partPron:"/meɪd/",         spanish:"hacer/crear" },
  { infinitive:"know",       pron:"/noʊ/",          past:"knew",       pastPron:"/njuː/",           participle:"known",      partPron:"/noʊn/",         spanish:"saber/conocer" },
  { infinitive:"think",      pron:"/θɪŋk/",         past:"thought",    pastPron:"/θɔːt/",           participle:"thought",    partPron:"/θɔːt/",         spanish:"pensar" },
  { infinitive:"take",       pron:"/teɪk/",         past:"took",       pastPron:"/tʊk/",            participle:"taken",      partPron:"/ˈteɪkən/",      spanish:"tomar/llevar" },
  { infinitive:"see",        pron:"/siː/",          past:"saw",        pastPron:"/sɔː/",            participle:"seen",       partPron:"/siːn/",         spanish:"ver" },
  { infinitive:"come",       pron:"/kʌm/",          past:"came",       pastPron:"/keɪm/",           participle:"come",       partPron:"/kʌm/",          spanish:"venir" },
  { infinitive:"want",       pron:"/wɒnt/",         past:"wanted",     pastPron:"/ˈwɒntɪd/",        participle:"wanted",     partPron:"/ˈwɒntɪd/",      spanish:"querer" },
  { infinitive:"look",       pron:"/lʊk/",          past:"looked",     pastPron:"/lʊkt/",           participle:"looked",     partPron:"/lʊkt/",         spanish:"mirar/buscar" },
  { infinitive:"use",        pron:"/juːz/",         past:"used",       pastPron:"/juːzd/",          participle:"used",       partPron:"/juːzd/",        spanish:"usar" },
  { infinitive:"find",       pron:"/faɪnd/",        past:"found",      pastPron:"/faʊnd/",          participle:"found",      partPron:"/faʊnd/",        spanish:"encontrar" },
  { infinitive:"give",       pron:"/ɡɪv/",          past:"gave",       pastPron:"/ɡeɪv/",           participle:"given",      partPron:"/ˈɡɪvən/",       spanish:"dar" },
  { infinitive:"tell",       pron:"/tɛl/",          past:"told",       pastPron:"/toʊld/",          participle:"told",       partPron:"/toʊld/",        spanish:"decir/contar" },
  { infinitive:"work",       pron:"/wɜːrk/",        past:"worked",     pastPron:"/wɜːrkt/",         participle:"worked",     partPron:"/wɜːrkt/",       spanish:"trabajar" },
  { infinitive:"call",       pron:"/kɔːl/",         past:"called",     pastPron:"/kɔːld/",          participle:"called",     partPron:"/kɔːld/",        spanish:"llamar" },
  { infinitive:"feel",       pron:"/fiːl/",         past:"felt",       pastPron:"/fɛlt/",           participle:"felt",       partPron:"/fɛlt/",         spanish:"sentir" },
  { infinitive:"become",     pron:"/bɪˈkʌm/",       past:"became",     pastPron:"/bɪˈkeɪm/",        participle:"become",     partPron:"/bɪˈkʌm/",       spanish:"convertirse" },
  { infinitive:"leave",      pron:"/liːv/",         past:"left",       pastPron:"/lɛft/",           participle:"left",       partPron:"/lɛft/",         spanish:"dejar/salir" },
  { infinitive:"put",        pron:"/pʊt/",          past:"put",        pastPron:"/pʊt/",            participle:"put",        partPron:"/pʊt/",          spanish:"poner" },
  { infinitive:"bring",      pron:"/brɪŋ/",         past:"brought",    pastPron:"/brɔːt/",          participle:"brought",    partPron:"/brɔːt/",        spanish:"traer" },
  { infinitive:"begin",      pron:"/bɪˈɡɪn/",       past:"began",      pastPron:"/bɪˈɡæn/",         participle:"begun",      partPron:"/bɪˈɡʌn/",       spanish:"comenzar" },
  { infinitive:"keep",       pron:"/kiːp/",         past:"kept",       pastPron:"/kɛpt/",           participle:"kept",       partPron:"/kɛpt/",         spanish:"mantener/guardar" },
  { infinitive:"hold",       pron:"/hoʊld/",        past:"held",       pastPron:"/hɛld/",           participle:"held",       partPron:"/hɛld/",         spanish:"sostener/tener" },
  { infinitive:"write",      pron:"/raɪt/",         past:"wrote",      pastPron:"/roʊt/",           participle:"written",    partPron:"/ˈrɪtən/",       spanish:"escribir" },
  { infinitive:"stand",      pron:"/stænd/",        past:"stood",      pastPron:"/stʊd/",           participle:"stood",      partPron:"/stʊd/",         spanish:"estar de pie" },
  { infinitive:"hear",       pron:"/hɪər/",         past:"heard",      pastPron:"/hɜːrd/",          participle:"heard",      partPron:"/hɜːrd/",        spanish:"oír/escuchar" },
  { infinitive:"let",        pron:"/lɛt/",          past:"let",        pastPron:"/lɛt/",            participle:"let",        partPron:"/lɛt/",          spanish:"dejar/permitir" },
  { infinitive:"mean",       pron:"/miːn/",         past:"meant",      pastPron:"/mɛnt/",           participle:"meant",      partPron:"/mɛnt/",         spanish:"significar" },
  { infinitive:"set",        pron:"/sɛt/",          past:"set",        pastPron:"/sɛt/",            participle:"set",        partPron:"/sɛt/",          spanish:"establecer/poner" },
  { infinitive:"meet",       pron:"/miːt/",         past:"met",        pastPron:"/mɛt/",            participle:"met",        partPron:"/mɛt/",          spanish:"conocer/reunirse" },
  { infinitive:"run",        pron:"/rʌn/",          past:"ran",        pastPron:"/ræn/",            participle:"run",        partPron:"/rʌn/",          spanish:"correr" },
  { infinitive:"pay",        pron:"/peɪ/",          past:"paid",       pastPron:"/peɪd/",           participle:"paid",       partPron:"/peɪd/",         spanish:"pagar" },
  { infinitive:"sit",        pron:"/sɪt/",          past:"sat",        pastPron:"/sæt/",            participle:"sat",        partPron:"/sæt/",          spanish:"sentarse" },
  { infinitive:"speak",      pron:"/spiːk/",        past:"spoke",      pastPron:"/spoʊk/",          participle:"spoken",     partPron:"/ˈspoʊkən/",     spanish:"hablar" },
  { infinitive:"lie",        pron:"/laɪ/",          past:"lay",        pastPron:"/leɪ/",            participle:"lain",       partPron:"/leɪn/",         spanish:"estar acostado" },
  { infinitive:"lead",       pron:"/liːd/",         past:"led",        pastPron:"/lɛd/",            participle:"led",        partPron:"/lɛd/",          spanish:"liderar/llevar" },
  { infinitive:"read",       pron:"/riːd/",         past:"read",       pastPron:"/rɛd/",            participle:"read",       partPron:"/rɛd/",          spanish:"leer" },
  { infinitive:"grow",       pron:"/ɡroʊ/",         past:"grew",       pastPron:"/ɡruː/",           participle:"grown",      partPron:"/ɡroʊn/",        spanish:"crecer" },
  { infinitive:"lose",       pron:"/luːz/",         past:"lost",       pastPron:"/lɒst/",           participle:"lost",       partPron:"/lɒst/",         spanish:"perder" },
  { infinitive:"fall",       pron:"/fɔːl/",         past:"fell",       pastPron:"/fɛl/",            participle:"fallen",     partPron:"/ˈfɔːlən/",      spanish:"caer" },
  { infinitive:"send",       pron:"/sɛnd/",         past:"sent",       pastPron:"/sɛnt/",           participle:"sent",       partPron:"/sɛnt/",         spanish:"enviar" },
  { infinitive:"build",      pron:"/bɪld/",         past:"built",      pastPron:"/bɪlt/",           participle:"built",      partPron:"/bɪlt/",         spanish:"construir" },
  { infinitive:"buy",        pron:"/baɪ/",          past:"bought",     pastPron:"/bɔːt/",           participle:"bought",     partPron:"/bɔːt/",         spanish:"comprar" },
  { infinitive:"cut",        pron:"/kʌt/",          past:"cut",        pastPron:"/kʌt/",            participle:"cut",        partPron:"/kʌt/",          spanish:"cortar" },
  { infinitive:"drive",      pron:"/draɪv/",        past:"drove",      pastPron:"/droʊv/",          participle:"driven",     partPron:"/ˈdrɪvən/",      spanish:"conducir/manejar" },
  { infinitive:"eat",        pron:"/iːt/",          past:"ate",        pastPron:"/eɪt/",            participle:"eaten",      partPron:"/ˈiːtən/",       spanish:"comer" },
  { infinitive:"drink",      pron:"/drɪŋk/",        past:"drank",      pastPron:"/dræŋk/",          participle:"drunk",      partPron:"/drʌŋk/",        spanish:"beber" },
  { infinitive:"sleep",      pron:"/sliːp/",        past:"slept",      pastPron:"/slɛpt/",          participle:"slept",      partPron:"/slɛpt/",        spanish:"dormir" },
  { infinitive:"swim",       pron:"/swɪm/",         past:"swam",       pastPron:"/swæm/",           participle:"swum",       partPron:"/swʌm/",         spanish:"nadar" },
  { infinitive:"sing",       pron:"/sɪŋ/",          past:"sang",       pastPron:"/sæŋ/",            participle:"sung",       partPron:"/sʌŋ/",          spanish:"cantar" },
  { infinitive:"ring",       pron:"/rɪŋ/",          past:"rang",       pastPron:"/ræŋ/",            participle:"rung",       partPron:"/rʌŋ/",          spanish:"sonar/llamar" },
  { infinitive:"fly",        pron:"/flaɪ/",         past:"flew",       pastPron:"/fluː/",           participle:"flown",      partPron:"/floʊn/",        spanish:"volar" },
  { infinitive:"throw",      pron:"/θroʊ/",         past:"threw",      pastPron:"/θruː/",           participle:"thrown",     partPron:"/θroʊn/",        spanish:"lanzar/tirar" },
  { infinitive:"show",       pron:"/ʃoʊ/",          past:"showed",     pastPron:"/ʃoʊd/",           participle:"shown",      partPron:"/ʃoʊn/",         spanish:"mostrar" },
  { infinitive:"choose",     pron:"/tʃuːz/",        past:"chose",      pastPron:"/tʃoʊz/",          participle:"chosen",     partPron:"/ˈtʃoʊzən/",     spanish:"elegir" },
  { infinitive:"break",      pron:"/breɪk/",        past:"broke",      pastPron:"/broʊk/",          participle:"broken",     partPron:"/ˈbroʊkən/",     spanish:"romper" },
  { infinitive:"spend",      pron:"/spɛnd/",        past:"spent",      pastPron:"/spɛnt/",          participle:"spent",      partPron:"/spɛnt/",        spanish:"gastar/pasar" },
  { infinitive:"understand", pron:"/ˌʌndərˈstænd/", past:"understood", pastPron:"/ˌʌndərˈstʊd/",    participle:"understood", partPron:"/ˌʌndərˈstʊd/",  spanish:"entender" },
  { infinitive:"draw",       pron:"/drɔː/",         past:"drew",       pastPron:"/druː/",           participle:"drawn",      partPron:"/drɔːn/",        spanish:"dibujar" },
  { infinitive:"break",      pron:"/breɪk/",        past:"broke",      pastPron:"/broʊk/",          participle:"broken",     partPron:"/ˈbroʊkən/",     spanish:"romper" },
  { infinitive:"steal",      pron:"/stiːl/",        past:"stole",      pastPron:"/stoʊl/",          participle:"stolen",     partPron:"/ˈstoʊlən/",     spanish:"robar" },
  { infinitive:"forbid",     pron:"/fərˈbɪd/",      past:"forbade",    pastPron:"/fərˈbæd/",        participle:"forbidden",  partPron:"/fərˈbɪdən/",    spanish:"prohibir" },
  { infinitive:"forgive",    pron:"/fərˈɡɪv/",      past:"forgave",    pastPron:"/fərˈɡeɪv/",       participle:"forgiven",   partPron:"/fərˈɡɪvən/",    spanish:"perdonar" },
  { infinitive:"freeze",     pron:"/friːz/",        past:"froze",      pastPron:"/froʊz/",          participle:"frozen",     partPron:"/ˈfroʊzən/",     spanish:"congelar" },
  { infinitive:"hang",       pron:"/hæŋ/",          past:"hung",       pastPron:"/hʌŋ/",            participle:"hung",       partPron:"/hʌŋ/",          spanish:"colgar" },
  { infinitive:"hide",       pron:"/haɪd/",         past:"hid",        pastPron:"/hɪd/",            participle:"hidden",     partPron:"/ˈhɪdən/",       spanish:"esconder" },
  { infinitive:"light",      pron:"/laɪt/",         past:"lit",        pastPron:"/lɪt/",            participle:"lit",        partPron:"/lɪt/",          spanish:"encender" },
  { infinitive:"ride",       pron:"/raɪd/",         past:"rode",       pastPron:"/roʊd/",           participle:"ridden",     partPron:"/ˈrɪdən/",       spanish:"montar" },
  { infinitive:"rise",       pron:"/raɪz/",         past:"rose",       pastPron:"/roʊz/",           participle:"risen",      partPron:"/ˈrɪzən/",       spanish:"levantarse" },
  { infinitive:"shake",      pron:"/ʃeɪk/",         past:"shook",      pastPron:"/ʃʊk/",            participle:"shaken",     partPron:"/ˈʃeɪkən/",      spanish:"sacudir" },
  { infinitive:"shine",      pron:"/ʃaɪn/",         past:"shone",      pastPron:"/ʃoʊn/",           participle:"shone",      partPron:"/ʃoʊn/",         spanish:"brillar" },
  { infinitive:"shoot",      pron:"/ʃuːt/",         past:"shot",       pastPron:"/ʃɒt/",            participle:"shot",       partPron:"/ʃɒt/",          spanish:"disparar" },
  { infinitive:"sink",       pron:"/sɪŋk/",         past:"sank",       pastPron:"/sæŋk/",           participle:"sunk",       partPron:"/sʌŋk/",         spanish:"hundirse" },
  { infinitive:"spread",     pron:"/sprɛd/",        past:"spread",     pastPron:"/sprɛd/",          participle:"spread",     partPron:"/sprɛd/",        spanish:"extender" },
  { infinitive:"spring",     pron:"/sprɪŋ/",        past:"sprang",     pastPron:"/spræŋ/",          participle:"sprung",     partPron:"/sprʌŋ/",        spanish:"saltar" },
  { infinitive:"strike",     pron:"/straɪk/",       past:"struck",     pastPron:"/strʌk/",          participle:"struck",     partPron:"/strʌk/",        spanish:"golpear" },
  { infinitive:"string",     pron:"/strɪŋ/",        past:"strung",     pastPron:"/strʌŋ/",          participle:"strung",     partPron:"/strʌŋ/",        spanish:"enfilar" },
  { infinitive:"swear",      pron:"/swɛər/",        past:"swore",      pastPron:"/swɔːr/",          participle:"sworn",      partPron:"/swɔːrn/",       spanish:"jurar" },
  { infinitive:"sweep",      pron:"/swiːp/",        past:"swept",      pastPron:"/swɛpt/",          participle:"swept",      partPron:"/swɛpt/",        spanish:"barrer" },
  { infinitive:"swing",      pron:"/swɪŋ/",         past:"swung",      pastPron:"/swʌŋ/",           participle:"swung",      partPron:"/swʌŋ/",        spanish:"columpiarse" },
  { infinitive:"teach",      pron:"/tiːtʃ/",        past:"taught",     pastPron:"/tɔːt/",           participle:"taught",     partPron:"/tɔːt/",         spanish:"enseñar" },
  { infinitive:"tear",       pron:"/tɛər/",         past:"tore",       pastPron:"/tɔːr/",           participle:"torn",       partPron:"/tɔːrn/",        spanish:"rasgar" },
  { infinitive:"wear",       pron:"/wɛər/",         past:"wore",       pastPron:"/wɔːr/",           participle:"worn",       partPron:"/wɔːrn/",        spanish:"llevar" },
  { infinitive:"win",        pron:"/wɪn/",          past:"won",        pastPron:"/wʌn/",            participle:"won",        partPron:"/wʌn/",          spanish:"ganar" }
];

const MODES = {
  MENU: "menu",
  STUDY: "study",
  QUIZ: "quiz",
  RESULTS: "results"
};

const QUIZ_TYPES = [
  { key: "inf2past", label: "Infinitivo → Pasado" },
  { key: "past2part", label: "Pasado → Participio" },
  { key: "inf2part", label: "Infinitivo → Participio" },
  { key: "spanish2inf", label: "Español → Infinitivo" },
  { key: "all", label: "Aleatorio" }
];

export default function App() {
  const [mode, setMode] = useState(MODES.MENU);
  const [currentVerbIdx, setCurrentVerbIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizType, setQuizType] = useState("all");
  const [showHint, setShowHint] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const inputRef = useRef(null);

  const generateQuestions = useCallback((type, useWrongOnly = false) => {
    const verbsToUse = useWrongOnly && wrongAnswers.length > 0 ? wrongAnswers : verbs;
    const newQuestions = [];
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const verbsShuffled = shuffle([...verbsToUse]).slice(0, 10);

    verbsShuffled.forEach((verb) => {
      let modes = [];
      if (type === "all") {
        modes = shuffle([...QUIZ_TYPES.filter(qt => qt.key !== "all")]).slice(0, 2);
      } else {
        modes = [QUIZ_TYPES.find(qt => qt.key === type)];
      }

      modes.forEach((mode) => {
        let question = {};
        switch (mode.key) {
          case "inf2past":
            question = { verb, type: "inf2past", question: verb.infinitive, correct: verb.past, pronunciation: verb.pastPron };
            break;
          case "past2part":
            question = { verb, type: "past2part", question: verb.past, correct: verb.participle, pronunciation: verb.partPron };
            break;
          case "inf2part":
            question = { verb, type: "inf2part", question: verb.infinitive, correct: verb.participle, pronunciation: verb.partPron };
            break;
          case "spanish2inf":
            question = { verb, type: "spanish2inf", question: verb.spanish, correct: verb.infinitive, pronunciation: verb.pron };
            break;
          default:
            break;
        }
        newQuestions.push(question);
      });
    });

    setQuestions(newQuestions);
    setAnswers([]);
    setScore(0);
    setCurrentVerbIdx(0);
    setAnswerInput("");
    setShowHint(false);
  }, [wrongAnswers]);

  const startQuiz = useCallback(() => {
    generateQuestions(quizType, false);
    setMode(MODES.QUIZ);
  }, [quizType, generateQuestions]);

  const startWrongOnlyQuiz = useCallback(() => {
    if (wrongAnswers.length > 0) {
      generateQuestions(quizType, true);
      setMode(MODES.QUIZ);
    }
  }, [quizType, generateQuestions, wrongAnswers]);

  const speak = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }, []);

  const checkAnswer = useCallback(() => {
    if (currentVerbIdx < questions.length) {
      const current = questions[currentVerbIdx];
      const isCorrect = answerInput.trim().toLowerCase() === current.correct.toLowerCase();
      
      if (!isCorrect) {
        const idx = verbs.findIndex(v => v.infinitive === current.verb.infinitive);
        if (!wrongAnswers.some(v => v.infinitive === current.verb.infinitive)) {
          setWrongAnswers([...wrongAnswers, current.verb]);
        }
      }

      setAnswers([...answers, { verb: current.verb, selected: answerInput, correct: current.correct, isCorrect, qMode: "typing" }]);
      setScore(isCorrect ? score + 1 : score);
      setAnswerInput("");
      setShowHint(false);

      if (currentVerbIdx + 1 < questions.length) {
        setCurrentVerbIdx(currentVerbIdx + 1);
        inputRef.current?.focus();
      } else {
        setMode(MODES.RESULTS);
      }
    }
  }, [currentVerbIdx, questions, answerInput, answers, score, wrongAnswers]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  }, [checkAnswer]);

  const getHint = (answer) => {
    return answer.charAt(0) + "..." + answer.slice(-1);
  };

  const wrongCount = wrongAnswers.length;
  const pct = questions.length > 0 ? Math.round((score / answers.length) * 100) : 0;

  useEffect(() => {
    if (mode === MODES.QUIZ) {
      inputRef.current?.focus();
    }
  }, [mode, currentVerbIdx]);

  return (
    <div style={{ background: darkMode ? "linear-gradient(135deg,#1e1b4b,#312e81)" : "linear-gradient(135deg,#e0e7ff,#ddd6fe)", color: darkMode ? "#fff" : "#1e1b4b", minHeight: "100vh", padding: "24px", fontFamily: "'Segoe UI',Roboto,sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* ════ HEADER ════ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>🎓 VerbMaster</h1>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 16 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* ════ MENU ════ */}
        {mode === MODES.MENU && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.12)", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, marginTop: 0 }}>¿Qué deseas hacer?</h2>
              <button onClick={() => setMode(MODES.STUDY)} style={{ width: "100%", padding: 16, borderRadius: 12, background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
                📚 Estudiar Verbos
              </button>
              <button onClick={startQuiz} style={{ width: "100%", padding: 16, borderRadius: 12, background: "linear-gradient(135deg,#f093fb,#f5576c)", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                🎯 Hacer Quiz
              </button>
            </div>

            {wrongCount > 0 && (
              <div style={{ background: "rgba(248,113,113,0.1)", borderRadius: 16, padding: 20, border: "1px solid rgba(248,113,113,0.3)" }}>
                <h3 style={{ marginTop: 0, color: "#f87171" }}>🔥 Errores Acumulados: {wrongCount}</h3>
                <button onClick={startWrongOnlyQuiz} style={{ width: "100%", padding: 14, borderRadius: 10, background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Practicar Solo Estos Verbos
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════ STUDY MODE ════ */}
        {mode === MODES.STUDY && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {verbs.slice(0, 10).map((v, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentVerbIdx(i)}
                  style={{ padding: "8px 14px", borderRadius: 8, background: currentVerbIdx === i ? "rgba(102,126,234,0.3)" : "rgba(255,255,255,0.08)", border: `1px solid ${currentVerbIdx === i ? "rgba(102,126,234,0.5)" : "rgba(255,255,255,0.2)"}`, color: "#fff", cursor: "pointer", fontSize: 12 }}
                >
                  {v.infinitive}
                </button>
              ))}
            </div>

            {currentVerbIdx < verbs.length && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.12)" }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 8px 0", color: "#a78bfa" }}>{verbs[currentVerbIdx].infinitive}</h2>
                <p style={{ margin: "0 0 16px 0", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>IPA: {verbs[currentVerbIdx].pron}</p>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <button onClick={() => speak(verbs[currentVerbIdx].infinitive)} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(102,126,234,0.2)", border: "1px solid rgba(102,126,234,0.4)", color: "#a78bfa", fontWeight: 700, cursor: "pointer" }}>
                    🔊 Infinitivo
                  </button>
                  <button onClick={() => speak(verbs[currentVerbIdx].past)} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(102,126,234,0.2)", border: "1px solid rgba(102,126,234,0.4)", color: "#a78bfa", fontWeight: 700, cursor: "pointer" }}>
                    🔊 Pasado
                  </button>
                  <button onClick={() => speak(verbs[currentVerbIdx].participle)} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(102,126,234,0.2)", border: "1px solid rgba(102,126,234,0.4)", color: "#a78bfa", fontWeight: 700, cursor: "pointer" }}>
                    🔊 Participio
                  </button>
                </div>

                <div style={{ background: "rgba(102,126,234,0.1)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>INFINITIVO</span>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0 0" }}>{verbs[currentVerbIdx].infinitive}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>PASADO</span>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0 0" }}>{verbs[currentVerbIdx].past}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>PARTICIPIO</span>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0 0" }}>{verbs[currentVerbIdx].participle}</p>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>📖 <strong>{verbs[currentVerbIdx].spanish}</strong></p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setCurrentVerbIdx(Math.max(0, currentVerbIdx - 1))} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                    ⬅️ Anterior
                  </button>
                  <button onClick={() => setCurrentVerbIdx(Math.min(verbs.length - 1, currentVerbIdx + 1))} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                    Siguiente ➡️
                  </button>
                  <button onClick={() => setMode(MODES.MENU)} style={{ flex: 1, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                    ⚙️ Menú
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ QUIZ MODE ════ */}
        {mode === MODES.QUIZ && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <span>Pregunta {currentVerbIdx + 1} de {questions.length}</span>
              <span>Correctas: {score}/{answers.length}</span>
            </div>

            {currentVerbIdx < questions.length && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: 700 }}>PREGUNTA</label>
                  <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0, color: "#a78bfa" }}>{questions[currentVerbIdx].question}</h2>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe la respuesta..."
                  style={{ width: "100%", padding: 16, borderRadius: 12, border: "2px solid rgba(102,126,234,0.4)", background: "rgba(102,126,234,0.08)", color: "#fff", fontSize: 16, marginBottom: 16, boxSizing: "border-box" }}
                />

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={checkAnswer} style={{ flex: 1, padding: 14, borderRadius: 12, background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    ✅ Confirmar
                  </button>
                  {showHint ? (
                    <button style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", color: "#fbbf24", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      💡 {getHint(questions[currentVerbIdx].correct)}
                    </button>
                  ) : (
                    <button onClick={() => setShowHint(true)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      💡 {showHint ? `Pista: ${getHint(questions[currentVerbIdx].correct)}` : "Mostrar pista"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ RESULTS ════ */}
        {mode === MODES.RESULTS && (
          <div>
            <div style={{ background: pct >= 70 ? "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(34,197,94,0.05))" : pct >= 40 ? "linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.05))" : "linear-gradient(135deg,rgba(248,113,113,0.15),rgba(239,68,68,0.05))", borderRadius: 18, padding: "36px 28px", textAlign: "center", border: `1px solid ${pct >= 70 ? "rgba(74,222,128,0.3)" : pct >= 40 ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)"}`, marginBottom: 22 }}>
              <div style={{ fontSize: 52, marginBottom: 4 }}>{pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📖"}</div>
              <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 16, marginTop: 8, color: "rgba(255,255,255,0.7)" }}>{score} de {questions.length} correctas</div>
              <div style={{ fontSize: 13, marginTop: 6, color: "rgba(255,255,255,0.45)" }}>
                {pct === 100 ? "¡Perfecto! ¡Eres un experto!" : pct >= 70 ? "¡Muy bien! Sigue practicando" : pct >= 40 ? "Vas por buen camino" : "Necesitas repasar más, ¡tú puedes!"}
              </div>
              {wrongCount > 0 && <div style={{ marginTop: 10, fontSize: 12, color: "#f87171" }}>❌ {wrongCount} verbos con errores acumulados</div>}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "rgba(255,255,255,0.6)" }}>Revisión</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 22 }}>
              {answers.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: a.isCorrect ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", borderRadius: 11, padding: "11px 14px", border: `1px solid ${a.isCorrect ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                  <span style={{ fontSize: 16 }}>{a.isCorrect ? "✅" : "❌"}</span>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => speak(a.verb?.infinitive || "")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <span style={{ fontWeight: 700, color: "#a78bfa", fontSize: 14 }}>{a.verb?.infinitive}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>🔊</span>
                    </button>
                  </div>
                  {!a.isCorrect ? (
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
                      <span style={{ color: "#f87171" }}>"{a.selected}"</span>{" → "}<span style={{ color: "#4ade80" }}>"{a.correct}"</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{a.correct}</span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={startQuiz} style={{ flex: 1, padding: "13px", borderRadius: 11, background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🔄 Repetir</button>
              {wrongCount > 0 && <button onClick={startWrongOnlyQuiz} style={{ flex: 1, padding: "13px", borderRadius: 11, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🔥 Solo errores</button>}
              <button onClick={() => setMode(MODES.MENU)} style={{ flex: 1, padding: "13px", borderRadius: 11, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>⚙️ Menú</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
        input::placeholder{color:rgba(255,255,255,0.3);}
        input:focus{border-color:rgba(102,126,234,0.7)!important;box-shadow:0 0 0 3px rgba(102,126,234,0.15);}
      `}</style>
    </div>
  );
}
