// =====================
// DATA SOAL & GAME
// =====================
const mcqQuestions = [
    { question: "Domain manakah yang mencakup organisme prokariot dengan dinding sel peptidoglikan?", choices: ["Bacteria", "Archaea", "Eukarya", "Protista"], answer: 0 },
    { question: "Kingdom yang memiliki klorofil, dinding sel selulosa, dan mampu fotosintesis adalah…", choices: ["Plantae", "Animalia", "Fungi", "Protista"], answer: 0 },
    { question: "Filum hewan dengan notokorda pada tahap tertentu adalah…", choices: ["Chordata", "Echinodermata", "Arthropoda", "Mollusca"], answer: 0 },
    { question: "Tumbuhan berbiji terbuka, contohnya pinus, termasuk divisi…", choices: ["Gymnospermae", "Angiospermae", "Bryophyta", "Pteridophyta"], answer: 0 },
    { question: "Harimau termasuk ordo…", choices: ["Carnivora", "Primata", "Rodentia", "Artiodactyla"], answer: 0 }
];

const dragdropGamesets = [
    ["Eukarya", "Animalia", "Chordata", "Mammalia", "Primata", "Hominidae", "Homo", "Homo sapiens"],
    ["Eukarya", "Plantae", "Angiospermae", "Monokotil", "Poales", "Poaceae", "Oryza", "Oryza sativa"],
    ["Eukarya", "Animalia", "Chordata", "Aves", "Columbiformes", "Columbidae", "Columba", "Columba livia"]
];

const terms = ["Domain", "Kingdom", "Filum/Divisio", "Kelas", "Ordo", "Famili", "Genus", "Spesies"];

// =====================
// VARIABEL & SELECTOR DOM
// =====================
let mcqScore = 0;
let dragdropScore = 0;
let mcqCorrectCount = 0;
let currentMcqIndex = 0;
let currentDragdropIndex = 0;
let quizStartTime = null;

const startScreen = document.getElementById('start-screen');
const mcqQuizScreen = document.getElementById('mcq-quiz-screen');
const dragdropGameScreen = document.getElementById('dragdrop-game-screen');
const finalResultScreen = document.getElementById('final-result-screen');
const nameInput = document.getElementById('name');
const kelasInput = document.getElementById('kelas');
const absenInput = document.getElementById('absen');
const beginButton = document.getElementById('begin-quiz');
const hudMcq = document.getElementById('hud-mcq');
const hudDragdrop = document.getElementById('hud-dragdrop');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const nextMcqButton = document.getElementById('next-question-mcq');
const pool = document.getElementById('pool');
const targets = document.getElementById('targets');
const checkDragdropButton = document.getElementById('check-dragdrop');
const finalResultText = document.getElementById('final-result-text');
const sendFinalResultButton = document.getElementById('send-final-result');

// =====================
// FUNGSI UTAMA
// =====================

function init() {
    beginButton.addEventListener('click', startQuiz);
    nextMcqButton.addEventListener('click', nextQuestionMcq);
    checkDragdropButton.addEventListener('click', checkDragdropAnswer);
    sendFinalResultButton.addEventListener('click', sendFinalResult);
}

function startQuiz() {
    if (!nameInput.value.trim() || !kelasInput.value.trim() || !absenInput.value.trim()) {
        alert('Mohon isi semua data login.');
        return;
    }
    startScreen.style.display = 'none';
    mcqQuizScreen.style.display = 'block';
    quizStartTime = Date.now();
    loadQuestionMcq();
}

// --- FASE 1: Kuis Pilihan Ganda (MCQ) ---

function loadQuestionMcq() {
    const q = mcqQuestions[currentMcqIndex];
    hudMcq.innerText = `Soal ${currentMcqIndex + 1} dari ${mcqQuestions.length} | Skor: ${mcqCorrectCount}`;
    questionText.innerText = q.question;
    choicesContainer.innerHTML = '';
    
    q.choices.forEach((c, i) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.innerText = c;
        button.onclick = () => selectAnswerMcq(i);
        choicesContainer.appendChild(button);
    });
    nextMcqButton.style.display = 'none';
}

function selectAnswerMcq(choiceIndex) {
    const q = mcqQuestions[currentMcqIndex];
    const buttons = choicesContainer.querySelectorAll('.choice-button');
    
    // Nonaktifkan semua tombol setelah dipilih
    buttons.forEach(btn => btn.disabled = true);

    if (choiceIndex === q.answer) {
        mcqCorrectCount++;
        buttons[choiceIndex].classList.add('correct');
    } else {
        buttons[choiceIndex].classList.add('incorrect');
        buttons[q.answer].classList.add('correct');
    }

    hudMcq.innerText = `Soal ${currentMcqIndex + 1} dari ${mcqQuestions.length} | Skor: ${mcqCorrectCount}`;
    nextMcqButton.style.display = 'inline-block';
}

