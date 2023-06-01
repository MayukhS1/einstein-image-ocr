public class EinteinParser {

    public class BoundingBox {
        public Integer minX {get;set;} 
        public Integer minY {get;set;} 
        public Integer maxX {get;set;} 
        public Integer maxY {get;set;} 

        public BoundingBox(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'minX') {
                            minX = parser.getIntegerValue();
                        } else if (text == 'minY') {
                            minY = parser.getIntegerValue();
                        } else if (text == 'maxX') {
                            maxX = parser.getIntegerValue();
                        } else if (text == 'maxY') {
                            maxY = parser.getIntegerValue();
                        } else {
                            System.debug(LoggingLevel.WARN, 'BoundingBox consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Attributes {
        public String tag {get;set;}
        public CellLocation cellLocation {get;set;}

        public Attributes(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'tag') {
                            tag = parser.getText();
                        } else if (text == 'cellLocation') {   
                            cellLocation = new CellLocation(parser);    
                        } else {
                            System.debug(LoggingLevel.WARN, 'Attributes consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class CellLocation { 
        public Integer rowIndex {get;set;}  
        public Integer colIndex {get;set;}  
        public CellLocation(JSONParser parser) {    
            while (parser.nextToken() != System.JSONToken.END_OBJECT) { 
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {  
                    String text = parser.getText(); 
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {    
                        if (text == 'rowIndex') {   
                            rowIndex = parser.getIntegerValue();    
                        } else if (text == 'colIndex') {    
                            colIndex = parser.getIntegerValue();    
                        } else {    
                            System.debug(LoggingLevel.WARN, 'CellLocation consuming unrecognized property: '+text); 
                            consumeObject(parser);  
                        }   
                    }   
                }   
            }   
        }   
    }
    
    public String task {get;set;} 
    public List<Probabilities> probabilities {get;set;} 
    public String object_Z {get;set;} // in json: object

    public EinteinParser(JSONParser parser) {
        while (parser.nextToken() != System.JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                    if (text == 'task') {
                        task = parser.getText();
                    } else if (text == 'probabilities') {
                        probabilities = arrayOfProbabilities(parser);
                    } else if (text == 'object') {
                        object_Z = parser.getText();
                    } else {
                        System.debug(LoggingLevel.WARN, 'EinteinParser consuming unrecognized property: '+text);
                        consumeObject(parser);
                    }
                }
            }
        }
    }
    
    public class Probabilities {
        public Double probability {get;set;} 
        public String label {get;set;} 
        public BoundingBox boundingBox {get;set;} 
        public Attributes attributes {get;set;} 

        public Probabilities(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'probability') {
                            probability = parser.getDoubleValue();
                        } else if (text == 'label') {
                            label = parser.getText();
                        } else if (text == 'boundingBox') {
                            boundingBox = new BoundingBox(parser);
                        } else if (text == 'attributes') {
                            attributes = new Attributes(parser);
                        } else {
                            System.debug(LoggingLevel.WARN, 'Probabilities consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public static EinteinParser parse(String json) {
        System.JSONParser parser = System.JSON.createParser(json);
        return new EinteinParser(parser);
    }
    
    public static void consumeObject(System.JSONParser parser) {
        Integer depth = 0;
        do {
            System.JSONToken curr = parser.getCurrentToken();
            if (curr == System.JSONToken.START_OBJECT || 
                curr == System.JSONToken.START_ARRAY) {
                depth++;
            } else if (curr == System.JSONToken.END_OBJECT ||
                curr == System.JSONToken.END_ARRAY) {
                depth--;
            }
        } while (depth > 0 && parser.nextToken() != null);
    }
    
    private static List<Probabilities> arrayOfProbabilities(System.JSONParser p) {
        List<Probabilities> res = new List<Probabilities>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Probabilities(p));
        }
        return res;
    }
}