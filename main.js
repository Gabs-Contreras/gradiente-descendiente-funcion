// Función para validar si todos los caracteres son números o las variables
function isValidInput(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
}

// Función para evaluar la derivada
function deriv_func(formula, vars, values) {
    // Reemplaza cada variable en la fórmula con su correspondiente valor
    let evalFormula = formula;
    for (let i = 0; i < vars.length; i++) {
        evalFormula = evalFormula.replace(new RegExp(vars[i], 'g'), values[i]);
    }
    return eval(evalFormula); // Evaluar la fórmula
}

// Función para calcular la derivada usando mathjs
function calculateDerivative(func) {
    const expr = math.parse(func);
    const derivative = math.derivative(expr, 'x');
    return derivative.toString(); // Convertir a string
}

// Función principal de cálculo
function calculate() {
    // Obtener los valores ingresados por el usuario
    let x_init = document.getElementById('x_init').value;
    let alpha = document.getElementById('alpha').value;
    let tolerance = document.getElementById('tolerance').value;
    let functionInput = document.getElementById('derivative').value; // Cambiar a función

    // Validaciones
    if (!isValidInput(x_init) || !isValidInput(alpha) || !isValidInput(tolerance)) {
        alert("Error: Solo se pueden ingresar números en los campos de 'Valor inicial de x', 'Valor de alfa (α)' y 'Valor de tolerancia'.");
        return;
    }

    // Calcular la derivada
    let derivative = calculateDerivative(functionInput);

    // Función para formatear la derivada
    function formatDerivative(derivative) {
        return derivative.replace(/ *\* */g, '*').replace(/x/g, '*x');
    }

    // Convertir a número
    x_init = parseFloat(x_init);
    alpha = parseFloat(alpha);
    tolerance = parseFloat(tolerance);

    // Variables de cálculo
    let vars = ['x']; // Solo trabajamos con 'x'
    let values = new Array(vars.length).fill(x_init); // Inicializar valores de las variables

    // Establecer un límite de iteraciones como medida de seguridad
    const max_iter_default = 10000;

    // Array para almacenar los últimos 4 valores
    let prev_values = [];
    let iter_count = 0;
    let resultsTable = `<table border="1">
                            <tr>
                                <th>Iteración</th>
                                <th>x</th>
                                <th>Gradiente</th>
                                <th>Nuevo x</th>
                            </tr>`;

    // Ciclo de iteraciones
    while (true) {
        let grad = deriv_func(derivative, vars, values);
        let new_x = values[0] - alpha * grad;

        // Agregar fila a la tabla
        resultsTable += `<tr>
                            <td>${iter_count + 1}</td>
                            <td>${values[0].toFixed(6)}</td>
                            <td>${grad.toFixed(6)}</td>
                            <td>${new_x.toFixed(6)}</td>
                          </tr>`;

        // Guardar el nuevo valor
        let temp_x = values[0];
        values[0] = new_x;

        // Condición de parada
        if (prev_values.length === 4) {
            let max_diff = Math.max(
                Math.abs(prev_values[3] - prev_values[2]),
                Math.abs(prev_values[2] - prev_values[1]),
                Math.abs(prev_values[1] - prev_values[0])
            );

            if (max_diff < tolerance) {
                break;  // Detener si la diferencia máxima es menor que la tolerancia
            }
        }

        // Guardar el valor actual en el array
        prev_values.push(new_x);
        if (prev_values.length > 4) prev_values.shift();  // Mantener solo los últimos 4 valores

        iter_count++;

        // Límite de iteraciones como medida de seguridad
        if (iter_count >= max_iter_default) {
            resultsTable += "</table>"; // Cerrar la tabla
            resultsTable += "<div class='separator'></div>";
            resultsTable += '<div class="highlight">';
            resultsTable += "<h2><p><strong>Se alcanzó el límite de iteraciones.</strong></p></h2>";
            break;
        }
    }

    // Cerrar la tabla
    resultsTable += "</table>";

    // Crear el resumen con los resultados principales antes de la tabla
    let summaryResults = "<div class='separator'></div>";
    summaryResults += '<div class="highlight">';
    summaryResults += `<h2>Resumen de Resultados</h2>`;
    summaryResults += `<p><strong>Función ingresada:</strong> ${functionInput}</p>`;
    summaryResults += `<p><strong>Derivada calculada:</strong> ${formatDerivative(derivative)}</p>`;
    summaryResults += "<hr>";  // Línea divisoria

    summaryResults += "<h3>Iteraciones</h3>";
    summaryResults += `<p><strong>Iteración anterior (10000):</strong> x anterior = ${prev_values[prev_values.length - 2] ? prev_values[prev_values.length - 2].toExponential(4) : "N/A"}</p>`;
    summaryResults += `<p><strong>Iteración final (10001):</strong> x final = ${values[0].toExponential(4)}</p>`; // Mostrar en notación científica
    summaryResults += "<hr>";  // Otra línea divisoria

    summaryResults += `<h3><strong>Total de iteraciones:</strong> ${iter_count + 1}</h3>`;  // Incrementar total de iteraciones
    summaryResults += '</div>';

    // Mostrar primero el resumen y luego la tabla de resultados
    document.getElementById('result-container').innerHTML = summaryResults + resultsTable;
}