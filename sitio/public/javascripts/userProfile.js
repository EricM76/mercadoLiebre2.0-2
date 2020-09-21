
window.addEventListener("load",function(){
  let provinciaSelect = document.querySelector('#provinciaSelect') //capto el select
  let ciudadSelect = document.querySelector('#ciudadSelect')

    /* ----------> VISTA PREVIA DE LA IMAGEN DE PERFIL < ------- */
    // ------------------------documentación -------------------//
    // https://developer.mozilla.org/es/docs/Web/API/FileReader //

    document.querySelector("#avatarImput").onchange = function(e) {
        // Creamos el objeto de la clase FileReader
        let reader = new FileReader();

        // Leemos el archivo subido y se lo pasamos a nuestro fileReader
        reader.readAsDataURL(e.target.files[0]);

        // Le decimos que cuando este listo ejecute el código interno
        reader.onload = function(){
          let imagen = document.querySelector('.avatarImg')
          imagen.src = reader.result;
        };
      }

      /* ----------> APIS DE PROVINCIAS Y CIUDADES < ------- */
      fetch('https://apis.datos.gob.ar/georef/api/provincias')
      .then(function(response){
          return response.json();
      })
      .then(function(result){
            result.provincias.sort(function(prev,next){ //ordeno las provincias
              return prev.id - next.id
            })
            result.provincias.forEach(provincia => {
            provinciaSelect.innerHTML += `<option value=${provincia.id}> ${provincia.nombre} </option>` //agrego un option con el nombre de la provincia cargado
        })
      })

      provinciaSelect.addEventListener('change',function(){
        var selectedOption = this.options[provinciaSelect.selectedIndex]; //capto la opcion seleccionada
     
        //fetch('https://apis.datos.gob.ar/georef/api/municipios?max=2000') //departamentos
        fetch('https://apis.datos.gob.ar/georef/api/localidades?max=1000&provincia='+selectedOption.value)
        .then(response => {
          return response.json();
        })
      /*   .then(result => {
          result.municipios.forEach(municipio => {
            if(municipio.provincia.id == selectedOption.value ){
              console.log(selectedOption.value + ': ' + selectedOption.text);
              ciudadSelect.innerHTML += `<option value=${municipio.id}> ${municipio.nombre} </option>` //agrego un option con el nombre de la provincia cargado

            }
          })
        })
      }) */
      .then(result => {
        console.log(result)
        for(let i = ciudadSelect.options.length; i>=0; i--){
          ciudadSelect.remove(i)
        }
        result.localidades.sort(function(prev,next){ //ordeno las localidades
          return prev.nombre < next.nombre
        })
        result.localidades.forEach(localidad => {
            ciudadSelect.innerHTML += `<option value=${localidad.id}> ${localidad.nombre} </option>` //agrego un option con el nombre de la provincia cargado
        })
      })
    })

     
})