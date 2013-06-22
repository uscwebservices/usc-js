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
    </head>
    <body>
        <h2>Demo the USC object</h2>
        <pre id="demo">
        </pre>
        <script rel="JavaScript" type="JavaScript" src="usc.js"></script>
        <script>
            var demo = document.querySelector("#demo"),
                output = [];

            output.push("Should output today's date in a YYYY-MM-DD format.<br />");
            output.push(USC.sqlDate(new Date()));
            
            output.push("Plus one year.<br />");
            output.push(USC.sqlDate("+1 year"));
            
            output.push("Calculating a URL by parts:" +
                USC.path.join("http://usc.edu", "ws", "eo3", "api", "help")
            );
            output.push("That should have read http://usc.edu/ws/eo3/api/help");

            demo.innerHTML = output.join("\n");
        </script>
    </body>
    </html>
```

# An alternative to USC object

The state of JavaScript modules and packaging are improving.  Perhaps all we need is a
httpGET function and a good template library that works both server and client side, e.g. Handlebars.

Here are two demos build using the *httpGET* function from the *usc.browser.js* along with Handlebars
that has been pulled in via [bower](http://bower.io) into a components directory.  In the next two demos we
get Calendar data and Wordpress feed data respectively using this approach. While the formatting is
primative it is only primative because of the simplifity of the template in the demo. If the template
were appropriately designed and CSS applied it would be in-line with our standards.

Demos

1. [Calendar data as simple UL](demo-1.html)
2. [Wordpress data as simple UL](demo-2.html)

* [Handlebars](http://handlebarsjs.com/) is a JavaScript templating library based on extending the syntax of Mustache templates. 
* [Bower](http://bower.io) a component package manager (e.g. for the web browser), support JavaScript, CSS and Assets





