let reading = document.querySelectorAll(".reading"), listening = document.querySelectorAll(".listening"),
    writing = document.querySelectorAll(".writing"), name = document.querySelectorAll(".name"),
    speaking = document.querySelectorAll(".speaking"), button = document.querySelector("button");


let student_list = [];


function mixed(input, type) {
    input.forEach((item, index) => {
        item.addEventListener("input", () => {
            console.log(index)
            let student_id = name[index].dataset.id
            let studentResult = {
                "student_id": student_id, "reading": 0, "listening": 0, "writing": 0, "speaking": 0
            }
            console.log(studentResult)
            if (student_list.filter(item => item.student_id === studentResult.student_id).length === 0) {
                studentResult[`${type}`] = item.value;
                student_list.push(studentResult)
            } else {
                student_list.forEach((item2) => {
                    if (item2["student_id"] === student_id) {
                        item2[`${type}`] = item.value;
                    }
                })
            }
            console.log(student_list)
            getList(student_list)
        })
    })
}

mixed(reading, "reading")
mixed(listening, "listening")
mixed(writing, "writing")
mixed(speaking, "speaking")

function getList(list) {
    return list
}

button.addEventListener("click", function () {
    fetch('/result', {
        method: "POST", body: JSON.stringify({
            "result": student_list,
        }), headers: {
            'Content-type': 'application/json'
        }
    })
})