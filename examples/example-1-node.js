var USC = require("../usc").USC;

// Should output today's date in a YYYY-MM-DD format
console.log(USC.sqlDate(new Date()));

// Should output next year's date in YYYY-MM-DD format
console.log(USC.sqlDate("+1 year"));
