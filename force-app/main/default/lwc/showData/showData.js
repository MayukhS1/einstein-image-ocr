import { LightningElement, api, track } from 'lwc';
import images from '@salesforce/resourceUrl/images';
import getOrgData from '@salesforce/apex/ShowDataController.getOrgData';

export default class ShowData extends LightningElement {
    columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Email', fieldName: 'Email' },
    ];
    showDetails = false;
    firstColumnImageUrl = images + '/images/illustrations/empty-state-events.svg';
    @track data = [];
    @track columnData = [];

    @api handleSearch(searchJson) {
        this.showDetails = true;
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
                this.data = JSON.parse(result);
                if(this.data){
                    if(this.data.hasOwnProperty('Account') && this.data.Account){
                        this.columnData = [{ Id: this.data.Account[0].Id ? this.data.Account[0].Id : ' ',
                                            Name: this.data.Account[0].Name ? this.data.Account[0].Name : ' ',
                                            Phone: this.data.Account[0].Phone ? this.data.Account[0].Phone : ' ',
                                            Email: this.data.Account[0].Email ? this.data.Account[0].Email : ' '
                                        }];
                    }
                }
            })
            .catch(error => {
                console.log('error==>' + JSON.stringify(error));
            });
        } catch (error) {
            console.log('error==>' + error);
        }
    }
}