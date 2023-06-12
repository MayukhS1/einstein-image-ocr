public with sharing class FileUploadController {

    @AuraEnabled
    public static String getImageBase60(String contentVersionId){
        if(String.isBlank(contentVersionId)){
            throw new Custom_FileUploadException('Content Version Id is required');
        }
        return ImageUtility.getBlobValue(contentVersionId);
    }

    @AuraEnabled
    public static String initiateOCRScan(String base60Image){
        if(String.isBlank(base60Image)){
            throw new Custom_FileUploadException('base60Image content is missing');
        }
        if(true){
            String reponse = OCRUtility.initiateOCRScan(base60Image);
            EinsteinOCRPredictionResponseWrapper einsteinOCRPredictionResponseWrapper = OCRUtility.parseResponse(reponse);
            OCRDetailsWrapper ocrDetails = new OCRDetailsWrapper(einsteinOCRPredictionResponseWrapper);
            return JSON.serializePretty(ocrDetails.getTagValuesMap());
        }else{
            Integration_Tracker__c tracker = [SELECT Id, Name, Response__c FROM Integration_Tracker__c WHERE Name = 'INT-0006' LIMIT 1];
            EinsteinOCRPredictionResponseWrapper wrp = OCRUtility.parseResponse(tracker.Response__c);
            OCRDetailsWrapper ocrDetails = new OCRDetailsWrapper(wrp);
            return JSON.serializePretty(ocrDetails.getTagValuesMap());
        }

    }

    //custom exception class to throw error
    public Class Custom_FileUploadException extends Exception {
    }
}