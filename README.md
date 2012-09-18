[![build status](https://secure.travis-ci.org/uscwebservices/usc-js.png)](http://travis-ci.org/uscwebservices/usc-js)
usc-js
=======

_usc.js_ provides the USC JavaScript object for integration with public API and useful utility functions.

# Examples

## NodeJS

usc-js will work as a NodeJS module.

```JavaScript
    var USC = require("usc").USC;
    
    // Should output today's date in a YYYY-MM-DD format
    console.log(USC.sqlDate(new Date()));
    
    // Should output next year's date in YYYY-MM-DD format
    console.log(USC.sqlDate("+1 year"));
    
    // If you need a full YYYY-MM-DD HH:MM:SS
    console.log(USC.sqlDateTime(new Date()));

    // If you need a full YYYY-MM-DD HH:MM:SS with +1 Hour
    console.log(USC.sqlDateTime("+1 year", false, new Date()));
```

## In a web page

You include the _usc.js_ file in then it should be available to use as the USC object.

```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>USC JavaScript object Demo</title>
        <script rel="JavaScript" type="JavaScript" src="usc.js"></script>
    </head>
    <body>
        <script>
            document.write("Should output today's date in a YYYY-MM-DD format.<br />");
            document.write(USC.sqlDate(new Date()));
            
            document.write("Plus one year.<br />");
            document.write(USC.sqlDate("+1 year"));
        </script>
    </body>
    </html>
```



