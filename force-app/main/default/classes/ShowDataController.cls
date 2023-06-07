public with sharing class ShowDataController {
    public static List<String> personList;
    public static List<String> phoneList;
    public static List<String> emailList;
    public static List<String> websiteList;
    public static List<String> orgList;
   @AuraEnabled
   public static string getOrgData(String person, String phone, String email, String website, String org){
        Map<String, List<SObject>> valueMap = new Map<String, List<SObject>>();
        try {
            personList = person.split(',');
            phoneList = phone.split(',');
            emailList = email.split(',');
            websiteList = website.split(',');
            orgList = org.split(',');
            valueMap = organizedSearch(valueMap);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serializePretty(valueMap);
    }

    public static Map<String, List<SObject>> organizedSearch(Map<String, List<SObject>> valueMap){
        List<Account> accountList = searchAccount();
        List<Contact> contactList = searchContact();
        List<Lead> leadList = searchLead();

        valueMap.put('Account', accountList);
        valueMap.put('Contact', contactList);
        valueMap.put('Lead', leadList);

        return valueMap;
    }

    private static List<Account> searchAccount(){
        List<Account> accountList = [
            SELECT Id, Name, Phone, website FROM Account 
            WHERE Name in :personList OR Name in :orgList OR 
            (Phone != '' AND Phone in :phoneList) OR 
            (website != '' AND website in :websiteList)
        ]; 
        return accountList;
    }

    private static List<Contact> searchContact(){
        List<Contact> contactList = [
            SELECT Id, Name, Phone, Email FROM Contact 
            WHERE Name in :personList OR 
            (Phone != '' AND Phone in :phoneList) OR 
            (Email != '' AND Email in :emailList)
        ]; 
        return contactList;
    }

    private static List<Lead> searchLead(){
        List<Lead> leadList = [SELECT Id, Name, Phone, Email FROM Lead 
            WHERE Name in :personList OR 
            (Phone != '' AND Phone in :phoneList) OR 
            (Email != '' AND Email in :emailList)
        ]; 
        return leadList;
    }
}