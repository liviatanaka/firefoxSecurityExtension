let thirdPartyRequests = [];
// let thirdPartyRequests= new Set();

// Função para verificar se a aba atual é a aba ativa
function isThirdParty(requestDetails, activeTabUrl) {
  const requestUrl = new URL(requestDetails.url);
  const tabUrl = new URL(activeTabUrl);
  return requestUrl.hostname !== tabUrl.hostname;
}

// Função para capturar as requisições de terceiros
function logRequest(requestDetails, activeTabUrl) {
  if (isThirdParty(requestDetails, activeTabUrl)) {
    thirdPartyRequests.push(requestDetails.url);
  }
}

// Função para obter a URL da aba ativa
function getActiveTabUrl() {
  return browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    return tabs[0].url;
  });
}

// Adiciona o listener para capturar requisições, mas só se elas forem da aba ativa
browser.webRequest.onBeforeRequest.addListener(
  (requestDetails) => {
    getActiveTabUrl().then(activeTabUrl => {
      logRequest(requestDetails, activeTabUrl);
    });
  },
  { urls: ["<all_urls>"] }
);

// Listener para enviar as requisições de terceiros para o popup quando solicitado
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getThirdPartyRequests") {
    sendResponse(thirdPartyRequests);
  }
});
