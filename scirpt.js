
// ===================================
// DATA PENGGUNA
// ===================================

function getUsers() {
    return JSON.parse(localStorage.getItem("digismart_users")) || [];
}

function getCurrentUser() {
    const email = sessionStorage.getItem("digismart_user");

    if (!email) return null;

    return getUsers().find(user => user.email === email) || null;
}

function updateUser(updatedUser) {
    const users = getUsers();

    const index = users.findIndex(
        user => user.email === updatedUser.email
    );

    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem("digismart_users", JSON.stringify(users));
    }
}

// ===================================
// REGISTER
// ===================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            document.getElementById("registerMessage").textContent =
                "Email sudah terdaftar!";
            return;
        }

        users.push({
            name,
            email,
            password,
            score: 0,
            quizCount: 0,
            materialCount: 0
        });

        localStorage.setItem("digismart_users", JSON.stringify(users));

        document.getElementById("registerMessage").textContent =
            "Pendaftaran berhasil! Silakan masuk.";

        registerForm.reset();
    });
}

// ===================================
// LOGIN
// ===================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(
            item => item.email === email && item.password === password
        );

        if (user) {
            sessionStorage.setItem("digismart_user", email);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("loginMessage").textContent =
                "Email atau kata sandi salah!";
        }
    });
}

// ===================================
// PROTEKSI HALAMAN
// ===================================

const protectedPages = [
    "dashboard.html",
    "materi.html",
    "kuis.html"
];

const currentPage = location.pathname.split("/").pop();

if (protectedPages.includes(currentPage) && !getCurrentUser()) {
    window.location.href = "login.html";
}

// ===================================
// LOGOUT
// ===================================

function logout() {
    sessionStorage.removeItem("digismart_user");
    window.location.href = "login.html";
}

// ===================================
// DASHBOARD
// ===================================

const user = getCurrentUser();

if (user) {
    const name = document.getElementById("userName");
    const material = document.getElementById("materialCount");
    const quiz = document.getElementById("quizCount");
    const score = document.getElementById("totalScore");

    if (name) name.textContent = user.name;
    if (material) material.textContent = user.materialCount;
    if (quiz) quiz.textContent = user.quizCount;
    if (score) score.textContent = user.score;
}

// ===================================
// MATERI SELESAI
// ===================================

function completeMaterial() {
    const current = getCurrentUser();

    if (!current) return;

    current.materialCount++;
    updateUser(current);

    alert("Materi berhasil diselesaikan!");
    location.reload();
}

// ===================================
// KUIS LITERASI DIGITAL
// ===================================

const questions = [
    {
        question: "Apa yang dimaksud dengan hoaks?",
        options: [
            "Informasi benar",
            "Informasi palsu",
            "Informasi pendidikan",
            "Informasi resmi"
        ],
        answer: 1
    },
    {
        question: "Bagaimana cara menjaga keamanan akun?",
        options: [
            "Membagikan password",
            "Menggunakan password kuat",
            "Menggunakan password yang sama",
            "Memberikan kode OTP"
        ],
        answer: 1
    },
    {
        question: "Apa yang dimaksud dengan jejak digital?",
        options: [
            "Rekaman aktivitas internet",
            "Jenis komputer",
            "Aplikasi permainan",
            "Jaringan internet"
        ],
        answer: 0
    },
    {
        question: "Apa yang harus dilakukan sebelum membagikan berita?",
        options: [
            "Langsung membagikan",
            "Memeriksa kebenaran informasi",
            "Mengubah isi berita",
            "Mengabaikan sumber"
        ],
        answer: 1
    },
    {
        question: "Bagaimana menggunakan AI secara bijak?",
        options: [
            "Memercayai semua hasilnya",
            "Menyalin semua jawaban",
            "Memeriksa kembali hasilnya",
            "Membagikan data pribadi"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let answers = [];

function showQuestion() {
    const area = document.getElementById("quizArea");

    if (!area) return;

    const q = questions[currentQuestion];

    area.innerHTML = `
        <h3>Pertanyaan ${currentQuestion + 1} dari ${questions.length}</h3>
        <h3>${q.question}</h3>

        ${q.options.map((option, index) => `
            <label>
                <input type="radio" name="answer" value="${index}">
                ${option}
            </label>
        `).join("")}
    `;
}

function nextQuestion() {
    const selected = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (!selected) {
        alert("Pilih jawaban terlebih dahulu!");
        return;
    }

    answers.push(Number(selected.value));
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const correct = questions.filter(
        (q, index) => q.answer === answers[index]
    ).length;

    const score = correct * 20;
    const current = getCurrentUser();

    if (current) {
        current.score += score;
        current.quizCount++;
        updateUser(current);
    }

    document.getElementById("quizArea").innerHTML = "";
    document.getElementById("nextButton").style.display = "none";

    document.getElementById("quizResult").innerHTML = `
        <h2>Kuis Selesai!</h2>
        <p>Jawaban benar: ${correct} dari ${questions.length}</p>
        <h2>Nilai: ${score}</h2>
        <p>Terus tingkatkan pengetahuanmu!</p>
        <a href="dashboard.html">Kembali ke Dashboard</a>
    `;
}

if (document.getElementById("quizArea")) {
    showQuestion();
}
