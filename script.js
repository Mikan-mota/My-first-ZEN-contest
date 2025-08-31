document.addEventListener('DOMContentLoaded', () => {
    const scenarios = [
        {
          situation: "同僚から「あなたの資料はいつも分かりにくい」と指摘された",
          responses: [
            { text: "すみません、もう少し詳しく教えていただけますか？", correct: true, feedback: "良い対応です。具体的な改善点を聞く姿勢が大切です。" },
            { text: "でも他の人からは分かりやすいって言われてますよ", correct: false, feedback: "相手の意見を否定する対応は関係を悪化させます。" },
            { text: "はは、そうですかね...(苦笑い)", correct: false, feedback: "笑いで済ませるのは相手の気持ちを軽視していると受け取られます。" }
          ]
        },
        {
          situation: "上司から「君の報告は要点が見えない」と注意された",
          responses: [
            { text: "申し訳ありません。どの部分を改善すべきでしょうか？", correct: true, feedback: "謝罪と具体的な改善策を求める良い対応です。" },
            { text: "忙しくて時間がなかったので...", correct: false, feedback: "言い訳は相手の指摘を受け入れていない印象を与えます。" },
            { text: "そうですね...(愛想笑い)", correct: false, feedback: "真剣な指摘に笑顔で応じるのは不適切です。" }
          ]
        },
        {
          situation: "お客様から「対応が遅い」とクレームを受けた",
          responses: [
            { text: "ご不便をおかけして申し訳ございません。今後気をつけます", correct: true, feedback: "謝罪と改善の意思を示す適切な対応です。" },
            { text: "他にもたくさんのお客様がいらっしゃるので...", correct: false, feedback: "言い訳は相手の不満を増大させる可能性があります。" },
            { text: "そうですね...(困った笑い)", correct: false, feedback: "クレームに笑顔で応じるのは非常に不適切です。" }
          ]
        },
        {
          situation: "友人から「最近連絡をくれない」と言われた",
          responses: [
            { text: "ごめん、忙しくて気が回らなかった。今度から気をつけるよ", correct: true, feedback: "素直な謝罪と改善の意思を示す良い対応です。" },
            { text: "お互い様でしょ？君も連絡してこないじゃん", correct: false, feedback: "責任転嫁は関係を悪化させます。" },
            { text: "あはは、そうだね(軽い笑い)", correct: false, feedback: "軽い笑いは相手の気持ちを軽視していると受け取られます。" }
          ]
        },
        {
          situation: "部下から「指示が曖昧で困る」と相談された",
          responses: [
            { text: "そうですね、具体的にどの部分が分かりにくかったですか？", correct: true, feedback: "相手の意見を受け入れ、改善点を確認する良い対応です。" },
            { text: "みんなちゃんと理解してやってるけどな", correct: false, feedback: "他者との比較は相手を否定することになります。" },
            { text: "そう？気をつけるよ(軽く笑って)", correct: false, feedback: "真剣な相談に軽い対応は信頼を損ないます。" }
          ]
        }
    ];

    let currentScenario = 0;
    let score = 0;
    let completedScenarios = [];

    // DOM Elements
    const scenarioCounter = document.getElementById('scenario-counter');
    const scoreCounter = document.getElementById('score-counter');
    const progressBar = document.getElementById('progress-bar');
    const situationText = document.getElementById('situation-text');
    const responsesList = document.getElementById('responses-list');
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackText = document.getElementById('feedback-text');
    const nextButton = document.getElementById('next-button');
    
    const scenarioView = document.getElementById('scenario-view');
    const resultView = document.getElementById('result-view');
    const finalScore = document.getElementById('final-score');
    const finalMessage = document.getElementById('final-message');
    const resetButton = document.getElementById('reset-button');

    function renderScenario() {
        if (currentScenario >= scenarios.length) {
            showResults();
            return;
        }

        const scenario = scenarios[currentScenario];
        situationText.textContent = scenario.situation;
        responsesList.innerHTML = '';

        scenario.responses.forEach((response, index) => {
            const button = document.createElement('button');
            button.className = 'response-btn';
            
            const content = document.createElement('div');
            content.className = 'response-content';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = response.text;
            content.appendChild(textSpan);

            // Placeholder for icon
            const iconSpan = document.createElement('span');
            iconSpan.id = `icon-${index}`;
            content.appendChild(iconSpan);

            button.appendChild(content);

            button.onclick = () => handleResponseSelect(index);
            responsesList.appendChild(button);
        });

        updateProgress();
        feedbackBox.classList.add('hidden');
    }

    function handleResponseSelect(responseIndex) {
        if (completedScenarios.includes(currentScenario)) return;

        const scenario = scenarios[currentScenario];
        const selectedResponse = scenario.responses[responseIndex];

        // Update score
        if (selectedResponse.correct) {
            score++;
        }
        completedScenarios.push(currentScenario);

        // Disable all buttons
        const buttons = responsesList.querySelectorAll('.response-btn');
        buttons.forEach(button => button.disabled = true);

        // Style selected button
        const selectedButton = buttons[responseIndex];
        selectedButton.classList.add(selectedResponse.correct ? 'correct' : 'incorrect');

        // Show icon
        const iconSpan = document.getElementById(`icon-${responseIndex}`);
        iconSpan.innerHTML = selectedResponse.correct 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-correct"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-incorrect"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

        // Show feedback
        feedbackText.textContent = selectedResponse.feedback;
        feedbackBox.className = 'feedback-box'; // Reset classes
        feedbackBox.classList.add(selectedResponse.correct ? 'correct' : 'incorrect');
        feedbackBox.classList.remove('hidden');

        // Configure next button
        if (currentScenario < scenarios.length - 1) {
            nextButton.textContent = '次のシナリオへ';
            nextButton.className = 'next-button blue';
            nextButton.onclick = goToNextScenario;
        } else {
            nextButton.textContent = '結果を見る';
            nextButton.className = 'next-button green';
            nextButton.onclick = showResults;
        }

        updateProgress();
    }

    function goToNextScenario() {
        currentScenario++;
        renderScenario();
    }

    function updateProgress() {
        scenarioCounter.textContent = `シナリオ ${currentScenario + 1} / ${scenarios.length}`;
        scoreCounter.textContent = `正解: ${score} / ${completedScenarios.length}`;
        progressBar.style.width = `${((currentScenario + 1) / scenarios.length) * 100}%`;
    }
    
    function showResults() {
        scenarioView.classList.add('hidden');
        resultView.classList.remove('hidden');

        finalScore.textContent = `あなたのスコア: ${score} / ${scenarios.length}`;
        
        let message = "";
        if (score === scenarios.length) {
            message = "素晴らしい！完璧なコミュニケーションスキルです。";
        } else if (score >= scenarios.length * 0.7) {
            message = "良くできました！さらに練習を続けて向上させましょう。";
        } else {
            message = "練習を重ねることで、より良いコミュニケーションができるようになります。";
        }
        finalMessage.textContent = message;
    }

    function reset() {
        currentScenario = 0;
        score = 0;
        completedScenarios = [];
        resultView.classList.add('hidden');
        scenarioView.classList.remove('hidden');
        renderScenario();
    }
    
    resetButton.onclick = reset;

    // Initial render
    renderScenario();
});