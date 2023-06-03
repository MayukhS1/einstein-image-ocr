import { LightningElement, api } from 'lwc';
import images from '@salesforce/resourceUrl/images';
import getImageBase60 from '@salesforce/apex/FileUploadController.getImageBase60';

export default class FileUploadExample extends LightningElement {
    @api
    myRecordId;

    //image urls
    firstColumnImageUrl;
    einsteinImageUrl;

    //image for OCR
    uploadedImageBase64;

    get acceptedFormats() {
        return ['.jpg', '.png', '.jpeg'];
    }
    connectedCallback() {
        console.log(images);
        this.firstColumnImageUrl = images + '/images/illustrations/empty-state-tasks.svg';
        this.einsteinImageUrl = images + '/images/einstein-headers/einstein-figure.svg';
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        try {
            if (uploadedFiles.length > 0) {
                const imageFile = uploadedFiles[0];
                if(imageFile){
                    console.log('imageFile==>'+JSON.stringify(imageFile));
                    // call apex method to get public image link
                    getImageBase60({contentVersionId: imageFile.contentVersionId})
                    .then(result => {
                        console.log('result==>'+JSON.stringify(result));
                        this.uploadedImageBase64 = result;
                    })
                    .catch(error => {
                        console.log('error==>'+JSON.stringify(error));
                    });
                }
            }
        } catch (error) {
            console.log('error!!!!'+error);
        }
    }
    handleScanImageClick(event) {
        if (this.uploadedImageBase64) {
            this.firstColumnImageUrl = 'data:image/png;base64, '+this.uploadedImageBase64;
        }
    }
}