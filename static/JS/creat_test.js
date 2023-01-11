const link = document.querySelectorAll('.variant_menu a');
const box = document.querySelectorAll('.variant');
const active = document.querySelectorAll('.controll_active');
box[0].style.display = 'block'

// function removeDiv() {
//     box.forEach(item => {
//         item.style.display = 'none'
//     })
// }
//
// function addLink() {
//     link.forEach((item, index) => {
//         item.addEventListener('click', () => {
//             // console.log(index)
//             removeLink();
//             removeDiv()
//             item.classList.add('active');
//             box[index].style.display = 'flex'
//         });
//     });
// }
//
// addLink();
//
// function removeLink() {
//     link.forEach(item => {
//         item.classList.remove('active');
//     });
// }

const block = document.querySelector('.block');


let question = document.querySelector(".question"), button = document.querySelector("button"),
    subject = document.querySelector(".subject"), inp = document.querySelectorAll(".inp"),
    inp2 = document.querySelectorAll(".inp2"), inp3 = document.querySelectorAll(".inp3"),
    inp4 = document.querySelectorAll(".inp4"), level = document.querySelector(".level"),
    lev = document.querySelector(".lev"), checkboxes = document.querySelectorAll(".checkbox"),
    sub = document.querySelector(".sub"),
    variantsList = document.querySelector(".variant");

let question_list = [
    {
        id: 1,
        question: "",
        variants: [
            {
                name : "variant1",
                value : "",
                checked : false
            },
        ]

    }
];


const renderVariants = (list) => {
    variantsList.innerHTML = ""
    list.map((item) => {
        item.variants.map((variant,index) => {
            const elem = `
                <div class="inp">
                    <h4>${index + 1})</h4>
                    <input type="text"  data-index=${index} ${variant.value.length > 0 ? `value=${variant.value}` : null} placeholder="Enter your variant" name="variant" class="inp1">
                    <input type="checkbox"  data-index=${index} class="checkbox"  ${variant.checked ? `checked` : null} >
                </div>
            `
            variantsList.innerHTML += elem
        })

        catchInputChange()
        catchCheckboxChange()
    })
}

renderVariants(question_list)

function catchInputChange() {

    const inputs = document.querySelectorAll(".inp1")

    inputs.forEach(item => {
        item.addEventListener("change", (e)=>{

            const index = item.getAttribute("data-index") // 0
            question_list = question_list.map(item => {
                const newVariants = item.variants.map((variant,i) => {
                    if (i === +index) {
                        return {...variant,value: e.target.value}
                    }
                    return variant
                })

                return {...item,variants: newVariants}
            })


        })
    })

}

function catchCheckboxChange() {

    const checkboxes = document.querySelectorAll(".checkbox")

    checkboxes.forEach(item => {
        item.addEventListener("change", (e)=>{

            const index = item.getAttribute("data-index")
            question_list = question_list.map(item => {
                const newVariants = item.variants.map((variant,i) => {
                    if (i === +index) {
                        return {...variant,checked: e.target.checked}
                    }
                    return variant
                })

                return {...item,variants: newVariants}
            })
        })
    })
}

// function question_info() {
//     inp.forEach((item, index) => {
//         item.addEventListener("input", () => {
//             // let subject_id = sub.value;
//             // let level_id = lev.value
//             // console.log(subject_id)
//             let info = {
//                 "id": index + 1,
//                 "question": question.value,
//                 "variant": [
//                     {
//                         variant: "a"
//                     },
//                     {
//                         variant: "b"
//                     },
//                     {
//                         variant: "c"
//                     },
//                     {
//                         variant: "d"
//                     }
//                 ]
//             }
//             question_list.push(info)
//         })
//     })
// }



// function question_info(input, type) {
//     input.forEach((item, index) => {
//         item.addEventListener("input", () => {
//             let info = {
//                 "id": index + 1, "question": question.value,
//                 "variant": [{
//                     "inp": "", "inp2": "", "inp3": "", "inp4": ""
//                 }
//                 ],
//                 variants: [
//                     {
//                         name : "variant1",
//                         value : "",
//                         checked : false
//                     },
//                 ]
//
//             }
//             {
//                 info.variant[`${type}`] = item.value
//             }
//             // console.log(info)
//             question_list.push(info)
//         })
//     })
// }
//
// console.log(question_list)
// question_info(inp, "inp")
// question_info(inp2, "inp2")
// question_info(inp3, "inp3")
// question_info(inp4, "inp4")
//
// function check() {
//     checkboxes.forEach((item, index) => {
//         item.addEventListener("change", () => {
//             if (item.checked) {
//                 question_list = question_list.map((text, i) => {
//                     if (text.id === index + 1) {
//                         return {...text, checked: true}
//                     }
//                     return text
//                 })
//             }
//             console.log(question_list)
//         })
//     })
// }
//
// check()
// console.log(question_list)


let variant = document.querySelector(".variant"), plus2 = document.querySelector(".plus2");
plus2.addEventListener("click", () => {
    const newItem = {
        name: `variant${question_list[0].variants.length + 1}`,
        value : "",
        checked: false
    }

    question_list[0].variants.push(newItem)
    renderVariants(question_list)
    // variant.innerHTML += `
    //         <div class="inp">
    //             <h4>1)</h4>
    //             <input type="text" placeholder="Enter your variant" name="variant" class="inp2">
    //             <input type="checkbox" data-id="1" class="checkbox">
    //         </div>`
})


button.addEventListener("click", function () {
    fetch('/test', {
        method: "POST", body: JSON.stringify({
            "list": question_list,
        }), headers: {
            'Content-type': 'application/json'
        }
    })
})