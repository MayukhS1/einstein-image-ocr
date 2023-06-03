public with sharing class FileUploadController {

    @AuraEnabled
    public static String getImageBase60(String contentVersionId){
        if(String.isBlank(contentVersionId)){
            throw new Custom_FileUploadException('Content Version Id is required');
        }
        return ImageUtility.getBlobValue(contentVersionId);
    }

    //custom exception class to throw error
    public Class Custom_FileUploadException extends Exception {
    }
}