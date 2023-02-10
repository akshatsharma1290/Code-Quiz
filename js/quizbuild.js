const html = document.getElementsByTagName("html")[0]
const modal = Array.from(document.querySelectorAll(".modal"))
const notQuit = document.querySelector(".not-quit")
const close_modal = Array.from(document.querySelectorAll(".close-modal"))
const exit = document.querySelector(".exit")
const quiz_name = Array.from(document.querySelectorAll(".quiz-name"))
const rule = Array.from(document.querySelectorAll(".rule"))
const inp = Array.from(document.querySelectorAll(".quiz-inp"))
const timing = Array.from(document.querySelectorAll(".timing"))
const time_option = document.querySelector(".time-option")
const modal_time_inp = document.querySelector(".modal-time-inp")
const count = document.querySelector(".count")
const wrapper = document.querySelector(".build-wrapper")
const mcq_btn = document.querySelector(".add-mcq")
const tf_btn = document.querySelector(".add-true-false")
const save_btn = document.querySelector(".save-btn")
const save_quiz_span = document.querySelector(".save-quiz-load span")
const desktop = document.querySelector(".desktop")
const mobile = document.querySelector(".mobile")
const save_quiz_load = document.querySelector(".save-quiz-load")
const homeBtn = document.querySelector(".home-btn")
let quiz_saved;
let question_count = 0

// Media Query for inserting Quiz Details html based on size (doing this because of some layout problem)
function media(x) {
  if (x.matches) {
    desktop.remove()
    wrapper.insertAdjacentElement("afterbegin", mobile)
  } else {
    mobile.remove()
    wrapper.insertAdjacentElement("afterbegin", desktop)
  }
}

const x = window.matchMedia("(max-width:767px)")
media(x)
x.addEventListener("change", media)


// Exit Quiz Builder going back to index.html
exit.addEventListener("click", () => {
  modal[0].showModal()
  notQuit.addEventListener("click", () => {
    modal[0].close()
  })
  close_modal[0].addEventListener("click", () => {
    modal[0].close()
    window.location.href = "index.html"
    sessionStorage.clear()
  })

});


// If Quiz name is greater than 15 then shaking the input and showing the rule
quiz_name.forEach((e) => {

  e.addEventListener("input", () => {
    if (e.value.length > 15) {
      rule[0].classList.remove("none")
      rule[3].classList.remove("none")
      e.classList.add("shake")
      e.classList.add("red-border")
    } else {
      rule[0].classList.add("none")
      rule[3].classList.add("none")
      e.classList.remove("red-border")
      e.classList.remove("shake")

    }
  })


})


// Giving User Freedom adding a custom value on questions and then adding the value to the options

timing.forEach((e) => {

  e.addEventListener("input", () => {
    if (e.value == "custom") {
      modal[1].showModal()
    }

    close_modal[2].addEventListener("click", () => {
      e.insertAdjacentHTML("beforeend", `<option value="${modal_time_inp.value}">${modal_time_inp.value}sec</option>`)
      e.value = `${modal_time_inp.value}`
      modal[1].close()

    })

  })
})


// Showing The button to save quiz and add level when user have minimum 1 question
const visibleBtn = () => {
  save_btn.classList.remove("none")
}

const hideBtn = () => {
  save_btn.classList.add("none")

}

// Deleting the Question and decrementing the question count 
const deleteQuestion = () => {
  const delete_btn = Array.from(document.querySelectorAll(".delete-btn"))
  delete_btn.forEach((e) => {
    e.addEventListener("click", () => {
      try {
        document.querySelector(`.build-part-${e.dataset.count}`).remove()

      } catch (error) {
        "unwanted Error"
      }
      question_count--
      if (question_count == 0) {
        hideBtn()
      }
    })
  })
}




// Inserting A MCQ Question into the html 
const addMcq = () => {
  question_count++
  visibleBtn()
  wrapper.insertAdjacentHTML("beforeend", `<div class="build-part-${question_count + 1} build-part">
    <div class="build-heading">MCQ</div>
    <div class="container question-container">
    <div class="question-part">
        <textarea
          class="question-fill all question_${question_count} border-active"
          placeholder="Enter your question"
          name="question"
          id="question"
          cols="30"
          rows="10"
        ></textarea>  
      <div class="option-part${question_count} mcq-part">
 <div class="mcq-type opt">
          <input type="text" placeholder="Option 1" class="options
          border-active all question${question_count}_option_1" name="option-1" data-option="option-1">
          <input
            type="text"
            placeholder="Option 2"
            class="options border-active all question${question_count}_option_2"
            name="option-2"
            data-option
            ="option-2"
          />
          <input
            type="text"
            placeholder="Option 3"
            class="options border-active all question${question_count}_option_3"
            name="option-3"
            data-option
            ="option-3"
          />
          <input
            type="text"
            placeholder="Option 4"
            class="options border-active all question${question_count}_option_4"
            name="option-4"
            data-option
            ="option-4"
          />
        </div> 
       
      </div>
      </div>
      <div class="answer-part ">
<select class="inp question${question_count}_answer all" name="answer" id="answer">
<option value="choose">Choose correct answer</option>
<option value="1">Option-1</option>
  <option value="2">Option-2</option>
  <option value="3">Option-3</option>
  <option value="4">Option-4</option>
</select>
            </div>
            <div class="delete-btn" data-count="${question_count + 1}"><i class="fa-solid fa-trash"></i></div>
            </div>`)

  deleteQuestion()

}

