import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OcrCreateNewRecord extends LightningElement {
    @track recordData;

    //utilities
    isAccount = false;
    isContact = false;
    isLead = false;
    showSpinner = false;
    get objectOptions() {
        return [
            {
                label: 'Account',
                value: 'Account'
            },
            {
                label: 'Contact',
                value: 'Contact'
            },
            {
                label: 'Lead',
                value: 'Lead'
            }
        ];
    }

    @track accountData = {
        Name: '',
        Phone: '',
        Email: '',
        Website: ''
    };

    @track contactData = {
        FirstName: '',
        LastName: '',
        Phone: '',
        Email: ''
    };

    @track leadData = {
        FirstName: '',
        LastName: '',
        Phone: '',
        Email: '',
        Company: ''
    };

    @api handleCreate(recordJson) {
        this.recordData = recordJson;
        console.log('recordJson in ocrCreateNewRecord==>' + JSON.stringify(recordJson));
    }

    handleChange(event) {
        const objectApiName = event.detail.value;
        console.log('objectApiName==>' + objectApiName);
        if (objectApiName === 'Account') {
            this.isAccount = true;
            this.isContact = false;
            this.isLead = false;
        } else if (objectApiName === 'Contact') {
            this.isContact = true;
            this.isAccount = false;
            this.isLead = false;
        } else if (objectApiName === 'Lead') {
            this.isLead = true;
            this.isAccount = false;
            this.isContact = false;
        }
        this.populateFields();
    }

    populateFields() {
        try {
            if(this.isAccount){
                this.accountData.Name = this.recordData.PERSON ? this.recordData.PERSON[0]: '';
                this.accountData.Phone = this.recordData.PHONE ? this.recordData.PHONE[0]: '';
                this.accountData.Email = this.recordData.EMAIL ? this.recordData.EMAIL[0]: '';
                this.accountData.Website = this.recordData.WEBSITE ? this.recordData.WEBSITE[0]: '';
                console.log('this.accountData==>'+JSON.stringify(this.accountData));
            }
            if(this.isContact){
                const fullname = this.recordData.PERSON ? this.recordData.PERSON[0] : '';
                if(fullname.includes(' ')){
                    this.contactData.FirstName = fullname.split(' ')[0];
                    this.contactData.LastName = fullname.split(' ')[1];
                }else{
                    this.contactData.LastName = fullname;
                }
                this.contactData.Phone = this.recordData.PHONE ? this.recordData.PHONE[0]: '';
                this.contactData.Email = this.recordData.EMAIL ? this.recordData.EMAIL[0]: '';
            }
        } catch (error) {
            console.log('error==>' + JSON.stringify(error));
            console.log(this.recordData);
        }
        
    }
    handleAccountSubmit(event) {
        this.showSpinner = true;
        event.preventDefault();
        const fields = event.detail.fields;
        console.log('fields==>' + JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleContactSubmit(event) {
        this.showSpinner = true;
        event.preventDefault();
        const fields = event.detail.fields;
        console.log('fields==>' + JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        this.showSpinner = false;
        //show success toast
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
        //triggerSearch();
    }

    triggerSearch() {
        const searchEvent = new CustomEvent('search', {
            detail: this.recordData
        });
        this.dispatchEvent(searchEvent);
    }
}