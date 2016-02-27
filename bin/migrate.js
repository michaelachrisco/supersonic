exports.runMigrations = function() {

}

// Collect migration filenames
// Check database for existence of schema_migrations table
// Create if it doesn't exist
// Check migration timestamps, and only run migrations that are new
