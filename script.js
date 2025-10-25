let quizData = null;
let originalQuestionContainerHTML = "";

document.addEventListener("DOMContentLoaded", function(){
  fetch('quiz-data.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    initSections();
  })
  .catch(error => console.error('Error loading quiz data', error));
});

function initSections(){
  originalQuestionContainerHTML = document.getElementById("question-container").innerHTML
  let allEle = document.querySelectorAll(".section");
  allEle.forEach(ele =>{
    ele.addEventListener("click", ()=>{
      const selectedSection = parseInt(ele.getAttribute("data-section"));
      startQuiz(selectedSection);
    })
  })
}

function startQuiz(index){
  let score = 0;
  let answerSelected = false;
  let questionNo = 0;
  let questionsArray = quizData.sections[index].questions;
  let quizContainer = document.getElementById("quiz-container");
  let questionContainer = document.getElementById("question-container");

  questionContainer.innerHTML = originalQuestionContainerHTML;

  let question = document.getElementById("question");
  let options = document.getElementById("options");
  let nextButton = document.getElementById("next-button");
  let count = document.getElementById("count")

  quizContainer.style.display = "none";
  questionContainer.style.display = "block";
  showQuestions(questionsArray);


  function showQuestions(questionsArray){
    if(questionNo==questionsArray.length-1){
      nextButton.textContent = "Submit"
    }
    
    let jsonObject = questionsArray[questionNo]
    question.textContent = jsonObject.question;
    options.innerHTML = ""

    if(jsonObject.questionType === "mcq"){
      jsonObject.options.forEach((option)=>{
        let optionEle = document.createElement("div");
        optionEle.textContent=option;
        optionEle.addEventListener("click", ()=>{
          optionEle.classList.add("selected");
          checkAnswer(optionEle.textContent, jsonObject.answer);
        });
        options.appendChild(optionEle);
      })
    }else{
      let inputEle = document.createElement("input");
      inputEle.type=jsonObject.questionType;

      let submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit Answer";
      submitBtn.classList.add("submit-answer")

      submitBtn.addEventListener("click", ()=>{
        if(!answerSelected){
          checkAnswer(inputEle.value.toString(), jsonObject.answer.toString());
        }
      })

      options.appendChild(inputEle);
      options.appendChild(submitBtn);
    }

  }

  function checkAnswer(option, answer){
     if(!answerSelected){
      answerSelected = true;
      let showScore = document.getElementById("score")
      let feedback = document.createElement("div");
      feedback.classList.add("feedback")
      feedback.id = "feedback"; 
      if (option.trim().toLowerCase()===answer.trim().toLowerCase()){
        score++;
        feedback.textContent = `Correct: ${answer}`;
        feedback.style.color = "green";
        showScore.textContent = `Total Score is: ${score}`
      }else{
        feedback.textContent = `Wrong. Correct Answer is "${answer}"`;
        feedback.style.color = "red";
      }
      options.appendChild(feedback);
     }
    }

    nextButton.addEventListener("click", ()=>{
      questionNo++;
      if(questionNo<questionsArray.length){
        count.textContent = `${questionNo+1}/${questionsArray.length}`
        answerSelected = false;
        showQuestions(questionsArray);
      }else{
        function endQuiz(){
          questionContainer.innerHTML = 
          `<h1>Quiz Completed!</h1>
          <p>Your final score: ${score}/${questionsArray.length}</p>
          <button id="home-button">Exit</button>
          `
          document.getElementById("home-button").addEventListener("click", ()=>{
            quizContainer.style.display = "grid"
            questionContainer.style.display = "none"
          })
        }
        endQuiz()
      }
    })
}