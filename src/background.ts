import { BackgroundCommand } from './lib/common';

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

let config_cache: any = {};

function commandToStorageKey(command: BackgroundCommand): string | null {
    switch (command) {
        case BackgroundCommand.GetUrls:
        case BackgroundCommand.SetUrls:
            return 'urls';
        case BackgroundCommand.GetAzureEndpoint:
        case BackgroundCommand.SetAzureEndpoint:
            return 'azureEndpoint';
        case BackgroundCommand.GetAzureApiKey:
        case BackgroundCommand.SetAzureApiKey:
            return 'azureApiKey';
        case BackgroundCommand.GetDeploymentName:
        case BackgroundCommand.SetDeploymentName:
            return 'deploymentName';
    }
    return null;
}

chrome.runtime.onMessage.addListener((message: { command: BackgroundCommand, data: any }, _sender, sendResponse) => {
    switch (message.command) {
        case BackgroundCommand.GetUrls:
        case BackgroundCommand.GetAzureEndpoint:
        case BackgroundCommand.GetAzureApiKey:
        case BackgroundCommand.GetDeploymentName:
            // typescript needs parentheses here.
            {
                const key = commandToStorageKey(message.command) as string;
                if (config_cache[key]) {
                    sendResponse(config_cache[key]);
                    return;
                }
                chrome.storage.sync.get(key, (items) => {
                    config_cache[key] = items[key];
                    sendResponse(items[key]);
                });
            }
            return;
        case BackgroundCommand.SetUrls:
        case BackgroundCommand.SetAzureEndpoint:
        case BackgroundCommand.SetAzureApiKey:
        case BackgroundCommand.SetDeploymentName:
            {
                const key = commandToStorageKey(message.command) as string;
                config_cache[key] = message.data;
                chrome.storage.sync.set({ key: message.data });
            }
            return;
    }
});
