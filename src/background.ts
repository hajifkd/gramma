chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateIcon(tab.url);
    });
});

function updateIcon(url: string | null | undefined) {
    console.log(url);
    if (url != null && url.includes('https://mail.google.com')) {
        chrome.action.setIcon({ path: 'icons/icon128.png' });
    } else {
        chrome.action.setIcon({ path: 'icons/icon_gray128.png' });
    }
}

// call updateIcon for the current active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] != null) {
        updateIcon(tabs[0].url);
    }
});

