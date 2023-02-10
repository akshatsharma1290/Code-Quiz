const quiz_lang = Array.from(document.querySelectorAll(".lang"));
const quiz_level = Array.from(document.querySelectorAll(".level"));
const count_question = document.querySelector(".count");
const exit = document.querySelector(".exit");
const modal = Array.from(document.querySelectorAll(".modal"));
const modal_box = Array.from(document.querySelectorAll(".modal-box"));
const close_modal = Array.from(document.querySelectorAll(".close-modal"));
const notQuit = document.querySelector(".not-quit");
const title = document.getElementsByTagName("title")[0];
const next_btn = document.querySelector(".next");
const question = document.querySelector(".quest");
const choice = Array.from(document.querySelectorAll(".choices"));
const timer = document.querySelector(".time");
const time_box = document.querySelector(".timer");
const sk_load = Array.from(document.querySelectorAll(".skeleton-load"));
const sk_box = Array.from(document.querySelectorAll(".skeleton-box"));
const sl = Array.from(document.querySelectorAll(".sl"))
let f;
let response;
let options = []
let answer;
let card_timer
let timer_limit = 0
let count = 1;
let question_limit
let selected
let index


// Getting lang and level from session Storage and setting them on html elements
let clicked_lang = sessionStorage.getItem("clicked_lang")
let clicked_level = sessionStorage.getItem("clicked_level")
let clicked_quiz = sessionStorage.getItem("clicked_quiz")
let quiz_id = Number(sessionStorage.getItem("quiz_id"))


// Clearing no-useable sessionStorage Storage
sessionStorage.clear()

// keeping only important ones 
sessionStorage.setItem("all-loaded", "false")
sessionStorage.setItem("clicked_lang", clicked_lang)
sessionStorage.setItem("clicked_level", clicked_level)
sessionStorage.setItem("clicked_quiz", clicked_quiz)

// Storing Variable values to html elements to show them in quiz

quiz_lang.forEach((el) => {
    el.textContent = clicked_lang;
});
quiz_level.forEach((el) => {
    el.textContent = clicked_level;
});
title.textContent = `${clicked_lang} Quiz`;

// Making a Class to move between choices

class keySwitch {
    constructor(a, b, c) {
        this.a = a
        this.b = b
        this.c = c
    }

    Switch() {
        if (selected == undefined) {
            choice[this.a].click()
        } else if (selected == choice[this.b]) {
            choice[this.a].click()
        } else {
            index = choice.indexOf(selected)
            choice[index + this.c].click()
        }

    }


}

let keys_4
let keys_2

// Detecting the amount of choices available and using the class keySwitch

const keyDetect = (a, b, c, d, e, f) => {
    for (const i of choice) {
        if (i.matches(".selected")) {
            selected = i
        }
    }


    if (choice[2].matches(".none") && choice[3].matches(".none")) {
        keys_2 = new keySwitch(d, e, f)
        keys_2.Switch()
    } else {
        keys_4 = new keySwitch(a, b, c)
        keys_4.Switch()
    }



}

// Running function based on 4options or 2options 
const keyDown = (event) => {

    if (event.key == "ArrowUp") {
        // The first three parameters are used if question has 4 choice else other 3 will work 
        keyDetect(3, 0, -1, 1, 0, -1)

    } else if (event.key == "ArrowDown") {
        // The first three parameters are used if question has 4 choice else other 3 will work 
        keyDetect(0, 3, 1, 0, 1, 1)

    }



}

// Keypresses has be switched of when a modal is opened to make this task simple i made a class and its methods to do that 

class Keypress {
    remove() {
        window.removeEventListener("keypress", keyPress)
        window.removeEventListener("keydown", keyDown)
    }
    add() {
        window.addEventListener("keypress", keyPress)
        window.addEventListener("keydown", keyDown)
    }


}

let newKey = new Keypress()

// Showing Modal on Exiting Quiz and going back to index.html
exit.addEventListener("click", () => {
    newKey.remove()
    modal[1].showModal()
    notQuit.addEventListener("click", () => {
        modal[1].close()
        newKey.add()
    })
    close_modal[1].addEventListener("click", () => {
        modal[1].close()
        window.location.href = "index.html"
        sessionStorage.clear()
    })

});

// When data is successfully fetched skeleon loading will disappear and question & answer will appear
const removeSkeleton = () => {
    for (const i of sk_load) {
        i.classList.remove("skeleton-load")

    }
    for (const i of sk_box) {
        i.classList.remove("skeleton-box")
    }


}



// Fetching data from google sheets 

// Google Sheets Api of quizzes 
const userSheet_Api = "https://script.google.com/macros/s/AKfycbzVXeOcniqSx1Z3a9Cu3euBuhbviGq97-MGFkKct8O78-pZw4RaGInW7G3cmGvyQXFUmA/exec"


// Fetching Data 
const fetchData = async () => {    
        f = await fetch(userSheet_Api)
        response = await f.json()
        return response

}


