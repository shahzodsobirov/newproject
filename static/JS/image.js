let checkboxes = document.querySelectorAll('.checkbox2');
checkboxes.forEach((check,) => {
    check.addEventListener('change', function () {
        let variant_id = check.dataset.id
        console.log(check.checked)
        fetch('/for_fetch/' + variant_id, {
            method: "POST",
            body: JSON.stringify({
                "value": check.checked,
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
    })
})
