const modal = document.querySelector(".modal");
const close_modal = document.querySelector(".close-modal")
const notClose_modal = document.querySelector(".not-quit")
const exit = document.querySelector(".exit");
const quiz_lang = Array.from(document.querySelectorAll(".lang"));
const quiz_level = Array.from(document.querySelectorAll(".level"));
const rightAns = document.querySelector(".right-ans")
const ques = document.querySelector(".questions")
const sub_title = document.querySelector(".sub-title")
const result_cards = document.querySelector(".result-cards")
let questions = 25;


// Modal to exit result page 
exit.addEventListener("click", () => {
    modal.showModal()
    close_modal.addEventListener("click", () => {
        modal.close()
        window.location.href = "index.html"
        sessionStorage.clear()
    })
    notClose_modal.addEventListener("click", () => {
        modal.close()
    })
})


// Getting lang and level from session Storage and setting them on html elements
let clicked_lang = sessionStorage.getItem("clicked_lang")
let clicked_level = sessionStorage.getItem("clicked_level")
let clicked_quiz = sessionStorage.getItem("clicked_quiz")

if (clicked_quiz == "user") {
    questions = Number(sessionStorage.getItem("question_limit"))
    ques.textContent = questions

} else {
    ques.textContent = questions

}

quiz_lang.forEach((el) => {
    el.textContent = clicked_lang;
});
quiz_level.forEach((el) => {
    el.textContent = clicked_level;
});


// Getting userAnswers and data  from session storage 
let userAns = JSON.parse(sessionStorage.getItem("userans"))
let data = JSON.parse(sessionStorage.getItem("quiz-data"))
let rightAnswers = 0
let rightAnsObj = []
// Checking The Users Answers with Right Answers based on if it's premade or made by user bcz both have different format to access them 

if (clicked_quiz == "premade") {

    for (let i = 1; i <= questions; i++) {

        if (data[i]['answer'] == userAns[i]) {
            rightAnswers++
            rightAnsObj.push(true)
        } else {
            rightAnsObj.push(false)
        }

    }
} else {

    for (let i = 1; i <= questions; i++) {

        if (data[`question${i}Answer`] == userAns[i]) {
            rightAnswers++
            rightAnsObj.push(true)
        } else {
            rightAnsObj.push(false)
        }

    }
}

// Showing the result based on right questions 
if (rightAnswers == questions) {
    sub_title.textContent = "Congrats, You got all questions right!"
} else if (rightAnswers == 0) {
    sub_title.textContent = "Oh no, You got all questions wrong."
} else {
    rightAns.textContent = rightAnswers
}


let resultHtml = ""
// Inserting all the questions cards into html 
for (let i = 1; i <= questions; i++) {

    resultHtml += `
    <section id="quiz-box">
    <header>
      <p>
        <span class="lang">${clicked_lang}</span> Quiz
        </p>
        <p class="attempt"></p>
      <p class="result-icon">
    
      </p>
    </header>
    <main>
      <p class="question">
        Q<span class="count">${i}</span> <span class="quest"></span>
      </p>
      <div class="multiple-choice">
        <div class="choice-1 choices" data-option="1"></div>
        <div class="choice-2 choices" data-option="2"></div>
        <div class="choice-3 choices" data-option="3"></div>
        <div class="choice-4 choices" data-option="4"></div>
      </div>
    </main>
  </section>`



}
result_cards.innerHTML = resultHtml

const quest = Array.from(document.querySelectorAll(".quest"))
const choice_1 = Array.from(document.querySelectorAll(".choice-1"))
const choice_2 = Array.from(document.querySelectorAll(".choice-2"))
const choice_3 = Array.from(document.querySelectorAll(".choice-3"))
const choice_4 = Array.from(document.querySelectorAll(".choice-4"))

for (let i = 1; i <= questions; i++) {
    if (clicked_quiz == "premade") {

        quest[i - 1].textContent = data[i]['question']
        choice_1[i - 1].textContent = data[i]['option1']
        choice_2[i - 1].textContent = data[i]['option2']
        choice_3[i - 1].textContent = data[i]['option3']
        choice_4[i - 1].textContent = data[i]['option4']
    } else {
        quest[i - 1].textContent = data[`question${i}`]
        choice_1[i - 1].textContent = data[`q${i}option1`]
        choice_2[i - 1].textContent = data[`q${i}option2`]
        choice_3[i - 1].textContent = data[`q${i}option3`]
        choice_4[i - 1].textContent = data[`q${i}option4`]

    }

    if (choice_3[i - 1].textContent == "" && choice_4[i - 1].textContent == "") {
        choice_3[i - 1].classList.add("none")
        choice_4[i - 1].classList.add("none")
    } else {
        choice_3[i - 1].classList.remove("none")
        choice_4[i - 1].classList.remove("none")

    }

}

const quiz_box = Array.from(document.querySelectorAll("#quiz-box"))
const result_icon = Array.from(document.querySelectorAll(".result-icon"))
let options;
let att;

for (let i = 0; i < quiz_box.length; i++) {

    options = Array.from(quiz_box[i].querySelectorAll(".choices"))
    att = Array.from(quiz_box[i].querySelectorAll(".attempt"))
    if (clicked_quiz == "premade") {

        for (const k of options) {

            if (k.dataset.option == data[i + 1]['answer']) {
                k.classList.add("right")
            } else if (k.dataset.option == userAns[i + 1] && k.dataset.option != data[i + 1]['answer']) {
                k.classList.add("wrong")

            }

        }
    } else {
        for (const k of options) {

            if (k.dataset.option == data[`question${i+1}Answer`]) {
                k.classList.add("right")
            } else if (k.dataset.option == userAns[i + 1] && k.dataset.option != data[`question${i+1}Answer`]) {
                k.classList.add("wrong")

            }

        }
    }



    for (const j of att) {
        if (userAns[i + 1] == undefined) {
            j.textContent = "Not Attempted"
        }
    }




    if (rightAnsObj[i]) {
        result_icon[i].innerHTML = `<i class="fa-solid tick fa-check"></i>`
    } else {
        result_icon[i].innerHTML = `<i class="fa-solid xmark fa-xmark"></i>`

    }


}
