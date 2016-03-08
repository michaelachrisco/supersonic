var fs = require('fs');
var dot = require('dot');
var chalk = require('chalk');
var BaseModel = require('../build/model/base_model').default;

Date.prototype.timestamp = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  var hh = this.getHours().toString();
  var mins = this.getMinutes().toString();
  var ss = this.getSeconds().toString();
  return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + hh + mins + ss; // padding
};

exports.call = function(args) {
  var type = args[1];

  switch(type) {
    case 'model':
      generateModel(args);
      break;
    case 'migration':
      generateMigration(args)
  }
}

function generateMigration(args) {
  dot.templateSettings.strip = false;
  dot.templateSettings.varname = 'data';

  var now = new Date();

  // Create the migration file
  //
  fs.writeFileSync(
    './db/migrate/' + now.timestamp() + '_' + args[2].underscore() + '.js',
    dot.template(
      fs.readFileSync(__dirname + '/templates/basic_migration.js.jst').toString()
    )({ migrationName: args[2].underscore() })
  );

  console.info(chalk.green(`Created db/migrate/${now.timestamp()}_${args[2].underscore()}.js`))
}

function generateModel(args) {
  // Create the model file
  // Iterate through the arguments and generate a migration file

  dot.templateSettings.strip = false;
  dot.templateSettings.varname = 'data';

  var modelName = args[2];
  var columns = args.slice(3);
  var structure = { tableName: modelName.underscore().pluralize };
  var now = new Date();
  var graphQLType = BaseModel.buildGraphQLType(columns, modelName)
  var fileName = modelName.singularize().underscore()
  var className = modelName.classify()

  // Create the model file
  fs.writeFileSync(`./app/models/${fileName}.js`, dot.template(
    fs.readFileSync(__dirname + '/templates/model.js.jst').toString()
  )({ modelName, graphQLType }));

  console.info(chalk.green(`Created app/models/${fileName}.js`))

  // Add the new model to the models export
  fs.appendFileSync('./app/models/index.js', `export ${className} from './${fileName}'\n`)

  // Create the mutations
  //
  // Create the mutations directory
  //
  var dirName = `./app/schema/mutations/${fileName}`
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
  //
  // Create mutation
  //
  fs.writeFileSync(`${dirName}/create_${fileName}_mutation.js`, dot.template(
    fs.readFileSync(__dirname + '/templates/mutations/create_mutation.js.jst').toString()
  )({ modelName }));
  console.info(chalk.green(`Created app/schema/mutations/${fileName}/create_${fileName}_mutation.js`))
  //
  // Update mutation
  //
  fs.writeFileSync(`${dirName}/update_${fileName}_mutation.js`, dot.template(
    fs.readFileSync(__dirname + '/templates/mutations/update_mutation.js.jst').toString()
  )({ modelName }));
  console.info(chalk.green(`Created app/schema/mutations/${fileName}/update_${fileName}_mutation.js`))
  //
  // Destroy mutation
  //
  fs.writeFileSync(`${dirName}/destroy_${fileName}_mutation.js`, dot.template(
    fs.readFileSync(__dirname + '/templates/mutations/destroy_mutation.js.jst').toString()
  )({ modelName }));
  console.info(chalk.green(`Created app/schema/mutations/${fileName}/destroy_${fileName}_mutation.js`))
  //
  // Create the index file and export the mutations
  //
  fs.writeFileSync(`${dirName}/index.js`, dot.template(
    fs.readFileSync(__dirname + '/templates/mutations/index.js.jst').toString()
  )({ modelName }));
  console.info(chalk.green(`Created app/schema/mutations/${fileName}/index.js`))
  //
  // Add the mutations to the exports
  //
  fs.appendFileSync('./app/schema/mutations/index.js', `\nexport * as ${fileName} from './${fileName}'`)
  //
  // Add the server side mutations to the root mutation
  //
  var newLines = `    // ${modelName.singularize().capitalize()} Mutations\n    create${className}: models.${className}.createMutation(),\n    update${className}: models.${className}.updateMutation(),\n    destroy${className}: models.${className}.destroyMutation(),`
  var mutationFile = fs.readFileSync('./app/schema/mutations.js', 'utf8')
  var mutatedFile = mutationFile.split(/\n/)
  mutatedFile.splice(-5, 0, newLines)
  mutatedFile = mutatedFile.join('\n')
  fs.writeFileSync('./app/schema/mutations.js', mutatedFile, 'utf8')
  //
  // Create the migration
  columns.forEach(column => {
    var name = column.split(":")[0];
    var type = column.split(":")[1];
    structure[name] = type;
  });

  fs.writeFileSync(
    './db/migrate/' + now.timestamp() + '_create_' + modelName.underscore() + '.js',
    dot.template(
      fs.readFileSync(__dirname + '/templates/create_migration.js.jst').toString()
    )({ structure: structure, migrationName: 'create_' + modelName.underscore() })
  );

  console.info(chalk.green(`Created db/migrate/${now.timestamp()}_create_${modelName.underscore()}.js`))
}


