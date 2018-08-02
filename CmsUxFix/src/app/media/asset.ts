export class Asset {
    assetId: string;
    assetType: string;
    unityProjectSource: string;
    fileName: string;
    fileSize: string;
    assetContent: string;
    instructionsToReCreateImage: string;
    depicted: string;
    altTitle: string;
    description: string;
    uploadedBy: string;
    uploadedDate: string;
    constructor() {
        this.assetId = '';
        this.assetType = '';
        this.unityProjectSource = '';
        this.fileName = '';
        this.fileSize = '';
        this.assetContent = '';
        this.instructionsToReCreateImage = '';
        this.depicted = '';
        this.altTitle = '';
        this.description = '';
        this.uploadedBy = '';
        this.uploadedDate = '';
    }
}
