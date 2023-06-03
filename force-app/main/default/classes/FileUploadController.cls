public with sharing class FileUploadController {

    @AuraEnabled
    public static String getImageBase60(String contentVersionId){
        if(String.isBlank(contentVersionId)){
            throw new Custom_FileUploadException('Content Version Id is required');
        }
        return ImageUtility.getBlobValue(contentVersionId);
    }

    @AuraEnabled
    public static EinsteinOCRPredictionResponseWrapper initiateOCRScan(String base60Image){
        if(String.isBlank(base60Image)){
            throw new Custom_FileUploadException('base60Image content is missing');
        }
        String reponse = OCRUtility.initiateOCRScan(base60Image);
        return OCRUtility.parseResponse(reponse);
    }

    //custom exception class to throw error
    public Class Custom_FileUploadException extends Exception {
    }
}