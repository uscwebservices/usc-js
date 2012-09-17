usc-js
=======

usc-js is a library of useful functions smoothing the access to USC Web Services APIs.

# Examples

## NodeJS

usc-js will work as a NodeJS module.

```JavaScript
    var USC = require("usc").USC;
    
    // Should output today's date in a YYYY-MM-DD format
    console.log(USC.toYYYYMMDD(new Date()));
    
    // Should output next year's date in YYYY-MM-DD format
    console.log(USC.toYYYYMMDD("+1 year");
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
            document.write(USC.toYYYYMMDD(new Date()));
            
            document.write("Plus one year.<br />");
            document.write(USC.toYYYYMMDD("+1 year"));
        </script>
    </body>
    </html>
```

