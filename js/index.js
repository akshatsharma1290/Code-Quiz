const quiz_card = document.querySelector('.quiz-cards')
const loader = document.querySelector(".load")
const html = document.getElementsByTagName("html")[0]


const windowLoad = () => {
    // Storing the levels after data is fetched to store all of them 
    const levels = Array.from(document.querySelectorAll(".levels"));

    // Storing the clicked level and language into session Storage to access them into quiz.html
    levels.forEach((e) => {
        e.addEventListener("click", () => {
            sessionStorage.setItem("clicked_lang", e.dataset.lang);
            sessionStorage.setItem("clicked_level", e.dataset.level);
            sessionStorage.setItem("clicked_quiz", e.dataset.quiz);
            
                sessionStorage.setItem("quiz_id", e.dataset.id)
            

        });
    });

    if(sessionStorage.getItem("quizmade") == "yes"){
        window.scrollTo(0 , document.body.scrollHeight) 
    }
    

    // if user come back to home page it will clear all his session Storage 

    sessionStorage.clear()
}


// Api of google sheets user quiz data 
let url = "https://script.google.com/macros/s/AKfycbzVXeOcniqSx1Z3a9Cu3euBuhbviGq97-MGFkKct8O78-pZw4RaGInW7G3cmGvyQXFUmA/exec"

let f
let resp
const fetchQuiz = async () => {
    f = await fetch(url)
    resp = await f.json()
    return resp
}

let data
const showingQuiz = async () => {
    try {
        await fetchQuiz()
        // Adding Users Quizzes into html 
        for (let i = 0; i < resp['data'][0]['obj'].length; i++) {
            data = JSON.parse(resp['data'][0]['obj'][i])
            quiz_card.insertAdjacentHTML("beforeend", `<div class="card user-quiz-${i}">
            <p class="quiz-name">${data['quiz-name']}</p>
            <article class="quiz-desc">
             Let's see how much ${data['quiz-name']} knowledge you got
            </article>
            <div class="difficulty">
              <p>Difficulty Level</p>
              <a
                href="quiz.html"
                class="levels"
                data-level="${data['quiz-level']}"
                data-lang="${data['quiz-name']}"
                data-id="${i}"
                > ${data['quiz-level']} <i class="fa-solid fa-circle-play"></i
              ></a>
            </div>
            </div> `)
        }

        windowLoad()
    } catch (error) {
    }

    loader.classList.add("none")
    html.classList.remove("overflow-y-hidden")


}


showingQuiz()
