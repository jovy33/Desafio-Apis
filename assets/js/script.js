let myChartGlobal = undefined;

function mostrarError(mensajeError) {
    const spanError = document.getElementById("span-error");
    spanError.innerHTML = mensajeError;
}

async function buscarIndicadorEconomicoPorTipoMoneda(tipoMoneda) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${tipoMoneda}`);
        const data = await res.json();
        return data;
    } catch (error) {
        // actualizar error en DOM ...
        mostrarError(error.message);
    }
}

async function calcular(indicadorEconomico, pesoChileno) {

    // convertir el valor peso chileno ingresado por el usuario a la moneda seleccionada.
    const resultado = (pesoChileno / indicadorEconomico.serie[0].valor);

    // retorno el resultado.
    return resultado.toFixed(3);
}

function actualizarResultado(valorCalculado) {
    const spanResultado = document.getElementById("spanResultado");
    spanResultado.innerHTML = valorCalculado;
}

// devuelve la moneda seleccionada.
function obtenerMonedaSeleccionada() {
    const monedaSeleccionada = document.getElementById("selectMoneda").value;
    return monedaSeleccionada;
}

function dataParaElGrafico(indicadorEconomico) {
    // restringir el arreglo a 10 dias.
    const dias = indicadorEconomico.serie.slice(0, 10);

    // creamos labels para el grafico.
    const labels = dias.map((serie) => {
        return serie.fecha;
    });

    // creamos data para el grafico.
    const data = dias.map((serie) => {
        const valor = serie.valor;
        return Number(valor);
    });

    const datasets = [
        {
            label: obtenerMonedaSeleccionada(),
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];

    return { labels, datasets };
}

function cargarGrafico(indicadorEconomico) {

    // obtiene la informacion para cargar el grafico.
    const data = dataParaElGrafico(indicadorEconomico);

    // configuracion para el grafico.
    const config = {
        type: "line",
        data
    };

    // busco el canvas para el grafico
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";

    // si ya existe el grafico, entonces lo elimino.
    if (myChartGlobal != undefined) {
        myChartGlobal.destroy();
    }
    // crea el nuevo grafico.
    myChartGlobal = new Chart(myChart, config);
}

async function buscar() {

    // 1 obtener el valor que el usuario ingreso (peso chileno) y el tipo de moneda.
    const pesoChileno = parseInt(document.getElementById("inputPesos").value);
    const tipoMoneda = document.getElementById("selectMoneda").value;

    // 2 validamos si el valor ingresado es un numero.
    if (Number.isInteger(pesoChileno)) {
        // validamos si el tipo de moneda seleccionada es el correcto.
        if (tipoMoneda != "seleccione") {

            // obtengo los indicadores economicos.
            const indicadorEconomico = await buscarIndicadorEconomicoPorTipoMoneda(tipoMoneda);

            // podemos calcular pasando pesoChileno y tipoMoneda ingresados.
            const valorCalculado = await calcular(indicadorEconomico, pesoChileno);

            // actualizo el DOM con el resultado.
            actualizarResultado(valorCalculado);

            // mostrar el grafico.
            cargarGrafico(indicadorEconomico);
        } else {
            // mostramos un mensaje para que seleccione un tipo de moneda.
            alert("Seleccione un tipo de moneda");
        }
    } else {
        // mostramos un mensaje para que ingrese solo valores numericos.
        alert("Ingrese un monto válido");
    }
}

function cargarEventoBotonBuscar() {
    const botonBuscar = document.getElementById("boton-buscar");
    botonBuscar.addEventListener("click", function () {
        buscar();
    });
}

function limpiarInputPesos() {
    const spanResultado = document.getElementById("inputPesos");
    spanResultado.value = "";
}
function limpiarSelectorMoneda() {
    const spanResultado = document.getElementById("selectMoneda");
    spanResultado.value = "seleccione";
}

function cargaInicial() {
    cargarEventoBotonBuscar();
    limpiarInputPesos();
    limpiarSelectorMoneda();
}

cargaInicial();