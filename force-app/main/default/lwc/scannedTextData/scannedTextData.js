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
        if(this.scannedresult.hasOwnProperty('name') ||this.scannedresult.hasOwnProperty('person') ){
            this.name = this.scannedresult.name.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('phone')){
            this.phone = this.scannedresult.phone.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('email')){
            this.email = this.scannedresult.email.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('company')){
            this.company = this.scannedresult.company.join(', ');
        }
        if(this.scannedresult.hasOwnProperty('other')){
            this.other = [...this.scannedresult.other];
        }
    }
}