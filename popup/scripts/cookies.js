function showCookiesForTab(tabs) {
  let tab = tabs.pop();
  let gettingAllCookies = browser.cookies.getAll({url: tab.url});
  gettingAllCookies.then((cookies) => {
    let firstPartyCookies = [];
    let thirdPartyCookies = [];
    let sessionCookies = [];
    let persistentCookies = [];

    cookies.forEach(cookie => {
      if (tab.url.includes(cookie.domain.slice(1)) && cookie.firstPartyDomain == "") {
        firstPartyCookies.push(cookie);
      } else {
        thirdPartyCookies.push(cookie);
      }

      if (cookie.session) {
        sessionCookies.push(cookie);
      } else {
        persistentCookies.push(cookie);
      }
    });

    // Título
    const headerTitle = document.getElementById('header-title');
    headerTitle.textContent = `🔍 Análise do site: ${tab.title}`;
    headerTitle.style.color = '#4a4a4a';

    let cookieList = document.getElementById('cookie-list');
    cookieList.innerHTML = `
      <h2 class="toggle-header"> <span class="toggle-icon">▶</span>🍪 Cookies</h2>
      <ul class="cookie-details" style="display: none;">
        <li class="cookie-item">
          <span class="cookie-type">🍪 Primeira parte:</span>
          <span class="cookie-count">${firstPartyCookies.length}</span>
        </li>
        <li class="cookie-item">
          <span class="cookie-type">🌐 Terceira parte:</span>
          <span class="cookie-count">${thirdPartyCookies.length}</span>
        </li>
        <li class="cookie-item">
          <span class="cookie-type">⏳ Sessão:</span>
          <span class="cookie-count">${sessionCookies.length}</span>
        </li>
        <li class="cookie-item">
          <span class="cookie-type">💾 Persistentes:</span>
          <span class="cookie-count">${persistentCookies.length}</span>
        </li>
      </ul>
    `;

    // Adiciona estilos dinâmicos  
    cookieList.querySelectorAll('.cookie-item').forEach(item => {
      const count = parseInt(item.querySelector('.cookie-count').textContent);
      item.style.opacity = count > 0 ? '1' : '0.5';
    });

    // Adiciona funcionalidade de toggle
    const toggleHeader = cookieList.querySelector('.toggle-header');
    const cookieDetails = cookieList.querySelector('.cookie-details');
    const toggleIcon = cookieList.querySelector('.toggle-icon');

    toggleHeader.addEventListener('click', () => {
      cookieDetails.style.display = cookieDetails.style.display === 'none' ? 'block' : 'none';
      toggleIcon.textContent = cookieDetails.style.display === 'none' ? '▶' : '▼';
    });
  });
}

function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}

getActiveTab().then(showCookiesForTab);
