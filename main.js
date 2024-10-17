var m = 0;
var b = 0;
var delta = 0.01;
const umbral = 0.000001; 

function sumatoria(x, y) {
    var resultado1 = x * (y - (m * x) - b);
    var resultado2 = (y - (m * x) - b);
    return { resultado1, resultado2 }; 
}

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); 


    const input = document.getElementById('values').value;
    const valores = input.split(' ').map(pair => {
        const [x, y] = pair.split(',').map(Number);
        return { x, y };
    });

    const n = valores.length;
    let iteraciones = 0;
    let diferenciaM = 1; 


    m = 0;
    b = 0;

  
    while (diferenciaM > umbral) {
        let sumaTotal1 = 0; 
        let sumaTotal2 = 0; 
        let mAnterior = m;  

        for (let i = 0; i < valores.length; i++) {
            const coordenadas = valores[i];
            const { resultado1, resultado2 } = sumatoria(coordenadas.x, coordenadas.y);
            sumaTotal1 += resultado1;
            sumaTotal2 += resultado2;
        }

        let formula1 = (-2 / n) * sumaTotal1;
        let formula2 = (-2 / n) * sumaTotal2;

        m = m - (delta * formula1);
        b = b - (delta * formula2);

        diferenciaM = Math.abs(m - mAnterior);
        iteraciones++;
    }

    document.getElementById('output').textContent = `Convergencia alcanzada es de  ${iteraciones} iteraciones. Valor final de m: ${m}, Valor final de b: ${b}`;
});
