// Função para calcular a pontuação de privacidade
function calculatePrivacyScore() {
  let score = 100; // Começa com pontuação máxima

  Promise.all([
    checkCookies(),
    checkCanvasFingerprinting(),
    detectBrowserThreats(),
    checkLocalStorage(),
    checkThirdPartyRequests()
  ]).then(results => {
    score -= results.reduce((a, b) => a + b, 0);
    displayScore(score);
  });
}

function checkCookies() {
  return browser.cookies.getAll({}).then(cookies => cookies.length > 10 ? 10 : 0);
}

function checkCanvasFingerprinting() {
  return browser.tabs.executeScript({ code: 'window.canvasFingerprinting' })
    .then(results => results[0] ? 30 : 0);
}

function checkLocalStorage() {
  return browser.tabs.executeScript({ code: 'Object.keys(localStorage).length' })
    .then(results => results[0] > 20 ? 10 : 0);
}

function checkThirdPartyRequests() {
  return browser.runtime.sendMessage("getThirdPartyRequests")
    .then(requests => requests.length > 15 ? 15 : 0);
}

function displayScore(score) {
  const scoreElement = document.getElementById('privacy-score');
  if (scoreElement) {
    scoreElement.innerHTML = `
      <h2>🔒 Pontuação de Privacidade</h2>
      <div class="score-content">
        <div class="score-value" style="font-size: 24px; font-weight: bold; color: ${getScoreColor(score)};">
          ${score}/100
        </div>
        <div class="score-description">
          ${getScoreDescription(score)}
        </div>
      </div>
    `;
  }
}

function getScoreColor(score) {
  if (score > 70) return 'green';
  if (score > 40) return 'orange';
  return 'red';
}

function getScoreDescription(score) {
  if (score > 70) return 'Boa privacidade! O site está bem protegido.';
  if (score > 40) return 'Privacidade moderada. Há espaço para melhorias.';
  return 'Privacidade baixa. Recomenda-se tomar medidas para aumentar a proteção.';
}



// Executa a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', calculatePrivacyScore);
