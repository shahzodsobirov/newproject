const link = document.querySelectorAll('.variant_menu a');
const box = document.querySelectorAll('.variant');
const active = document.querySelectorAll('.controll_active');
box[0].style.display = 'block'

function removeDiv() {
    box.forEach(item => {
        item.style.display = 'none'
    })
}

function addLink() {
    link.forEach((item, index) => {
        item.addEventListener('click', () => {
            // console.log(index)
            removeLink();
            removeDiv()
            item.classList.add('active');
            box[index].style.display = 'flex'
        });
    });
}

addLink();

function removeLink() {
    link.forEach(item => {
        item.classList.remove('active');
    });
}

const block = document.querySelector('.block');


let question = document.querySelector(".question"), button = document.querySelector(".button"),
    subject = document.querySelector(".subject"), inp = document.querySelectorAll(".inp"),
    inp2 = document.querySelectorAll(".inp2"), inp3 = document.querySelectorAll(".inp3"),
    inp4 = document.querySelectorAll(".inp4"), level = document.querySelector(".level"),
    lev = document.querySelector(".lev"), checkboxes = document.querySelectorAll(".checkbox"),
    sub = document.querySelector(".sub"),
    variantsList = document.querySelector(".variant");

let question_list = [{
    id: 1,
    question: "",
    type: "",
    variants: [{
        name: "variant1",
        value: "",
        checked: false
    },]
}];
console.log(question_list)

const renderVariants = (list) => {
    variantsList.innerHTML = ""
    list.map((item) => {
        item.variants.map((variant, index) => {
            const elem = `
                <div class="inp">
                    <h4>${index + 1})</h4>
                    <input type="text"  data-index=${index} ${variant.value.length > 0 ? `value=${variant.value}` : null} placeholder="Enter your variant" name="variant" class="inp1">
                    <input type="checkbox"  data-index=${index} class="checkbox" data-id="{{ var.id }}"  ${variant.checked ? `checked` : null} >
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
    const question = document.querySelector(".question")
    inputs.forEach(item => {
        item.addEventListener("change", (e) => {

            const index = item.getAttribute("data-index") // 0
            question_list = question_list.map(item => {
                const newVariants = item.variants.map((variant, i) => {
                    if (i === +index) {
                        return {...variant, value: e.target.value}
                    }
                    return variant
                })
                return {...item, variants: newVariants}
            })
        })
    })
    question.addEventListener("change", (e) => {
        question_list.forEach((item) => {
            item.question = question.value
        })
    })
}

const type = document.querySelectorAll(".controll_active");

type.forEach(item => {
    item.addEventListener("click", () => {
        let type_id = item.dataset.id
        console.log(type_id)
        question_list.forEach((list) => {
            list.type = type_id
        })
    })
})

function catchCheckboxChange() {

    const checkboxes = document.querySelectorAll(".checkbox")

    checkboxes.forEach(item => {
        item.addEventListener("change", (e) => {

            const index = item.getAttribute("data-index")
            question_list = question_list.map(item => {
                const newVariants = item.variants.map((variant, i) => {
                    if (i === +index) {
                        return {...variant, checked: e.target.checked}
                    }
                    return variant
                })

                return {...item, variants: newVariants}
            })
        })
    })
}

let variant = document.querySelector(".variant"),
    plus2 = document.querySelector(".plus2");
plus2.addEventListener("click", () => {
    const newItem = {
        name: `variant${question_list[0].variants.length + 1}`,
        value: "",
        checked: false
    }
    question_list[0].variants.push(newItem)
    renderVariants(question_list)
})
button.addEventListener("click", function () {
    fetch('/test/' + button.dataset.id, {
        method: "POST", body: JSON.stringify({
            "list": question_list,
        }), headers: {
            'Content-type': 'application/json'
        }
    })
    const fromData = new FormData();
    input.forEach((inp, index) => {
        const files = inp.files;
        fromData.append('images', {inp: index, file: files[0]});
    })


    fromData.getAll()
    fetch('/image_files', {
        method: 'POST',
        body: fromData,
    })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data)
    //     // document.body.style.background = `url(${data.image})`;
    //     // document.body.style.backgroundSize = "cover"


    const input = document.querySelectorAll('.file');
    button.addEventListener("click", async function () {

        fetch('/test/' + button.dataset.id, {
            method: "POST",
            body: JSON.stringify({
                "list": question_list,
            }), headers: {
                'Content-type': 'application/json'
            },
        })
        // const fromData = new FormData();
        //
        //
        // await input.forEach((inp, index) => {
        //     const files = inp.files;
        //     fromData.append('images', {inp: index, file: files[0]});\
        // })

        // const fromData = new FormData();
        // await input.forEach((inp,index) => {
        //     const files = inp.files;
        //     fromData.append('images', {inp:index,file:files[0]});
        // })
        // fromData.getAll()
        // await fetch('/image_files', {
        //         method: 'POST',
        //         body: fromData,
        //     })
    })

// input.forEach(inp => {
//     inp.addEventListener('input', even => {
//         const files = even.target.files;
//         const fromData = new FormData();
//         fromData.append('image', files[0]);
//         fetch('/image_files', {
//             method: 'POST',
//             body: fromData,
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data)
//                 document.body.style.background = `url(${data.image})`;
//                 document.body.style.backgroundSize = "cover"
//             })
//             .catch(error => {
//                 console.log(error)
//             })
//         console.log(fromData)
//     })
// })

// })
    question.addEventListener("input", () => {
        question.forEach(item => {
            item.question = question.value
        })
    })
    document.getElementById('file').addEventListener('change', event => {
        const files = event.target.files;
        const fromData = new FormData();
        fromData.append('image', files[0]);
        fetch('http://127.0.0.1:5000', {
            method: 'POST',
            body: fromData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                document.body.style.background = `url(${data.image})`;
                document.body.style.backgroundSize = "cover"
            })
            .catch(error => {
                console.log(error)
            })
    })
})
// question.forEach((question, index) => {
//     question.addEventListener("input", function () {
//         fetch('/create test', {
//             method: "POST",
//             body: JSON.stringify({
//                 "value": question,
//             }),
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//     })

// })

// })

