window.addEventListener('load', () => {
    let cardCategoria = document.getElementById('cardCategoria');
    

    fetch(`${window.location.origin}/api/categorias`)
        .then(response => response.json())
        .then(categorias => {
            categorias.forEach(categoria => {
                cardCategoria.innerHTML +=
                  `<div class="card-header p-3" id="headingOne${categoria.id}">
                      <a class="h2 d-flex justify-content-around " href="/admin/categorieEdit/${categoria.id}">
                        <img src="/images/logos/${categoria.imagen} " alt="" width="50px">
                        <button class="btn btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne${categoria.id}" aria-expanded="true" aria-controls="collapseOne${categoria.id}">
                        ${categoria.nombre} 
                        </button>
                        </a>
                  </div>
                  </div>`
            });
        })
   
        
})