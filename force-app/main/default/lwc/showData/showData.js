import { LightningElement, api, track } from 'lwc';
import generateData from './generateData';
import images from '@salesforce/resourceUrl/images';
import getOrgData from '@salesforce/apex/ShowDataController.getOrgData';

export default class ShowData extends LightningElement {
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Company', fieldName: 'Company' },
        { label: 'Title', fieldName: 'Title' },
        { label: 'Email', fieldName: 'Email' },
    ];
    showDetails = false;
    firstColumnImageUrl = images + '/images/illustrations/empty-state-events.svg';
    data = [];
    columns = this.columns;

    connectedCallback() {
        const data = generateData({ amountOfRecords: 5 });
        this.data = data;
    }

    @api handleSearch(searchJson) {
        console.log('searchJson in showdata==>' + JSON.stringify(searchJson));
        this.callGetOrgData(searchJson);
    }

    callGetOrgData(searchJson) {
        try {
        const personList = searchJson.hasOwnProperty('PERSON') ? searchJson.PERSON : [];
        const phoneList = searchJson.hasOwnProperty('PHONE') ? searchJson.PHONE : [];
        const emailList = searchJson.hasOwnProperty('EMAIL') ? searchJson.EMAIL : [];
        const orgList = searchJson.hasOwnProperty('ORG') ? searchJson.ORG : [];
        const websiteList = searchJson.hasOwnProperty('WEBSITE') ? searchJson.WEBSITE : [];
        console.log('personList==>' + personList);
        console.log('phoneList==>' + phoneList);
        console.log('emailList==>' + emailList);
        console.log('orgList==>' + orgList);
        console.log('websiteList==>' + websiteList);
        getOrgData({ person: personList.join(','), phone: phoneList.join(','), email: emailList.join(','), org: orgList.join(','), website: websiteList.join(',') })
            .then(result => {
                console.log('result==>' + result);
                this.data = result;
            })
            .catch(error => {
                console.log('error==>' + JSON.stringify(error));
            });
        } catch (error) {
            console.log('error==>' + error);
        }
    }
}