// Storing the Fetched data to check answers on result.html
let data
const storeData = () => {
       sessionStorage.setItem("quiz-data", response['data'][0]['obj'][quiz_id])
        data = JSON.parse(sessionStorage.getItem("quiz-data"))
        question_limit = Number(data['question-limit'])
        sessionStorage.setItem("question_limit", question_limit)
        card_timer = Number(data['timing'])
    
}



// Setting values of question and answers
const settingValues = () => {
    count_question.textContent = count;

        question.textContent = data[`question${count}`]
        for (let i = 1; i <= choice.length; i++) {

            choice[i - 1].textContent = data[`q${count}option${i}`]

        
    }

    // checking the options available and showing them

    timer.textContent = card_timer;
    if (choice[2].textContent == "" && choice[3].textContent == "") {
        choice[2].classList.add("none")
        choice[3].classList.add("none")
    } else {
        choice[2].classList.remove("none")
        choice[3].classList.remove("none")

    }



}




// Making a Time Limi of each question 
let int;
const startTimer = () => {
    int = setInterval(() => {
        card_timer--
        timer.textContent = card_timer
        if (card_timer == 0) {
            clearInterval(int)
            showNext()
        }
    }, 1000);
}

// Reseting The Timer on each question
const resetTimer = () => {
    card_timer = 30
    clearInterval(int)
}



// Showing rules when data is successfully fetched 
const loadRules = async () => {

    modal[0].showModal()
    document.querySelector(".perquestion-time").textContent = data['timing']
    close_modal[0].addEventListener("click", () => {
        modal[0].close()
        startTimer()
        sessionStorage.setItem("all-loaded", "done")
        newKey.add()



    })

}




// Waiting for data and running all the necessary functions
const runQuiz = async () => {
    try {
        await fetchData()
    } catch (error) {
        modal[3].showModal()
        close_modal[4].addEventListener("click", () => {
            modal[3].close()
            window.location.href = "index.html"
        })

    }
    storeData()
    removeSkeleton()
    loadRules()
    settingValues()
}
runQuiz()

// Reseting the selected Answers on each question 
const removeSelect = () => {

    for (const k of choice) {
        k.classList.remove("selected")
    }


}

// Showing a small Skeleton loading on each question before putting its values

const nextAnimate = () => {
    resetTimer()
    let skt = Array.from(document.querySelectorAll(".s"))
    let sktl = Array.from(document.querySelectorAll(".sl"))
    skt.forEach((e) => {
        e.classList.add("skeleton-load")
        e.classList.add("skeleton-box")
    })
    sktl.forEach((e) => {
        e.classList.add('skeleton-load')
        e.classList.add('skt-choice')
    })
    setTimeout(() => {
        removeSkeleton()

        for (const i of sl) {
            i.classList.remove("skt-choice")
        }
    }, 500);
}

// Storing The user Answers by using the attributes of options In an Object and then storing the object into on session storage to check answers on result.html
let userObj = {}
choice.forEach((e) => {
    e.addEventListener("click", () => {
        for (const i of choice) {
            if (i == e) {
                i.classList.add("selected")
                userObj[count] = i.dataset.option
            } else {
                i.classList.remove("selected")

            }
        }
    })
})


// Going to the next question on clicking Next or by Entering
const showNext = () => {
    count++
    selected = undefined
    // Going to result.html when all questions are done 
    if (count > question_limit) {
        sessionStorage.setItem("userans", JSON.stringify(userObj))
        window.location.href = "result.html"
    }
    nextAnimate()
    settingValues()
    startTimer()
    removeSelect()
}


next_btn.addEventListener("click", showNext)

const keyPress = (event) => {
    if (event.key == "Enter") {
        showNext()
    }
}

// Storing a variable to check how many time user cheated 
sessionStorage.setItem("usercheat", "0")

// If user Switches Tab then incrementing the value of usercheat and showing a warning . Next time closing the quiz and going to index.html 

const switchTab = () => {
    if (sessionStorage.getItem("all-loaded") == "done") {

        if (document.visibilityState != "visible") {
            newKey.remove()

            resetTimer()
            if (sessionStorage.getItem("usercheat") == 1) {
                document.querySelector(".cheat-modal-box p").innerHTML = "You have been caught again. Now you have to start quiz again."
                modal[2].showModal()
                close_modal[3].addEventListener("click", () => {
                    modal[2].close()
                    window.location.href = "index.html"
                    sessionStorage.setItem("usercheat", 0)
                    startTimer()
                })

            } else {
                modal[2].showModal()
                let c = sessionStorage.getItem("usercheat")
                c++
                sessionStorage.setItem("usercheat", c)

                close_modal[3].addEventListener("click", () => {
                    modal[2].close()
                    startTimer()
                    newKey.add()

                })

            }

        }

    }

}

window.addEventListener("visibilitychange", switchTab)
