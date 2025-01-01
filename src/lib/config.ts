import { BackgroundCommand } from "./common";

export async function getUrls(): Promise<string[] | undefined> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.GetUrls }, (response) => {
            resolve(response);
        });
    });
}

export async function setUrls(urls: string[]): Promise<void> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.SetUrls, data: urls }, () => {
            resolve();
        });
    });
}

export async function getAzureEndpoint(): Promise<string | undefined> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.GetAzureEndpoint }, (response) => {
            resolve(response);
        });
    });
}

export async function setAzureEndpoint(endpoint: string): Promise<void> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.SetAzureEndpoint, data: endpoint }, () => {
            resolve();
        });
    });
}

export async function getAzureApiKey(): Promise<string | undefined> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.GetAzureApiKey }, (response) => {
            resolve(response);
        });
    });
}

export async function setAzureApiKey(apiKey: string): Promise<void> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ command: BackgroundCommand.SetAzureApiKey, data: apiKey }, () => {
            resolve();
        });
    });
}
