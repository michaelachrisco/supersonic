var fs = require('fs');
var dot = require('dot');
var chalk = require('chalk');

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
  }
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

  // Create the model file
  fs.writeFileSync('./app/models/' + modelName.singularize() + '.js', dot.template(
    fs.readFileSync(__dirname + '/templates/model.js.jst').toString()
  )({ modelName: modelName }));

  console.info(chalk.green(`Created app/models/${modelName.pluralize}.js`))

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


