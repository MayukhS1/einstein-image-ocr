public class TempClass {
    public static String getAccessToken(){
        String token = EinsteinServicesAPIAuthenticationHandler.getAccessToken('Einstein_OCR_JWT');
		System.debug(token);
        return token;
    }
    public static String getBlobValue(){
        ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Title = '115_business_card_cropped' LIMIT 1];
        String base64Data = EncodingUtil.base64Encode(cv.VersionData);
        return base64Data;
    }
    public static void getBusinessCardText() {
        String access_token = getAccessToken();
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint('https://api.einstein.ai/v2/vision/ocr');
        req.setHeader('content-type', 'multipart/form-data; charset="UTF-8"; boundary="1ff13444ed8140c7a32fc4e6451aa76d"');
        req.setHeader('Authorization', 'Bearer '+access_token); //replace token with your access token
        
        req.setHeader('Cache-Control', 'no-cache');
        string form64 = '';
        
        form64 += HttpFormBuilder.WriteBoundary();
        form64 += HttpFormBuilder.WriteBodyParameter('sampleBase64Content', getBlobValue());
        //form64 += HttpFormBuilder.WriteBodyParameter('sampleLocation', 'https://developer.salesforce.com/1/content-asset/immutable/s/16854879250000000/salesforcedocseinstein-vision-language/content/media/business_card_original.jpeg');
        form64 += HttpFormBuilder.WriteBoundary();
        form64 += HttpFormBuilder.WriteBodyParameter('modelId', 'OCRModel');
        form64 += HttpFormBuilder.WriteBoundary();
        form64 += HttpFormBuilder.WriteBodyParameter('task', 'contact');
        form64 += HttpFormBuilder.WriteBoundary(HttpFormBuilder.EndingType.CrLf);
        
        blob formBlob = EncodingUtil.base64Decode(form64);
        string contentLength = string.valueOf(formBlob.size());
        
        req.setBodyAsBlob(formBlob);
        req.setHeader('Connection', 'keep-alive');
        req.setHeader('Content-Length', contentLength);
        req.setTimeout(60*1000);
        
        Http h = new Http();
        String resp;
        HttpResponse res = h.send(req);
        resp = res.getBody();
        System.debug('Status Code: '+res.getStatusCode());

        Integration_Tracker__c tracker = new Integration_Tracker__c();
        tracker.service__c = 'OCR';
        //tracker.request__c = req.getBody();
        tracker.response__c = resp;
        insert tracker;
        // if(res.getStatusCode() == 200) {
        //     EinteinParser ocr = EinteinParser.parse(resp);  
        //     for( EinteinParser.Probabilities prob : ocr.probabilities) {
        //         system.debug('========Label==== '+prob.label);
        //         system.debug('========BoundingBox==== '+prob.boundingBox);
        //         system.debug('========probability==== '+prob.probability);
        //     }        
        // }
        
    }
}