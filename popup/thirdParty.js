// create a function to show the third-party requests
function showThirdPartyRequestsAndCookies() {
  document.addEventListener('DOMContentLoaded', () => {
    browser.runtime.sendMessage("getThirdPartyRequests").then(requests => {
      const list = document.getElementById("third-party-list");
      list.innerHTML = "";
      
      // if there are no requests, show a message
      if (requests.length === 0) {
        list.innerHTML = "<li>Nenhuma requisição de terceiros encontrada</li>";
        return;
      }

      // Remove duplicate URLs
      const uniqueRequests = [...new Set(requests)];

      // group by hostname
      const groupedRequests = uniqueRequests.reduce((acc, url) => {
        const hostname = new URL(url).hostname;
        acc[hostname] = (acc[hostname] || []).concat(url);
        return acc;
      }, {});

      // show the grouped requests by toggling the list
      Object.entries(groupedRequests).forEach(([hostname, urls]) => {
        const li = document.createElement("li");
        li.className = "hostname-item";
        
        const toggleIcon = document.createElement("span");
        toggleIcon.className = "toggle-icon";
        toggleIcon.textContent = "▶";
        li.appendChild(toggleIcon);
        
        const hostnameText = document.createElement("span");
        hostnameText.textContent = ` ${hostname} (${urls.length})`;
        li.appendChild(hostnameText);
        
        list.appendChild(li);

        // Create a nested unordered list for URLs
        const ul = document.createElement("ul");
        ul.className = "url-list";
        ul.style.display = "none";
        li.appendChild(ul);

        // Add URLs to the nested list
        urls.forEach(url => {
          const urlLi = document.createElement("li");
          urlLi.className = "url-item";
          urlLi.textContent = url;
          ul.appendChild(urlLi);
        });

        // Add click event to toggle the nested list
        li.addEventListener("click", (event) => {
          if (event.target === li || event.target === toggleIcon || event.target === hostnameText) {
            ul.style.display = ul.style.display === "none" ? "block" : "none";
            toggleIcon.textContent = ul.style.display === "none" ? "▶" : "▼";
          }
        });
      });



      
    });
  });
}

showThirdPartyRequestsAndCookies();
