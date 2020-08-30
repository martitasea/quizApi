// -------------------------------------------------------------------------------------------
// GENERAMOS LAS VARIABLES QUE HARÁN EL LINK CON EL DOM
// -------------------------------------------------------------------------------------------
let container = document.getElementById("game");
let results = document.getElementById("punctuation");

// -------------------------------------------------------------------------------------------
// LE PREGUNTAMOS AL CONCURSANTE LAS CARACTERÍSTICAS DE QUIZ QUE QUIERE
// -------------------------------------------------------------------------------------------
// let difficulty = prompt("¿qué nivel de dificultad quieres?");
// let number=prompt("¿cuantas preguntas quieres?");
// let category=prompt("¿qué categoría quieres?");
// let type=prompt("¿qué tipo de preguntas quieres?");
let number = 5;
let category = 18;
let type = "multiple";
let difficulty = "easy";

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
// CREAMOS LA FUNCIÓN QUE SE VA A EJECUTAR CUANDO HAGAMOS CLICK
// -------------------------------------------------------------------------------------------
function cambio(index) {
  if (click < number - 1) {
    click += 1;
    cardAnswers = `
    <p class="question">${questionsApiDb[click].question}</p>
    <a href="#" id="one" class="answer" onclick="cambio(0)" >a) ${questionsApiDb[click].answers[0]}</a>
    <a href="#" id="two" class="answer" onclick="cambio(1)">b) ${questionsApiDb[click].answers[1]}</a>
    <a href="#" id="third" class="answer" onclick="cambio(2)">c) ${questionsApiDb[click].answers[2]}</a>
    <a href="#" id="four" class="answer" onclick="cambio(3)">d) ${questionsApiDb[click].answers[3]}</a>
    `;
    container.innerHTML = cardAnswers;
    answerUser[click] = index;
    console.log("answerUser", answerUser);
    console.log("click", click);
  } else {
    answerUser[number - 1] = index;
    console.log("Respuestas del usuario", answerUser);
    comparar(answerCorrect, answerUser);
  }
}

// -------------------------------------------------------------------------------------------
// CREAMOS LA FUNCIÓN QUE SE VA A EJECUTAR CUANDO TERMINEMOS DE CONTESTAR
// -------------------------------------------------------------------------------------------
function comparar(correcta, usuario) {
  for (i = 0; i < number; i++) {
    if (correcta[i] == usuario[i]) {
      aciertos++;
    } else {
      fallos++;
    }
  }
  let mensaje;
  console.log("aciertos " + aciertos);
  console.log("fallos " + fallos);

  if (aciertos == number) {
    mensaje = "YOU ARE A GENIOUS!";
  } else if (aciertos > fallos) {
    mensaje = "VERY GOOD!";
  } else {
    mensaje = "YOU SHOULD TRY IT AGAIN..";
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
// CREAMOS LA FUNCIÓN QUE DESORDENARÁ EL ARRAY CON LAS RESPUESTAS (allAnswers)
// -------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------
// CAPTURAMOS LA BASE DE DATOS DE PREGUNTAS Y RESPUESTAS DESDE UNA API
// -------------------------------------------------------------------------------------------
fetch(
  "https://opentdb.com/api.php?amount=" +
    number +
    "&category=" +
    category +
    "&difficulty=" +
    difficulty +
    "&type=" +
    type
)
  .then((response) => response.json())
  .then((Api) => {
    // Imprimimos la API para conocer su estructura
    console.log("Esta es la API (Api.results)", Api.results);
    let number = Api.results.length;
    console.log("Longitud de la API (Api.results.length)", Api.results.length);
    console.log("Número de preguntas (number)", number);
    console.log("El contador de click está a", click);
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
    console.log(
      "Aquí están almacenadas las respuestas correctas (answerCorrect)",
      answerCorrect
    );
    // ---------Aquí se cierra el .map ||||
    // ---------Creamos un array con las respuestas correctas
    for (i = 0; i < number; i++) {
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
    console.log("Esta es la Api ordenada (questionsApiDb)", questionsApiDb);
  });
// ---------Aquí se cierra el fetch ||||
