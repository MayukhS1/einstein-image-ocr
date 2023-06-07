import { LightningElement,track } from 'lwc';
export default class OCRParent extends LightningElement {
    @track searchJson;
    handleButtonPress(event){
        if(event.detail.key==='search'){
            this.searchJson=event.detail.value;
            console.log('this.searchJson==>'+JSON.stringify(this.searchJson));
            this.template.querySelector('c-show-Data').handleSearch(this.searchJson);
        }else if(event.detail.key==='create'){

        }else if(event.detail.key==='clear'){

        }
    }
}