const azure = require('azure-storage');
require('dotenv').config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Create a BlobServiceClient object
const blobService = azure.createBlobService(accountName, accountKey);
function generateSasToken(containerName, blobName) {
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60); // 1 hour expiry

    const permissions = azure.BlobUtilities.SharedAccessPermissions.READ; // Adjust as needed

    const sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: permissions,
            Start: startDate,
            Expiry: expiryDate
        }
    };

    const sasToken = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
    return sasToken;
}
module.exports = {
    generateSasToken
};