// Função para detectar Canvas Fingerprinting através de toDataURL
function detectCanvasFingerprinting() {


  return new Promise((resolve) => {
    let fingerprintDetected = false;
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    HTMLCanvasElement.prototype.toDataURL = function() {
      console.log("Método toDataURL() interceptado - possível tentativa de fingerprinting.");
      fingerprintDetected = true;
      return originalToDataURL.apply(this, arguments);
    };

    HTMLCanvasElement.prototype.getContext = function() {
      console.log("Método getContext() interceptado - possível tentativa de fingerprinting.");
      fingerprintDetected = true;
      return originalGetContext.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.getImageData = function() {
      console.log("Método getImageData() interceptado - possível tentativa de fingerprinting.");
      fingerprintDetected = true;
      return originalGetImageData.apply(this, arguments);
    };

    // Detectar uso de WebGL
    const originalWebGLGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType) {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        console.log("Uso de WebGL detectado - possível tentativa de fingerprinting.");
        fingerprintDetected = true;
      }
      return originalWebGLGetContext.apply(this, arguments);
    };

    // Aguarda um curto período para permitir que a página execute seus scripts
    setTimeout(() => {
      // Restaura os métodos originais para evitar interferências
      HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
      HTMLCanvasElement.prototype.getContext = originalGetContext;
      CanvasRenderingContext2D.prototype.getImageData = originalGetImageData;
      resolve(fingerprintDetected);
    }, 1000);
  });
}

// Função para exibir o resultado da detecção
function displayCanvasFingerprinting() {

  const canvasElement = document.getElementById('canvas-fingerprint');
  
  // Create the h2 toggle element
  const toggleHeader = document.createElement('h2');
  toggleHeader.className = 'toggle-header';
  toggleHeader.innerHTML = '<span class="toggle-icon">▶</span> 🎨 Canvas Fingerprinting';
  
  // Create a div to hold the content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'canvas-content';
  contentDiv.style.display = 'none';
  
  // Add the toggle and content div to the canvasElement
  canvasElement.appendChild(toggleHeader);
  canvasElement.appendChild(contentDiv);
  
  // Add click event to toggle visibility
  toggleHeader.addEventListener('click', () => {
    contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
    toggleHeader.querySelector('.toggle-icon').textContent = contentDiv.style.display === 'none' ? '▶' : '▼';
  });
  
  detectCanvasFingerprinting().then((detected) => {
    if (detected) {
      contentDiv.textContent = "🆘 Canvas Fingerprinting detectado na página.";
      contentDiv.style.color = "red";
    } else {
      contentDiv.textContent = "🛡️ Nenhum Canvas Fingerprinting detectado.";
      contentDiv.style.color = "green";
    }
  }).catch((error) => {
    console.error("Erro ao exibir a detecção:", error);
  });
}

// Executar a detecção quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  displayCanvasFingerprinting();
});



