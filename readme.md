# JsonSchema to Mongoose Model Generator

This tool allows you to generate Mongoose models from JSON schemas.

## Installation

Install the package globally using npm:

```bash
npm install json2mongoose -g
```

## Usage
### Command Line Interface (CLI)
To use the tool from the command line, run the following command:
```bash
`json2mongoose` ./schema ./output
```

### Node
You can also use the tool programmatically in your Node.js scripts:
```javascript
import json2mongoose from "json2mongoose"

const schemaDir = "path/to/jsonSchema";
const modelDir = "path/to/model";
const typeDir = "path/to/types";

json2mongoose.genarate(schemaDir: string, modelDir: string, typeDir: string);
```

Please replace the paths with the actual paths to your JSON schemas and output directory.

## Note
The generated file is named based on the schema file's name.  
the `x-documentConfig.documentName` will only effect on mongoose api.  
ex: docuemt interface, schema, model.  

if you don't wish to drop your hair after some bug came out,  
match the schema file name with document name.
## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.