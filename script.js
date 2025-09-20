let moves = 0;
let time = 0;
let matched = 0;
let selectedFlag = null;
let selectedCountry = null;
let gameStarted = false;
let timerInterval;
let isProcessing = false;

// Inicializa o jogo
function startGame() {
    moves = 0;
    time = 0;
    matched = 0;
    selectedFlag = null;
    selectedCountry = null;
    gameStarted = false;
    isProcessing = false;

    // Adiciona classe hidden para iniciar animação
    const flagsSection = document.querySelector(".flags-section");

    flagsSection.classList.add("hidden");

    // Remove a classe hidden depois de 400ms para ativar a transição
    setTimeout(() => {
        flagsSection.classList.remove("hidden");
    }, 400);

    document.getElementById("moves").textContent = moves;
    document.getElementById("timer").textContent = time;

    clearInterval(timerInterval);

    // Reset visual das bandeiras
    document.querySelectorAll(".flag").forEach(flag => {
        flag.classList.remove("matched", "selected", "wrong-flag");
    });

    // Reset visual dos botões
    document.querySelectorAll(".country").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("wrong", "correct", "selected-country");
    });

    shuffle(document.querySelector(".flags-section"));
}

// Começa o timer no primeiro clique
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            time++;
            document.getElementById("timer").textContent = time;
        }, 1000);
    }
}

// Seleção de bandeira
document.querySelectorAll(".flag").forEach(flag => {
    flag.addEventListener("click", () => {
        if (selectedFlag || isProcessing) return; // impede múltiplas seleções
        startTimer();
        selectedFlag = flag.dataset.flag;
        flag.classList.add("selected");
        checkMatch();
    });
});

// Seleção de país
document.querySelectorAll(".country").forEach(button => {
    button.addEventListener("click", () => {
        if (selectedCountry || isProcessing) return; // impede múltiplas seleções
        startTimer();
        selectedCountry = button.dataset.flag;
        button.classList.add("selected-country");
        checkMatch();
    });
});

// Verifica acerto ou erro
function checkMatch() {
    if (selectedFlag && selectedCountry) {
        isProcessing = true; // bloqueia novas seleções
        moves++;
        document.getElementById("moves").textContent = moves;

        const selectedFlagElement = document.querySelector(`.flag[data-flag="${selectedFlag}"]`);
        const selectedCountryButton = document.querySelector(`.country[data-flag="${selectedCountry}"]`);

        if (selectedFlag === selectedCountry) {
            // Acertou
            selectedFlagElement.classList.add("matched");
            selectedCountryButton.classList.add("correct");
            selectedCountryButton.disabled = true;

            // Reseta apenas os destaques de seleção
            resetSelections();
        } else {
            // Errou → feedback visual
            selectedFlagElement.classList.add("wrong-flag");
            selectedCountryButton.classList.add("wrong");

            // Limpa apenas os destaques de seleção, mantém .wrong
            document.querySelectorAll(".flag").forEach(f => f.classList.remove("selected"));
            document.querySelectorAll(".country").forEach(c => c.classList.remove("selected-country"));

            // Depois de 600ms remove o vermelho
            setTimeout(() => {
                selectedFlagElement.classList.remove("wrong-flag");
                selectedCountryButton.classList.remove("wrong");
                // Agora podemos liberar novas seleções
                selectedFlag = null;
                selectedCountry = null;
                isProcessing = false;
            }, 600);
        }

        // Verifica vitória
        if (matched === document.querySelectorAll(".flag").length) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert(`🎉 Parabéns! Você venceu em ${moves} movimentos e ${time} segundos!`);
            }, 300);
        }
    }
}

// Função resetSelections permanece para limpar apenas destaques
function resetSelections() {
    selectedFlag = null;
    selectedCountry = null;
    isProcessing = false;

    document.querySelectorAll(".flag").forEach(f => f.classList.remove("selected"));
    document.querySelectorAll(".country").forEach(c => c.classList.remove("selected-country"));
}

// Função genérica para embaralhar elementos filhos de um container
function shuffle(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}


// Inicializa o jogo ao carregar
startGame();
