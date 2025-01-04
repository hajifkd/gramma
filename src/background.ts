import { BackgroundCommand, isUrlInUrls } from './lib/common';

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateIcon(tab.url);
    });
});

async function updateIcon(url: string | null | undefined) {
    const urls = await new Promise<string[] | undefined>((resolve) => {
        processGetCommand(BackgroundCommand.GetUrls, resolve);
    });

    if (url != null && await isUrlInUrls(url, urls)) {
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

const CONFIG_KEY_URLS = 'urls';
const CONFIG_KEY_AZURE_ENDPOINT = 'azureEndpoint';
const CONFIG_KEY_AZURE_API_KEY = 'azureApiKey';
const CONFIG_KEY_DEPLOYMENT_NAME = 'deploymentName';

function commandToStorageKey(command: BackgroundCommand): string | null {
    switch (command) {
        case BackgroundCommand.GetUrls:
        case BackgroundCommand.SetUrls:
            return CONFIG_KEY_URLS;
        case BackgroundCommand.GetAzureEndpoint:
        case BackgroundCommand.SetAzureEndpoint:
            return CONFIG_KEY_AZURE_ENDPOINT;
        case BackgroundCommand.GetAzureApiKey:
        case BackgroundCommand.SetAzureApiKey:
            return CONFIG_KEY_AZURE_API_KEY;
        case BackgroundCommand.GetDeploymentName:
        case BackgroundCommand.SetDeploymentName:
            return CONFIG_KEY_DEPLOYMENT_NAME;
    }
    return null;
}

function processGetCommand(command: BackgroundCommand, sendResponse: (response: any) => void) {
    const key = commandToStorageKey(command) as string;
    if (config_cache[key]) {
        sendResponse(config_cache[key]);
        return;
    }
    chrome.storage.sync.get(key, (items) => {
        config_cache[key] = items[key];
        sendResponse(config_cache[key]);
    });
}

function processSetCommand(command: BackgroundCommand, data: any, sendResponse: () => void) {
    const key = commandToStorageKey(command) as string;
    config_cache[key] = data;
    chrome.storage.sync.set({ [key]: data }, () => {
        sendResponse();
    });
}

chrome.runtime.onMessage.addListener((message: { command: BackgroundCommand, data: any }, _sender, sendResponse) => {
    switch (message.command) {
        case BackgroundCommand.GetUrls:
        case BackgroundCommand.GetAzureEndpoint:
        case BackgroundCommand.GetAzureApiKey:
        case BackgroundCommand.GetDeploymentName:
            processGetCommand(message.command, sendResponse);
            return true;
        case BackgroundCommand.SetUrls:
        case BackgroundCommand.SetAzureEndpoint:
        case BackgroundCommand.SetAzureApiKey:
        case BackgroundCommand.SetDeploymentName:
            processSetCommand(message.command, message.data, sendResponse);
            return true;
        case BackgroundCommand.Debug:
            console.log(message.data);
            return false;
    }
    return false;
});
