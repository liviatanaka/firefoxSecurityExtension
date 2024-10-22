let thirdPartyRequests = [];
let thirdPartyRequestsByHost = {};


// Função para verificar se a requisição é de terceira parte
function isThirdParty(requestDetails, activeTabUrl) {
  try{
    const requestUrl = new URL(requestDetails.url);
    const tabUrl = new URL(requestDetails.originUrl);
    return requestUrl.hostname !== tabUrl.hostname;
  } catch (error) {
    return false;
  }
}

// Função para capturar as requisições de terceiros
function logRequest(requestDetails, activeTabUrl) {
  if (isThirdParty(requestDetails, activeTabUrl)) {
    thirdPartyRequests.push(requestDetails.url);
    const hostname = new URL(requestDetails.originUrl).hostname;
    thirdPartyRequestsByHost[hostname] = (thirdPartyRequestsByHost[hostname] || []).concat(requestDetails.url);
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
    let activeTabUrl = browser.tabs.query({active: true, currentWindow: true})
      .then(tabs => tabs[0].url);

    activeTabUrl.then(url => {
      const hostname = new URL(url).hostname;


      let filteredRequests;
      if (hostname in thirdPartyRequestsByHost) {
        filteredRequests = thirdPartyRequestsByHost[hostname];
      } else {
        filteredRequests = [];
      }

      sendResponse(filteredRequests);
    }).catch(error => {
      console.error("Error getting active tab URL:", error);
      sendResponse([]);  // Envia um array vazio em caso de erro
    });

    return true;  
  }
});
