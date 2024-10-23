
function showThirdPartyRequests() {
  document.addEventListener('DOMContentLoaded', () => {
    const thirdPartySection = document.getElementById("third-party-list");
    
    // Título da seção
    const toggleHeader = document.createElement('h2');
    toggleHeader.className = 'toggle-header';
    toggleHeader.innerHTML = '<span class="toggle-icon">▶</span> 🌐 Requisições de Terceiros';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'third-party-content';
    contentDiv.style.display = 'none';
    
    // Adicionar o título e o conteúdo à seção
    thirdPartySection.appendChild(toggleHeader);
    thirdPartySection.appendChild(contentDiv);
    
    // Adicionar evento de clique para toogle
    toggleHeader.addEventListener('click', () => {
      contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
      toggleHeader.querySelector('.toggle-icon').textContent = contentDiv.style.display === 'none' ? '▶' : '▼';
    });

    browser.runtime.sendMessage("getThirdPartyRequests").then(requests => {
      // Se não houver requisições
      if (!requests || requests.length === 0) {
        contentDiv.innerHTML = "<p style='color: green;'>Nenhuma requisição de terceiros encontrada</p>";
        return;
      }

      // Remover repetições
      const uniqueRequests = [...new Set(requests)];

      // Agrupar por hostname
      const groupedRequests = uniqueRequests.reduce((acc, url) => {
        const hostname = new URL(url).hostname;
        acc[hostname] = (acc[hostname] || []).concat(url);
        return acc;
      }, {});

      // Mostrar as requisições agrupadas
      Object.entries(groupedRequests).forEach(([hostname, urls]) => {
        const hostnameDiv = document.createElement("div");
        hostnameDiv.className = "hostname-item";
        
        const hostnameToggle = document.createElement("div");
        hostnameToggle.className = "hostname-toggle";
        hostnameToggle.innerHTML = `<span class="toggle-icon">▶</span> ${hostname} <span class="url-count">(${urls.length})</span>`;
        hostnameDiv.appendChild(hostnameToggle);
        
        const urlList = document.createElement("ul");
        urlList.className = "url-list";
        urlList.style.display = "none";
        hostnameDiv.appendChild(urlList);

        urls.forEach(url => {
          const urlItem = document.createElement("li");
          urlItem.className = "url-item";
          urlItem.textContent = url;
          urlItem.addEventListener("click", () => {
            browser.tabs.create({url: url});
          });
          urlList.appendChild(urlItem);
        });

        hostnameToggle.addEventListener("click", () => {
          urlList.style.display = urlList.style.display === "none" ? "block" : "none";
          hostnameToggle.querySelector('.toggle-icon').textContent = urlList.style.display === "none" ? "▶" : "▼";
        });

        contentDiv.appendChild(hostnameDiv);
      });
    });
  });
}

showThirdPartyRequests();
