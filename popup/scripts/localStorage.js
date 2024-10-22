// Função para verificar o uso do localStorage na página atual
function checkLocalStorageUsage() {
  return browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      return browser.tabs.executeScript(tabs[0].id, {
        code: `
          (function() {
            const storageSize = JSON.stringify(localStorage).length;
            const itemCount = localStorage.length;
            return {
              itemCount: itemCount,
              storage: JSON.stringify(localStorage)
            };
          })();
        `
      });
    })
    .then(result => result[0]);
}

// Função para exibir o status de uso do localStorage
function displayLocalStorageUsage() {
  checkLocalStorageUsage()
    .then(usage => {
      let statusElement = document.getElementById("local-storage-status");

      statusElement.innerHTML = `
        <h2 class="toggle-header">
          <span class="toggle-icon">▶</span> 💾 Armazenamento Local
        </h2>
        <div class="local-storage-content" style="display: none;">
          ${usage.itemCount > 0 
            ? `<p style="color: green;">O site está utilizando o localStorage.</p>
               <p>Itens armazenados: ${usage.itemCount}</p>
               <h3 class="toggle-header">
                 <span class="toggle-icon">▶</span> Ver itens
               </h3>
               <table class="local-storage-items" style="display: none; width: 100%; border-collapse: collapse;">
                 <thead>
                   <tr>
                     <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Chave</th>
                     <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valor</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${Object.entries(JSON.parse(usage.storage)).map(([key, value]) => `
                     <tr>
                       <td style="border: 1px solid #ddd; padding: 8px;">${key.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')}</td>
                       <td style="border: 1px solid #ddd; padding: 8px; word-break: break-word;">
                         ${JSON.stringify(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')}
                       </td>
                     </tr>
                   `).join('')}
                 </tbody>
               </table>`
            : `<p style="color: blue;">O site não está utilizando o localStorage atualmente.</p>`
          }
        </div>
      `;

      // Adicionar funcionalidade de toggle para o conteúdo principal
      const mainToggleHeader = statusElement.querySelector('.toggle-header');
      const mainContent = statusElement.querySelector('.local-storage-content');
      const mainToggleIcon = mainToggleHeader.querySelector('.toggle-icon');

      mainToggleHeader.addEventListener('click', () => {
        mainContent.style.display = mainContent.style.display === 'none' ? 'block' : 'none';
        mainToggleIcon.textContent = mainContent.style.display === 'none' ? '▶' : '▼';
      });

      // Adicionar funcionalidade de toggle para os itens do localStorage
      if (usage.itemCount > 0) {
        const itemsToggleHeader = statusElement.querySelector('.local-storage-content .toggle-header');
        const itemsContent = statusElement.querySelector('.local-storage-items');
        const itemsToggleIcon = itemsToggleHeader.querySelector('.toggle-icon');

        itemsToggleHeader.addEventListener('click', () => {
          itemsContent.style.display = itemsContent.style.display === 'none' ? 'block' : 'none';
          itemsToggleIcon.textContent = itemsContent.style.display === 'none' ? '▶' : '▼';
        });
      }
    })
    .catch(error => {
      console.error("Erro ao verificar o uso do localStorage:", error);
      let statusElement = document.getElementById("local-storage-status");
      statusElement.innerHTML = `
        <h2 class="toggle-header">
          <span class="toggle-icon">▶</span> 💾 Armazenamento Local
        </h2>
        <div class="local-storage-content" style="display: none;">
          <p style="color: red;">Erro ao verificar o uso do localStorage.</p>
        </div>
      `;

      const toggleHeader = statusElement.querySelector('.toggle-header');
      const content = statusElement.querySelector('.local-storage-content');
      const toggleIcon = toggleHeader.querySelector('.toggle-icon');

      toggleHeader.addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        toggleIcon.textContent = content.style.display === 'none' ? '▶' : '▼';
      });
    });
}

// Executar a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', displayLocalStorageUsage);
