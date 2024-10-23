// detectCanvas.js

(function() {
    console.log('Injetando script de detecção de Canvas Fingerprinting na página.');
  
    const suspiciousMethods = ['toDataURL', 'getImageData', 'toBlob'];
    let canvasFingerprinting = false;
  
    // Intercepta os métodos do canvas para detectar fingerprinting
    function interceptCanvasMethods(ctx) {
      suspiciousMethods.forEach(method => {
        const originalMethod = ctx[method];
        ctx[method] = function() {
          console.log('Fingerprinting detectado com o método:', method);
          canvasFingerprinting = true;
          return originalMethod.apply(this, arguments);
        };
      });
    }
  
    // Função para verificar canvas existentes e criados dinamicamente
    function checkExistingAndDynamicCanvas() {
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          interceptCanvasMethods(ctx);
        }
      });
  
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'CANVAS') {
              console.log('Canvas adicionado dinamicamente ao DOM.');
              const ctx = node.getContext('2d');
              if (ctx) {
                interceptCanvasMethods(ctx);
              }
            }
          });
        });
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  
    // Interceptar o método createElement para capturar canvas criados programaticamente
    const originalCreateElement = document.createElement;
    document.createElement = function(tag) {
      if (tag === 'canvas') {
        console.log('Canvas criado via createElement.');
        const canvas = originalCreateElement.apply(this, arguments);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          interceptCanvasMethods(ctx);
        }
        return canvas;
      }
      return originalCreateElement.apply(this, arguments);
    };
  
    // Sobrescreve o método getContext para capturar contextos 2D de canvas criados offscreen
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type) {
      const context = originalGetContext.apply(this, arguments);
      if (type === '2d') {
        console.log('Contexto 2D capturado.');
        interceptCanvasMethods(context);
      }
      return context;
    };
  
    // Inicialmente verificar qualquer canvas existente e observar o DOM
    checkExistingAndDynamicCanvas();
  
    // Enviar resultado para o background
    browser.runtime.sendMessage({
      type: 'canvas-detection-result',
      fingerprintDetected: canvasFingerprinting
    });
  })();
  