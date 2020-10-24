// -------------------------------------------------------------------------------------------
// GENERAMOS LAS VARIABLES QUE HARÁN EL LINK CON EL DOM
// -------------------------------------------------------------------------------------------
let container = document.getElementById("game");
let results = document.getElementById("punctuation");
console.log("empieza el js");
// -------------------------------------------------------------------------------------------
// LE PREGUNTAMOS AL CONCURSANTE LAS CARACTERÍSTICAS DE QUIZ QUE QUIERE 
// MEDIANTE UN FORMULARIO Y ALMACENAMOS LAS RESPUESTAS
// -------------------------------------------------------------------------------------------
// Esta variable van a ser fija
let type = "&type=" + "multiple";
let difficulty = "&difficulty=" + "easy";


let start = document.getElementById("comeOn");
start.onclick = () => {
  sessionStorage.setItem("number",document.getElementById("numUser").value);
  sessionStorage.setItem("difficulty",document.getElementById("difUser").value);
  sessionStorage.setItem("category",document.getElementById("catUser").value);
  console.log(sessionStorage.number);
  window.location.replace("question.html");
};

// -------------------------------------------------------------------------------------------
// FIJAMOS LAS PRIMERAS VARIABLES EN 0
// -------------------------------------------------------------------------------------------
let click = 0;
let aciertos = 0;
let fallos = 0;
let answerUser = [];
let questionsApiDb;
let answerCorrect = [];

// -------------------------------------------------------------------------------------------
// CREAMOS UN ARRAY DE PREGUNTAS Y RESPUESTAS PROPIO
// -------------------------------------------------------------------------------------------
let questionDb = [
  {
    question: "1 ¿Qué famoso arquitecto construyó la casa de la cascada?",
    answers: ["Mies van der Rohe", "Frank Lloyd Wright", "Antoni Gaudí"],
    image: "/quiz/img/casaCascada.jpg",
    rightAnswer: 1,
  },
  {
    question: "2 ¿Cúal es el arquitecto del museo Guggenheim de Bilbao?",
    answers: ["Frank Ghery", "Norman Foster", "Rafael Moneo"],
    image: "/quiz/img/guggenheim.jpg",
    rightAnswer: 0,
  },
  {
    question: "3 ¿Qué longitud tien la Gran Muralla China?",
    answers: ["6.400 km", "3.150 km", "840 km"],
    image: "/quiz/img/murallaChina.jpg",
    rightAnswer: 0,
  },
  {
    question: "4 ¿Qué edificio es el de la fotografía?",
    answers: [
      "Glass House, de Philip Johnson",
      "Casa Rietveld Schröder, de Gerrit Rietveld",
      "Case Study House 8, de  Charles y Ray Eames",
    ],
    image: "/quiz/img/edificio01.jpg",
    rightAnswer: 1,
  },
  {
    question: "5 ¿Dónde nació Norman Foster?",
    answers: ["Inglaterra", "Australia", "Nueva Zelanda"],
    image: "/quiz/img/normanFoster.jpg",
    rightAnswer: 0,
  },
  {
    question:
      "6  ¿Cuál de los siguientes arquitectos no participó en eldiseño del Georges Pompidou de París?",
    answers: ["Renzo Piano", "Richard Rogers", "Norman Foster"],
    image: "/quiz/img/pompidou.jpg",
    rightAnswer: 2,
  },
  {
    question:
      "7 ¿En qué año comenzó a otorgarse el premio Pritzker de arquitectura?",
    answers: ["1979", "1992", "1963"],
    image: "/quiz/img/pritzker.png",
    rightAnswer: 0,
  },
  {
    question: "8 ¿Cuál es el edificio de la fotografía?",
    answers: [
      "Casa del Fascio",
      "Filarmónica de Berlín",
      "Asamblea de Chandigarh",
    ],
    image: "/quiz/img/chandigarh.jpg",
    rightAnswer: 2,
  },
  {
    question: "9 ¿Qué es el Modulor?",
    answers: [
      "La unidad de medida básica de la antigua Roma",
      "Un ensayo sobre la escala humana aplicada a la arquitectura",
      "Una escultura ciclópea construida en Francia",
    ],
    image: "/quiz/img/modulor.png",
    rightAnswer: 1,
  },
  {
    question:
      "10 ¿Cómo se llama el triangulo que tiene todos sus lados diferentes?",
    answers: ["Isósceles", "Escaleno", "Equilátero"],
    image: "/quiz/img/triangulo.png",
    rightAnswer: 1,
  },
];

