import * as config from '../lib/config';

async function main() {
    const urls = await config.getUrls();
    const azureEndpoint = await config.getAzureEndpoint();
    const azureApiKey = await config.getAzureApiKey();
    const deploymentName = await config.getDeploymentName();

    (document.getElementById('url-list') as HTMLTextAreaElement).value = urls?.join('\n') || '';
    (document.getElementById('entry-point') as HTMLInputElement).value = azureEndpoint || '';
    (document.getElementById('api-key') as HTMLInputElement).value = azureApiKey || '';
    (document.getElementById('deployment-name') as HTMLInputElement).value = deploymentName || '';

    document.getElementById('save')?.addEventListener('click', async () => {
        const urls = (document.getElementById('url-list') as HTMLTextAreaElement).value.split('\n');
        const azureEndpoint = (document.getElementById('entry-point') as HTMLInputElement).value;
        const azureApiKey = (document.getElementById('api-key') as HTMLInputElement).value;
        const deploymentName = (document.getElementById('deployment-name') as HTMLInputElement).value;

        await config.setUrls(urls);
        await config.setAzureEndpoint(azureEndpoint);
        await config.setAzureApiKey(azureApiKey);
        await config.setDeploymentName(deploymentName);
    });

}

main();