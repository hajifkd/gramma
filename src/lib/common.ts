import { getUrls } from './config';

export enum BackgroundCommand {
    GetUrls = 'GET_URLS',
    SetUrls = 'SET_URLS',
    GetAzureEndpoint = 'GET_AZURE_ENDPOINT',
    SetAzureEndpoint = 'SET_AZURE_ENDPOINT',
    GetAzureApiKey = 'GET_AZURE_API_KEY',
    SetAzureApiKey = 'SET_AZURE_API_KEY',
    GetDeploymentName = 'GET_DEPLOYMENT_NAME',
    SetDeploymentName = 'SET_DEPLOYMENT_NAME',
    Debug = 'DEBUG',
}

export async function isUrlInList(url: string): Promise<boolean> {
    const urls = await getUrls();
    return isUrlInUrls(url, urls);
}

export async function isUrlInUrls(url: string, urls: string[] | null | undefined): Promise<boolean> {
    // TODO: probably use regexp? or wildcard?
    return urls?.some(u => url.startsWith(u)) || false;
}


