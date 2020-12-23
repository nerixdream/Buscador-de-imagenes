const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')
const paginacion = document.querySelector('#paginacion')


const registrosPorPagina = 30
let totalPaginas
let iterador
let paginaActual = 1


window.onload = ()=>{
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e){
    e.preventDefault()
    const terminoBusqueda = document.querySelector('#termino').value

    if(terminoBusqueda === ''){
        mostrarMensaje('Agrega un término de busqueda')
        return
    }

    buscarImagenes()

}

function mostrarMensaje(mensaje){
    const alerta = document.createElement('p')
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center')

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span> 
    `

    formulario.appendChild(alerta)

    setTimeout(() => {
        alerta.remove()
    }, 3000);
}

function buscarImagenes() {

    const termino= document.querySelector('#termino').value
    const key = '4412604-d39c2b54531bbc3999f5bc35a'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            totalPaginas = calcularTotalPaginas(datos.totalHits)
            mostrarImagenes(datos.hits)
        })
}

function *crearPaginador(total){
    for (let i = 1; i <= total; i++) {
        yield i
    }
}

function calcularTotalPaginas(total) {
    return parseInt(Math.ceil( total / registrosPorPagina))
}

function mostrarImagenes(imagenes) {
    
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    imagenes.forEach(imagen => {
        
        const {previewURL, views, likes, largeImageURL} = imagen
        
        resultado.innerHTML += `

            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen
                        </a>
                    </div>
                </div>
            </div>
        `
    });

    //Limpia el paginador anterior
    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild)
    }

    imprimirPaginador()
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas)
    
    while (true) {
        const {value, done } = iterador.next()
        if (done) return;

        //Genera un boton para la paginación
        const boton = document.createElement('a')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'rounded')

        boton.onclick = ()=>{
            paginaActual = value

            buscarImagenes()
        }

        paginacion.appendChild(boton)
    }
}