// =================================
// DIGITAI - CONFIGURAÇÃO DO CANVAS
// =================================

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Configuração inicial do desenho
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 18;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Controle do desenho
let desenhando = false;
let temDesenho = false;

// =================================
// EVENTOS DE DESENHO
// =================================

function iniciarDesenho(event) {
    desenhando = true;

    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
}

function desenhar(event) {
    if (!desenhando) return;

    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    temDesenho = true;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function finalizarDesenho() {
    desenhando = false;
    ctx.closePath();
}

// =================================
// CONEXÃO DOS EVENTOS
// =================================

canvas.addEventListener("pointerdown", iniciarDesenho);
canvas.addEventListener("pointermove", desenhar);
canvas.addEventListener("pointerup", finalizarDesenho);
canvas.addEventListener("pointerleave", finalizarDesenho);
canvas.addEventListener("pointercancel", finalizarDesenho);

// =================================
// LIMPAR QUADRO DE DESENHO
// =================================

function limparCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    temDesenho = false;

    // Limpar o resultado da previsão anterior
    document.getElementById("resultDigit").textContent = "-";
    document.getElementById("resultConfidence").textContent = "-";
}

// =================================
// CONECTAR BOTÃO LIMPAR
// =================================

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", limparCanvas);

// =================================
// CONECTAR BOTÃO RECONHECER
// =================================

const recognizeButton = document.getElementById("recognizeButton");

// =================================
// PRÉ-PROCESSAMENTO PARA O MNIST
// =================================

function preprocessarDesenho() {
    const imagem = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    const pixels = imagem.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    // Percorrer todos os pixels e remover os muito escuros
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const indice = (y * canvas.width + x) * 4;
            const intensidade = pixels[indice];

            if (intensidade < 30) {
                pixels[indice] = 0;
                pixels[indice + 1] = 0;
                pixels[indice + 2] = 0;
            }

            if (pixels[indice] > 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    const largura = maxX - minX + 1;
    const altura = maxY - minY + 1;

    // Criar uma cópia processada do desenho
    const origemProcessada = document.createElement("canvas");
    origemProcessada.width = canvas.width;
    origemProcessada.height = canvas.height;

    const contextoOrigem = origemProcessada.getContext("2d");
    contextoOrigem.putImageData(imagem, 0, 0);

    // Criar imagem auxiliar de 28 x 28 pixels
    const auxiliar = document.createElement("canvas");
    auxiliar.width = 28;
    auxiliar.height = 28;

    const contexto = auxiliar.getContext("2d");

    contexto.fillStyle = "#000000";
    contexto.fillRect(0, 0, 28, 28);

    // Redimensionar mantendo as proporções
    const escala = 20 / Math.max(largura, altura);

    const novaLargura = largura * escala;
    const novaAltura = altura * escala;

    const posX = (28 - novaLargura) / 2;
    const posY = (28 - novaAltura) / 2;

    contexto.drawImage(
        origemProcessada,
        minX, minY, largura, altura,
        posX, posY, novaLargura, novaAltura
    );

    // Converter os 784 pixels para valores entre 0 e 1
    const dados = contexto.getImageData(0, 0, 28, 28).data;
    const resultado = [];


    for (let i = 0; i < dados.length; i += 4) {
        resultado.push(dados[i] / 255);
    }

    return resultado;
}

function obterCookie(nome) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(nome + "=")) {
                cookieValue = decodeURIComponent(
                    cookie.substring(nome.length + 1)
                );
                break;
            }
        }
    }

    return cookieValue;
}

async function reconhecerDigito() {
    if (!temDesenho) {
        alert("Por favor, desenhe um número antes de reconhecer.");
        return;
    }

    const pixels = preprocessarDesenho();

    const tokenCSRF = obterCookie("csrftoken");

    recognizeButton.disabled = true;
    recognizeButton.textContent = "Reconhecendo...";

    try {
        const resposta = await fetch("/predict/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": tokenCSRF
            },
            credentials: "same-origin",
            body: JSON.stringify({
                pixels: pixels
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.error || "Erro ao reconhecer o número.");
        }

        document.getElementById("resultDigit").textContent = resultado.digit;

        document.getElementById("resultConfidence").textContent =
            `Confiança: ${(resultado.confidence * 100).toFixed(2)}%`;

    } catch (erro) {
        console.error("Erro no reconhecimento:", erro);
        alert(erro.message);

    } finally {
        recognizeButton.disabled = false;
        recognizeButton.textContent = "Reconhecer";
    }
}

recognizeButton.addEventListener("click", reconhecerDigito);