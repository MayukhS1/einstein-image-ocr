import { LightningElement, api, track } from 'lwc';
import images from '@salesforce/resourceUrl/images';
import getImageBase60 from '@salesforce/apex/FileUploadController.getImageBase60';
import initiateOCRScan from '@salesforce/apex/FileUploadController.initiateOCRScan';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
//import EMAIL_FIELD from '@salesforce/schema/Account.Email__c';

export default class fileUploadOCR extends LightningElement {
    @api
    myRecordId;

    //image urls
    firstColumnImageUrl;
    einsteinImageUrl;

    //image for OCR
    uploadedImageBase64;
    ocrResult='';
    showCardDetails = false;

    //scanned_result
    @track scannedResult = {
        "PERSON": ["John Doe"],
        "PHONE": ["1234567890","0987654321"],
        "EMAIL": ["test@test.com"],
        "ORG": ["Salesforce.com, Inc."],
        "OTHER": ["San Francisco, CA 94105","United States of America","https://www.salesforce.com"]
    };

    //utility
    showSpinner = false;

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
                        this.firstColumnImageUrl = 'data:image/png;base64, '+result;
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
            /* temporary comment out*/
            this.showSpinner = true;
            initiateOCRScan({base60Image: this.uploadedImageBase64})
            .then(result => {
                console.log('result==>'+result);
                this.scannedResult = JSON.parse(result);
                this.showCardDetails = true;
                this.showSpinner = false;
            })
            .catch(error => {
                console.log('error==>'+JSON.stringify(error));
                this.showSpinner = false;
                alert('OCR scan failed');
            });
            /**/
        }else{
            alert('Please upload the image first');
        }
    }

    handleSearch(event) {
        if(this.scannedResult){
            this.dispatchEvent(new CustomEvent('buttonpress', {detail: {key: 'search', value: this.scannedResult}}));
        }else{
            alert('Please scan the image first');
        }
    }
    handleCreate(event){
        if(this.scannedResult){
            this.dispatchEvent(new CustomEvent('buttonpress', {detail: {key: 'create', value: this.scannedResult}}));
        }else{
            alert('Please scan the image first');
        }
    //     const fields = {};
    //     console.log('scannedresult==>'+JSON.stringify(this.scannedResult));
    //     if(this.scannedResult.hasOwnProperty('PERSON') ){
    //         fields[NAME_FIELD.fieldApiName] = this.scannedResult.PERSON.join(', ');
    //     }
    //     if(this.scannedResult.hasOwnProperty('PHONE')){
    //         fields[PHONE_FIELD.fieldApiName] = this.scannedResult.PHONE.join(', ');
    //     }
    //     //if(this.scannedResult.hasOwnProperty('EMAIL')){
    //    //     fields[EMAIL_FIELD.fieldApiName] = this.scannedResult.EMAIL.join(', ');
    //     //}
    //     const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
    //     createRecord(recordInput)
    //         .then(account => {
    //             this.accountId = account.id;
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Account created',
    //                     variant: 'success',
    //                 }),
    //             );
    //         })
    //         .catch(error => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error creating record',
    //                     message: error.body.message,
    //                     variant: 'error',
    //                 }),
    //             );
    //         });
        
    }
}