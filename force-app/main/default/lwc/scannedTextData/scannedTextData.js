import { LightningElement, api } from 'lwc';

export default class ScannedTextData extends LightningElement {
    @api scannedresult;

    name;
    phone;
    email;
    company;
    other;
    connectedCallback() {
        console.log('scannedresult==>'+JSON.stringify(this.scannedresult));
        if(this.scannedresult.hasOwnProperty('PERSON') ){
            this.name = this.scannedresult.PERSON.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('PHONE')){
            this.phone = this.scannedresult.PHONE.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('EMAIL')){
            this.email = this.scannedresult.EMAIL.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('ORG')){
            this.company = this.scannedresult.ORG.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('OTHER')){
            this.other = [...this.scannedresult.OTHER];
        }
    }
}