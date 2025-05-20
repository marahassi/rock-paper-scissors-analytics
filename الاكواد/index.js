document.addEventListener("DOMContentLoaded", () => {
  const imgEls = document.querySelectorAll(".choices img");
  const resultEl = document.querySelector(".result");
  const userChoiceEl = document.querySelector(".user-choice");
  const computerChoiceEl = document.querySelector(".computer-choice");
  const userPointsEl = document.querySelector(".user-points");
  const computerPointsEl = document.querySelector(".computer-points");

  let userPoints = 0;
  let computerPoints = 0;
  const gameData = [];

  // متغيرات للمخططات
  let resultsChart = null;
  let choicesChart = null;

  function computerChoice() {
    const choices = ["rock", "paper", "scissor"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function gamePlay(userSelection, computerSelection) {
    if (userSelection === computerSelection) {
      return "It is a tie..!";
    } else if (
      (userSelection === "rock" && computerSelection === "scissor") ||
      (userSelection === "paper" && computerSelection === "rock") ||
      (userSelection === "scissor" && computerSelection === "paper")
    ) {
      return "Hurrah! You win..! " + userSelection + " beats " + computerSelection;
    } else {
      return "Oops! You lose...! " + computerSelection + " beats " + userSelection;
    }
  }

  // دالة ترسم لوحة التحكم التحليلية باستخدام Chart.js
  function renderDashboard(gameData) {
    const resultCounts = { win: 0, lose: 0, tie: 0 };
    const choiceCounts = { rock: 0, paper: 0, scissor: 0 };

    gameData.forEach(round => {
      resultCounts[round.result]++;
      choiceCounts[round.user]++;
    });

    // تحديث أو إنشاء مخطط نتائج اللعب
    const ctxResults = document.getElementById('resultsChart').getContext('2d');
    if (resultsChart) resultsChart.destroy();
    resultsChart = new Chart(ctxResults, {
      type: 'pie',
      data: {
        labels: ['Win', 'Lose', 'Tie'],
        datasets: [{
          data: [resultCounts.win, resultCounts.lose, resultCounts.tie],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'نتائج اللعب' } }
      }
    });

    // تحديث أو إنشاء مخطط اختيارات اللاعب
    const ctxChoices = document.getElementById('choicesChart').getContext('2d');
    if (choicesChart) choicesChart.destroy();
    choicesChart = new Chart(ctxChoices, {
      type: 'bar',
      data: {
        labels: ['Rock', 'Paper', 'Scissor'],
        datasets: [{
          label: 'اختيارات اللاعب',
          data: [choiceCounts.rock, choiceCounts.paper, choiceCounts.scissor],
          backgroundColor: ['#2196F3', '#9C27B0', '#FF5722'],
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'اختيارات اللاعب' } },
        scales: { y: { beginAtZero: true, stepSize: 1 } }
      }
    });
  }

  imgEls.forEach(img => {
    img.addEventListener("click", () => {
      const userSelection = img.id;
      const computerTurn = computerChoice();
      const result = gamePlay(userSelection, computerTurn);

      userChoiceEl.textContent = userSelection;
      computerChoiceEl.textContent = computerTurn;
      resultEl.textContent = result;

      if (result.includes("win")) userPoints++;
      else if (result.includes("lose")) computerPoints++;

      userPointsEl.textContent = userPoints;
      computerPointsEl.textContent = computerPoints;

      const roundData = {
        timestamp: new Date().toISOString(),
        user: userSelection,
        computer: computerTurn,
        result: result.includes("win") ? "win" : result.includes("lose") ? "lose" : "tie",
      };
      gameData.push(roundData);

      renderDashboard(gameData);

      // حفظ البيانات في localStorage
      localStorage.setItem("gameData", JSON.stringify(gameData));
    });
  });

  // تحميل البيانات المحفوظة عند بداية التشغيل (لو موجودة)
  const savedData = localStorage.getItem("gameData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    parsedData.forEach(round => gameData.push(round));
    userPoints = gameData.filter(r => r.result === "win").length;
    computerPoints = gameData.filter(r => r.result === "lose").length;
    userPointsEl.textContent = userPoints;
    computerPointsEl.textContent = computerPoints;
    renderDashboard(gameData);
  }

  // دالة تنزيل بيانات اللعب كملف JSON
  window.downloadGameData = function () {
    const data = localStorage.getItem("gameData");
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gameData.json";
    link.click();
  };
});