// -------------------------------------------------------------------------------------------
// CREAMOS LA FUNCIÓN QUE SE VA A EJECUTAR CUANDO HAGAMOS CLICK
// -------------------------------------------------------------------------------------------
function cambio(index) {
  if (click < sessionStorage.number - 1) {
    answerUser[click] = index;
    click += 1;
    cardAnswers = `
    <p class="question">${questionsApiDb[click].question}</p>
    <a href="#" id="one" class="answer" onclick="cambio(0)" >a) ${questionsApiDb[click].answers[0]}</a>
    <a href="#" id="two" class="answer" onclick="cambio(1)">b) ${questionsApiDb[click].answers[1]}</a>
    <a href="#" id="third" class="answer" onclick="cambio(2)">c) ${questionsApiDb[click].answers[2]}</a>
    <a href="#" id="four" class="answer" onclick="cambio(3)">d) ${questionsApiDb[click].answers[3]}</a>
    `;
    container.innerHTML = cardAnswers;
    // console.log("answerUser", answerUser);
    // console.log("click", click);
  } else {
    answerUser[sessionStorage.number - 1] = index;
    // console.log("Respuestas del usuario", answerUser);
    comparar(answerCorrect, answerUser);
  }
}

// -------------------------------------------------------------------------------------------
// CREAMOS LA FUNCIÓN QUE SE VA A EJECUTAR CUANDO TERMINEMOS DE CONTESTAR
// -------------------------------------------------------------------------------------------
function comparar(correcta, usuario) {
  for (i = 0; i < sessionStorage.number; i++) {
    if (correcta[i] == usuario[i]) {
      aciertos++;
    } else {
      fallos++;
    }
  }
  let mensaje;
  // console.log("aciertos " + aciertos);
  // console.log("fallos " + fallos);

  if (aciertos == sessionStorage.number) {
    mensaje = "YOU ARE A GENIOUS!";
  } else if (aciertos > fallos) {
    mensaje = "VERY GOOD!";
  } else {
    mensaje = "YOU SHOULD TRY IT AGAIN...";
  }

  let cardResults = `
        <div id="punctuation">
        <p class="text">${mensaje}</p>
        <p class="results"><span id="hits">${aciertos}</span> HITS<br><span id="faults">${fallos}</span> FAULTS</p>
        <a class="button" class="special" href="question.html">TRY AGAIN!</a>
        </div>
        `;
  container.innerHTML = cardResults;
}

// -------------------------------------------------------------------------------------------
// CAPTURAMOS LA BASE DE DATOS DE PREGUNTAS Y RESPUESTAS DESDE UNA API
// -------------------------------------------------------------------------------------------
fetch(
  "https://opentdb.com/api.php?amount=" +  sessionStorage.number +  // category +  // difficulty +    type
)
  .then((response) => response.json())
  .then((Api) => {
    // Imprimimos la API para conocer su estructura
    // console.log("Esta es la API (Api.results)", Api.results);
    // sessionStorage.number = Api.results.length;
    // console.log("Longitud de la API (Api.results.length)", Api.results.length);
    // console.log("Número de preguntas (number)", number);
    // console.log("El contador de click está a", click);
    //----------Creamos un array con la misma estructura que nuestra questionDb (questionsApiDb)
    questionsApiDb = Api.results.map((item) => {
      //---------- A la nueva clave 'answers' le asignamos el valor de las respuestas incorrectas
      let allAnswers = (item.answers = item.incorrect_answers);
      //----------A la nueva clave 'answers' le añadimos la respuesta correcta
      allAnswers = allAnswers.push(item.correct_answer);
      //----------A la nueva clave 'answers' le aplicamos la función desorden
      function shuffle(array) {
        let currentIndex = array.length,
          temporaryValue,
          randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
      shuffle(item.answers);
      //----------A la nueva clave 'rightAnswer' le asignamos el índice que ocupa en las 'answers'
      let indiceCorrecto = (item.rightAnswer = item.answers.indexOf(
        item.correct_answer
      ));

      //----------Borramos las claves que no necesitamos
      delete item.category;
      delete item.type;
      delete item.difficulty;
      delete item.correct_answer;
      delete item.incorrect_answers;

      return item;
    });
    // console.log("Aquí están almacenadas las respuestas correctas (answerCorrect)",answerCorrect);
    // ---------Aquí se cierra el .map ||||
    // ---------Creamos un array con las respuestas correctas
    for (i = 0; i < sessionStorage.number; i++) {
      answerCorrect.push(questionsApiDb[i].rightAnswer);
    }
    let cardAnswers = `
    <p class="question">${questionsApiDb[click].question}</p>
    <a href="#" id="one" class="answer" onclick="cambio(0)" >a) ${questionsApiDb[click].answers[0]}</a>
    <a href="#" id="two" class="answer" onclick="cambio(1)">b) ${questionsApiDb[click].answers[1]}</a>
    <a href="#" id="third" class="answer" onclick="cambio(2)">c) ${questionsApiDb[click].answers[2]}</a>
    <a href="#" id="four" class="answer" onclick="cambio(3)">d) ${questionsApiDb[click].answers[3]}</a>
    `;
    container.innerHTML = cardAnswers;
    // console.log("Esta es la Api ordenada (questionsApiDb)", questionsApiDb);
  });
// ---------Aquí se cierra el fetch ||||