function nextQuestionMcq() {
    currentMcqIndex++;
    if (currentMcqIndex < mcqQuestions.length) {
        loadQuestionMcq();
    } else {
        mcqQuizScreen.style.display = 'none';
        mcqScore = Math.round((mcqCorrectCount / mcqQuestions.length) * 100);
        // Lanjut ke game drag & drop
        startDragdropGame();
    }
}

// --- FASE 2: Game Drag & Drop ---

function startDragdropGame() {
    dragdropGameScreen.style.display = 'block';
    loadDragdropSet();
}

function loadDragdropSet() {
    hudDragdrop.innerText = `Game Susun ${currentDragdropIndex + 1} dari ${dragdropGamesets.length}`;
    pool.innerHTML = '';
    targets.innerHTML = '';
    
    const items = dragdropGamesets[currentDragdropIndex].slice();
    const shuffled = items.slice().sort(() => Math.random() - 0.5);

    shuffled.forEach((it, i) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.draggable = true;
        div.id = 'item' + i;
        div.innerText = it;
        div.addEventListener('dragstart', dragStart);
        pool.appendChild(div);
    });

    terms.forEach((t, i) => {
        const box = document.createElement('div');
        box.className = 'target';
        box.dataset.index = i;
        box.innerHTML = `<small>${t}</small><div class="slot" data-index="${i}"></div>`;
        box.querySelector('.slot').addEventListener('dragover', dragOver);
        box.querySelector('.slot').addEventListener('drop', dropItem);
        targets.appendChild(box);
    });
    
    checkDragdropButton.style.display = 'block';
}

function dragStart(e) { e.dataTransfer.setData('text/plain', e.target.id); }
function dragOver(e) { e.preventDefault(); }
function dropItem(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const el = document.getElementById(id);
    if (!el) return;
    const slot = e.currentTarget;
    if (slot.firstChild) slot.removeChild(slot.firstChild);
    slot.appendChild(el);
}

function checkDragdropAnswer() {
    const expected = dragdropGamesets[currentDragdropIndex];
    let correctCount = 0;
    document.querySelectorAll('.slot').forEach((slot, i) => {
        const child = slot.firstChild;
        const val = child ? child.innerText : "";
        if (val === expected[i]) correctCount++;
    });
    
    const setScore = Math.round((correctCount / terms.length) * 100);
    dragdropScore += setScore;
    
    alert(`Set ${currentDragdropIndex + 1} selesai. Benar: ${correctCount} dari ${terms.length}. Skor: ${setScore}`);
    
    currentDragdropIndex++;
    if (currentDragdropIndex < dragdropGamesets.length) {
        loadDragdropSet();
    } else {
        endQuiz();
    }
}

// --- FASE AKHIR: Hasil & Pengiriman ---

function endQuiz() {
    dragdropGameScreen.style.display = 'none';
    finalResultScreen.style.display = 'block';
    
    const durationInSeconds = Math.round((Date.now() - quizStartTime) / 1000);
    const avgDragdropScore = Math.round(dragdropScore / dragdropGamesets.length);
    const finalScore = Math.round((mcqScore + avgDragdropScore) / 2);
    
    finalResultText.innerHTML = `
        <p>Skor Pilihan Ganda: <b>${mcqScore}%</b></p>
        <p>Skor Susun Taksonomi: <b>${avgDragdropScore}%</b></p>
        <p>Skor Total Akhir: <b>${finalScore}%</b></p>
        <p>Waktu yang dihabiskan: <b>${durationInSeconds}</b> detik.</p>
    `;
}

function sendFinalResult() {
    const durationInSeconds = Math.round((Date.now() - quizStartTime) / 1000);
    const avgDragdropScore = Math.round(dragdropScore / dragdropGamesets.length);
    const finalScore = Math.round((mcqScore + avgDragdropScore) / 2);
    
    const payload = {
        name: nameInput.value,
        class: kelasInput.value,
        absen: absenInput.value,
        game: 'taksonomi_lengkap',
        score: finalScore,
        duration: durationInSeconds,
        details: {
            mcqScore: mcqScore,
            mcqCorrectCount: mcqCorrectCount,
            dragdropScore: avgDragdropScore
        }
    };

    fetch('https://script.google.com/macros/s/AKfycbw_Edxfbq7Xy9tVZ0Ogij-V9cCOuuUp1RHeNK1FEUqYCbmNVP3D3yP4pL3L8zY1qy5A2A/exec', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Hasil kuis berhasil dikirim!');
        } else {
            alert('Gagal mengirim hasil: ' + (data.message || 'Terjadi kesalahan.'));
        }
    })
    .catch(error => {
        alert('Gagal mengirim hasil: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', init);