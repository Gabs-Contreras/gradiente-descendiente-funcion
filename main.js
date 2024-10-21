// Función para evaluar la derivada
function deriv_func(formula, vars, values) {
    let evalFormula = formula;
    for (let i = 0; i < vars.length; i++) {
        evalFormula = evalFormula.replace(new RegExp(vars[i], 'g'), values[i]);
    }
    return eval(evalFormula); // Evaluar la fórmula
}

// Función para validar si todas las variables son únicas en la fórmula
function validateSingleVariable(formula) {
    const matches = formula.match(/[a-zA-Z]/g);
    return matches ? new Set(matches).size > 0 : false; // Debe haber al menos una letra única
}

// Función para validar si todos los caracteres son números o las variables
function isValidInput(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
}

// Función para validar la fórmula
function validateFormula(formula) {
    return validateSingleVariable(formula) && /^[\d\+\-\*\/\^\s\(\)a-zA-Z]+$/.test(formula);
}

// Función principal de cálculo
function calculate() {
    let x_init = document.getElementById('x_init').value;
    let alpha = document.getElementById('alpha').value;
    let tolerance = document.getElementById('tolerance').value;
    let derivative = document.getElementById('derivative').value;

    // Validaciones
    if (!isValidInput(x_init) || !isValidInput(alpha) || !isValidInput(tolerance)) {
        alert("Error: Solo se pueden ingresar números en los campos.");
        return;
    }

    if (!validateFormula(derivative)) {
        alert("Error: La fórmula debe contener al menos una variable y estar en el formato correcto.");
        return;
    }

    // Convertir a número
    x_init = parseFloat(x_init);
    alpha = parseFloat(alpha);
    tolerance = parseFloat(tolerance);

    let vars = derivative.match(/[a-zA-Z]/g);
    let values = new Array(vars.length).fill(x_init);
    const max_iter_default = 10000;

    let prev_values = [];
    let iter_count = 0;
    let results = "";
    let previous_x = values[0];

    while (true) {
        let grad = deriv_func(derivative, vars, values);
        let new_x = values[0] - alpha * grad;

        results += `<p>Iteración ${iter_count + 1}: ${vars[0]} = ${values[0].toFixed(6)}, gradiente = ${grad.toFixed(6)}, nuevo ${vars[0]} = ${new_x.toFixed(6)}</p>`;

        let temp_x = values[0];
        previous_x = temp_x;
        values[0] = new_x;

        if (prev_values.length === 4) {
            let max_diff = Math.max(
                Math.abs(prev_values[3] - prev_values[2]),
                Math.abs(prev_values[2] - prev_values[1]),
                Math.abs(prev_values[1] - prev_values[0])
            );

            if (max_diff < tolerance) {
                break;
            }
        }

        prev_values.push(new_x);
        if (prev_values.length > 4) prev_values.shift();

        iter_count++;

        if (iter_count >= max_iter_default) {
            results += "<div class='separator'></div>";
            results += '<div class="highlight"><h2><p><strong>Se alcanzó el límite de iteraciones.</strong></p></h2></div>';
            break;
        }
    }

    results += "<div class='separator'></div>";
    results += `<div class="highlight"><p>Iteración anterior ${iter_count}: ${vars[0]} anterior = ${previous_x.toFixed(6)}</p>`;
    results += `<p>Iteración final ${iter_count + 1}: ${vars[0]} final = ${values[0].toFixed(6)}</p></div>`;
    results += `<p class='final-result'>Total de iteraciones: ${iter_count + 1}</p>`;

    document.getElementById('result-container').innerHTML = results;
}
