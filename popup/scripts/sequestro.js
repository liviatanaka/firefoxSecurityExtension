// Função para detectar tentativas de sequestro de navegador (hijacking e hooking)
function detectBrowserThreats() {
    return browser.tabs.executeScript({
      code: `

        // Detecção de hookings ou injeções de scripts maliciosos
        var hookingAttempts = [];
        document.addEventListener('DOMNodeInserted', function(event) {
          if (event.target.tagName === 'SCRIPT') {
            const scriptSrc = event.target.src || 'inline script';
            // Avalia se o script é suspeito
            if (isSuspiciousScript(scriptSrc)) {
              hookingAttempts.push(scriptSrc);
            }
          }
        });
  
        // Função para detectar padrões de scripts suspeitos (pode ser adaptada)
        function isSuspiciousScript(scriptSrc) {
          const suspiciousPatterns = [/malicious\.com/, /tracking\.js/, /untrusted-source/];
          return suspiciousPatterns.some(pattern => pattern.test(scriptSrc));
        }
  
        // Retorna o número de tentativas suspeitas
        var totalHookingAttempts = hookingAttempts.length;
        
        // Definição de um "score" de ameaça baseado nas detecções
        totalHookingAttempts;
        
      `
    }).then(results => {
      const suspiciousActions = results[0];
      return suspiciousActions > 2 ? 20 : suspiciousActions > 0 ? 10 : 0; // Score adaptado com base em detecções
    }).catch(error => {
      console.error("Erro ao detectar ameaças ao navegador:", error);
      return 0;
    });
  }
  
  // Executa a função quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', () => {
    detectBrowserThreats().then(score => {
      const hijackingElement = document.getElementById('browser-hijacking');
      if (hijackingElement) {
        hijackingElement.innerHTML = `
          <h2 class="toggle-header">
            <span class="toggle-icon">▶</span> 🖥️ Browser Hijacking & Hooking
          </h2>
          <div class="hijacking-content" style="display: none;">
            <div class="hijacking-score" style="font-weight: bold; color: ${score > 0 ? 'red' : 'green'};">
              ${score > 0 ? 'Ameaça Detectada' : 'Nenhuma ameaça detectada'}
            </div>
            <div class="hijacking-description">
              ${score > 0 ? 'Foram detectadas possíveis tentativas de sequestro de navegador e/ou hook malicioso.' : 'Nenhuma tentativa de sequestro ou hook detectado.'}
            </div>
          </div>
        `;
        addToggleListener(hijackingElement);
      }
    });
  });
  
  // Função para permitir o colapso e expansão do conteúdo
  function addToggleListener(element) {
    const header = element.querySelector('.toggle-header');
    const content = element.querySelector('.hijacking-content');
    const icon = element.querySelector('.toggle-icon');
    
    header.addEventListener('click', () => {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
      icon.textContent = content.style.display === 'none' ? '▶' : '▼';
    });
  }
  