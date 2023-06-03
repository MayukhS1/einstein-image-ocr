public class ImageUtility {
    public static String getBlobValue(String fileIdentifier){
        ContentVersion cv = [
            SELECT Id, VersionData FROM ContentVersion 
            WHERE Title =: fileIdentifier OR Id =: fileIdentifier  
            LIMIT 1];
        String base64Data = EncodingUtil.base64Encode(cv.VersionData);
        return base64Data;
    }
}