window.addEventListener('load', () => {
    let divFile = document.querySelector('.custom-file');
    let inputFile = document.getElementById('customFile')
    let imgLogo = document.getElementById('imgLogo');
    let btnCancel = document.getElementById('btnCancel');
    let btnAgregarSub = document.getElementById('btnAgregarSub');
    let btnEliminarSub = document.getElementById('btnEliminarSub');
    let btnGuardarSub = document.getElementById('btnGuardarSub');
    let selectSub = document.getElementById('selectSub');
    let inputSub = document.getElementById('inputSub');
    let btnCancelSub = document.getElementById('btnCancelSub')

    imgLogo.addEventListener('click', () => {
        imgLogo.style.display = 'none'
        divFile.style.display = 'block'
    })

    btnCancel.addEventListener('click', () => {
        imgLogo.style.display = 'inline'
        divFile.style.display = 'none'
    })

    inputFile.addEventListener('change', function (e) {

        let reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            imgLogo.style.display = "inline"
            divFile.style.display = 'none'
            imgLogo.src = reader.result;
            inputFile.classList.remove('is-invalid');
            inputFile.classList.add('is-valid');
            errorLogo.innerHTML = "";

        };
        if (inputFile.value == 0) {
            this.classList.add('is-invalid');
            errorLogo.innerHTML = "La categoria debe tener un logo"
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            errorLogo.innerHTML = ""
        }

    })

    btnAgregarSub.addEventListener('click', () => {
        selectSub.style.display = "none";
        btnAgregarSub.style.display = "none";
        btnEliminarSub.style.display = "none";
        btnGuardarSub.style.display = "inline";
        btnCancelSub.style.display = "inline";
        inputSub.style.display = "inline";
        inputSub.focus();
    })

    btnCancelSub.addEventListener('click', () => {
        selectSub.style.display = "inline";
        btnAgregarSub.style.display = "inline";
        btnEliminarSub.style.display = "inline";
        btnGuardarSub.style.display = "none";
        btnCancelSub.style.display = "none";
        inputSub.style.display = "none";
    })


    btnGuardarSub.addEventListener('click', () => {

        selectSub.style.display = "inline";
        btnAgregarSub.style.display = "inline";
        btnEliminarSub.style.display = "inline";
        btnGuardarSub.style.display = "none";
        btnCancelSub.style.display = "none";
        inputSub.style.display = "none";


    })

    btnEliminarSub.addEventListener('click', () => {
        let confirma = confirm('Estás seguro que querés eliminar ' + selectSub.options[selectSub.selectedIndex].text)
        if (confirma) {
            fetch(`${window.location.origin}/admin/subDelete/${selectSub.value}`, {
                    method: 'POST'
                })
                .then(() => {
                    location.href = `${window.location.origin}/admin/categorieEdit/${btnGuardarSub.value}`
                })
        }
    })

})