// Inserting A True False Question into the html 
const addTF = () => {
  visibleBtn()
  question_count++
  wrapper.insertAdjacentHTML("beforeend", `<div class="build-part-${question_count + 1} build-part">
<div class="build-heading">True-False</div>
<div class="container question-container">
  <div class="question-part">
    <textarea
      class="question-fill question_${question_count} border-active"
      placeholder="Enter your question"
      name="question"
      id="question"
      cols="30"
      rows="10"
    ></textarea>
  </div>
  <div class="option-part${question_count} tf-part">
    <div class="true-false opt">
      <div class="true" data-option="true"> <i class="fa-solid fa-circle"></i>True</div>
      <div class="false" data-option="false"> <i class="fa-solid fa-circle"></i>False</div>
    </div> 
  </div>
  <div class="answer-part ">
<select class=" question${question_count}_answer all inp" name="answer" id="answer">
  <option value="choose">Choose correct answer</option>
  <option value="1">True</option>
  <option value="2">False</option>
</select>
<div class="delete-btn td" data-count='${question_count + 1}'><i class="fa-solid fa-trash"></i></div>
            </div>
            </div>
</div>`)
  deleteQuestion()


}

mcq_btn.addEventListener("click", addMcq)
tf_btn.addEventListener("click", addTF)


// Api of users quiz data 
let url = "https://script.google.com/macros/s/AKfycbzVXeOcniqSx1Z3a9Cu3euBuhbviGq97-MGFkKct8O78-pZw4RaGInW7G3cmGvyQXFUmA/exec"


// To Post the data into google sheets i have to make a form data and then appending all the details/question/answer into the form 

let form = new FormData()
const formDataFill = async () => {
  let qz = Array.from(document.querySelectorAll(".qd"))
  form.append("quiz-name", `${qz[0].value}`)
  form.append("quiz-level", `${qz[1].value}`)
  form.append("timing", `${qz[2].value}`)
  form.append("question-limit", `${question_count}`)

  for (let i = 1; i <= question_count; i++) {
    let m = document.querySelector(`.question_${i}`).value
    let an = document.querySelector(`.question${i}_answer`).value
    form.append(`question${i}`, m)
    form.append(`question${i}Answer`, an)

    if (document.querySelector(`.option-part${i}`).matches(".mcq-part")) {
      for (let j = 1; j <= 4; j++) {
        let q = document.querySelector(`.question${i}_option_${j}`).value
        form.append(`q${i}option${j}`, q)
      }

    } else {

      form.append(`q${i}option1`, "True")
      form.append(`q${i}option2`, "False")
    }

  }
}

// Showing A animation when data is saving in google sheets 
const save_load = (a, b) => {

  save_quiz_load.classList.remove("none")
  document.documentElement.scrollTop = 0
  html.classList.add("overflow-y-hidden")
  setTimeout(() => {
    a.textContent = ""
  }, b)
  setTimeout(() => {
    a.textContent = "."
  }, b + 500)
  setTimeout(() => {
    a.textContent = ". ."
  }, b + 1000)
  setTimeout(() => {
    a.textContent = ". . ."
    if (quiz_saved != "done") {
      save_load(a, b)
    } else {
      document.querySelector(".save-quiz-load article").classList.add("none")
      document.querySelector(".save-done").classList.remove("none")
    }
  }, b + 1500)
}


homeBtn.addEventListener("click", () => {
  sessionStorage.setItem("quizmade", "yes")
})



let save_it = true
// If user does not filled a information or may have filled inappropriate time(negative value) then showing user a modal
save_btn.addEventListener("click", async () => {
  const all_values = Array.from(document.querySelectorAll(".all"))

  all_values.forEach((e) => {
    if (e.value == "" || e.value.includes("Timing")) {
      save_it = false
    }
  })

  if (document.querySelector(".timing").value.includes("-")) {
    save_it = false
  }

  // if all things are filled than showing Animation else showing modal
  if (save_it) {

    formDataFill()
    save_load(save_quiz_span, 500)
    try {

      await fetch(url, {
        method: "POST",
        body: form
      })
      quiz_saved = "done"
    } catch (error) {
      modal[2].showModal()
      close_modal[3].addEventListener("click", () => {
        window.location.href = "index.html"
      })
    }
  } else {
    modal[3].showModal()
    close_modal[4].addEventListener("click", () => {
      modal[3].close()
    })
    save_it = true
  }

})


// const ap = "https://script.google.com/macros/s/AKfycbyoHN4Z5bRxHIs4sa6fjafU5OiGsLxsF6Y0veasl-qp8o-HXi7fdLuiJw7pI0uyD6fV/exec"
// let f
// let response
// const fetchData = async () => {
//       f = await fetch(ap)
//       response = await f.json()
//       return response

// }
// let m
// let n
// let mn 

// const putQuestion = async ()=>{
// await fetchData()
//  m = prompt("enter quiz name")
//  n = prompt("enter level")
//  document.getElementsByTagName("input")[1].value = m
//  document.getElementsByTagName("select")[0].value = n
//  document.getElementsByTagName("select")[1].value = 30
//  mn = `${m}_${n}`
// let range1  = Number(prompt("range1"))
// let range2  = Number(prompt("range2"))
// let b = 1
// for (let i = range1; i <=range2; i++) {
// document.querySelector(".add-mcq").click()
// document.querySelector(`.question_${b}`).textContent = response[mn][b]['question']
// document.querySelector(`.question${b}_option_1`).value = response[mn][b]['option1']
// document.querySelector(`.question${b}_option_2`).value = response[mn][b]['option2']
// document.querySelector(`.question${b}_option_3`).value = response[mn][b]['option3']
// document.querySelector(`.question${b}_option_4`).value = response[mn][b]['option4']
// document.querySelector(`.question${b}_answer`).value = response[mn][b]['answer']
// b++

// }



// }
