import { LightningElement, api, track } from 'lwc';
import generateData from './generateData';
import images from '@salesforce/resourceUrl/images';

export default class ShowData extends LightningElement {
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Company', fieldName: 'Company'},
        { label: 'Title', fieldName: 'Title' },
        { label: 'Email', fieldName: 'Email'},
    ];
    showDetails = false;
    firstColumnImageUrl = images + '/images/illustrations/empty-state-events.svg';
    data = [];
    columns = this.columns;

    connectedCallback() {
        const data = generateData({ amountOfRecords: 5 });
        this.data = data;
    }

    @api handleSearch(searchJson){
        console.log('searchJson in showdata==>'+JSON.stringify(searchJson));
    }
}