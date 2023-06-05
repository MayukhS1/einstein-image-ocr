public class OCRDetailsWrapper {
    public Map<String, List<String>> valueMap;
    public OCRDetailsWrapper( EinsteinOCRPredictionResponseWrapper einsteinOCRPredictionResponseWrapper) {
        this.valueMap = new Map<String, List<String>>();
        List<EinsteinOCRPredictionResponseWrapper.ProbabilityWrapper> probabilityWrapperList = einsteinOCRPredictionResponseWrapper.probabilities;
        for(EinsteinOCRPredictionResponseWrapper.ProbabilityWrapper probability : probabilityWrapperList) {
            String tag = probability.attributes.tag;
            if(!valueMap.containsKey(tag)) {
                valueMap.put(tag, new List<String>{probability.label});
            }else{
                valueMap.get(tag).add(probability.label);
            }
        }
    }

    public List<String> getTagValues(String tag) {
        if(valueMap.containsKey(tag)) {
            return valueMap.get(tag);
        }
        return new List<String>();
    }

    public Map<String, List<String>> getTagValuesMap() {
        return valueMap;
    }
}