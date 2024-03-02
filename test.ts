
const schema :any = {
    "type": "object",
    "x-documentConfig": {
        "documentName": "user",
        "interfaceName": "User"
    },
    "properties": {
        "created":{
            "type": "number",
            "x-onCreateValue": "unixtime"
        },
        "update":{
            "type": "number",
            "x-onUpdateValue": "unixtime"
        },
        "_id": {
            "type": "string",
            "format": "uuid",
            "index": true
        },
        "name": {
            "type": "string",
            "maxLength": 64,
            "index": true,
            "required": true
        },
        "userContact":{
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "contactType": {
                        "type": "string",
                        "enum": [
                            "Option1",
                            "Option2",
                            "Option3"
                        ],
                        "required": true
                    },
                    "value": {
                        "type": "string",
                        "required": true
                    }
                }
            }
        },
        "userAddress": {
            "type": "object",
            "required": true,
            "properties": {
                "line1": {
                    "type": "string",
                    "required": false
                },
                "line2": {
                    "type": "string",
                    "required": false
                },
                "city": {
                    "type": "string",
                    "required": true
                },
                "state": {
                    "type": "string",
                    "required": true
                },
                "country": {
                    "type": "string",
                    "enum": [
                        "Option1",
                        "Option2",
                        "Option3"
                    ],
                    "required": true
                },
                "zip": {
                    "type": "string",
                    "required": true
                },
                "created":{
                    "type": "number",
                    "x-onCreateValue": "unixtime"
                },
                "update":{
                    "type": "number",
                    "x-onUpdateValue": "unixtime"
                },
            }
        },
        "isActive": {
            "type": "boolean",
            "required": true
        }    
    }
};

function hookTemplate(SchemaName: string, onCreateValue: { [key: string]: string }, onUpdate: { [key: string]: string }) {
    let createHandlerTemplate = "";
    let updateHandlerTemplate = "";
     
    Object.keys(onCreateValue).forEach((key: string) => {
        createHandlerTemplate += `this.${key} = ${onCreateValue[key]};\n`;
    });

    Object.keys(onUpdate).forEach((key: string) => {
        updateHandlerTemplate += `this.${key} = ${onUpdate[key]};\n`;
    });

    return `${SchemaName}.pre('save', function(next) {
    if (this.isNew) {
        ${createHandlerTemplate}
    } else {
        ${updateHandlerTemplate}
    }
    next();
});
`
};

function hookEnum(type:string){
    console.log('>>> >>> hookEnum',type)
    switch(type.toLocaleLowerCase()){
        case "unix":
        case "unixtime":
        case "unix-time":
            return "new Date().getTime()";
            break;
        default:
            return type;
            break;
    };
}

function makeHook(fieldName: string|undefined, schemaItem: any, idx: number) {
    const result : {
        onCreate : { [key: string]: string },
        onUpdate: { [key: string]: string }
    } = {
        onCreate: {},
        onUpdate: {}
    };

    console.log(`>>> ${idx}`,fieldName)

    let props = schemaItem.type === "object" ? schemaItem.properties : schemaItem.items?.type === "object" ? schemaItem.items.properties : schemaItem;
    // if SchemaItem.type array or object, then run recursively
    if (schemaItem.type === "object" || schemaItem.items?.type === "object") {
        Object.keys(props).forEach((key:any) => {
            const val = props[key];
            const subObj = makeHook(key, val, idx+1);

            // merge subObj into result with object key prefix by "key"
            Object.keys(subObj.onCreate).forEach((subKey: string) => {
                const nestedFieldsName = [fieldName, subKey].filter((x)=>x).join(".");
                result.onCreate[nestedFieldsName] = subObj.onCreate[subKey];
            });
            Object.keys(subObj.onUpdate).forEach((subKey: string) => {
                const nestedFieldsName = [fieldName, subKey].filter((x)=>x).join(".");
                result.onUpdate[nestedFieldsName] = subObj.onUpdate[subKey];
            });

        });
    }
    else if (fieldName){
        if (schemaItem["x-onCreateValue"]) {
            result.onCreate[fieldName] = hookEnum(schemaItem["x-onCreateValue"]);
        }
        if (schemaItem["x-onUpdateValue"]) {
            result.onUpdate[fieldName] = hookEnum(schemaItem["x-onUpdateValue"]);
        }
    }
    
    return result;

}