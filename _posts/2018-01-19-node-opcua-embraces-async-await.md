---
layout: post
title: "node-opcua 0.2.0 will make it easier than ever to write OPCUA Client code"
date:   2018-01-22 12:00:00  +0100
comments: true
categories: tutorial
author: Etienne
---

![image](/images/demo1_typescript_async.png){:class="img-responsive"}


Since node-opcua@0.2.0n it's possible to take advantage of the latest Javascript ES2017 feature such as [async/await]().

If you are using nodejs 8 or above, most of Javascript 2017 new features are natively supported, 
and writing a simple OPCUA client has never been so easy.
 
Let's have a look,

 ``` javascript
const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";

const opcua = require("node-opcua");
const AttributeIds = opcua.AttributeIds;
const OPCUAClient = opcua.OPCUAClient;

(async function main(){

    const client = new OPCUAClient({});
    await client.connect(endpointUrl);
    const session = await client.createSession({userName: "user1", password: "password1"});

    const dataValue = await session.read({nodeId: "ns=1;s=Temperature",attributeId: AttributeIds.Value});
    console.log(`Temperature is ${dataValue.value.value.toPrecision(3)}°C.`);

    await client.closeSession(session,true);
    await client.disconnect();

})();
```

This simple program establishes a connection to a remote OPCUA Server, opens a session with some credentials, 
reads a variable value out of one of the temperature sensor exposed by the OPCUA server, print out the value, and shutdown the connection properly.

This also work in TypeScript. 
Modern IDE such as Visual Studio Code or WebStorm provides intelisense support Typescript,
giving you a great user experience to explore the rich NodeOPCUA API and also statically check your code against
the API signature.

All you'll have to do is replace those 3 line:
```javascript
const opcua = require("node-opcua");
const AttributeIds = opcua.AttributeIds;
const OPCUAClient = opcua.OPCUAClient;
```
with:
```javascript
import {AttributeIds, OPCUAClient} from "node-opcua";
```

Async-await have been available since Javascript ES2017 and Node.js v8.0 or above. But, if you're application still 
relies on the old version of node 6.0 (or 7.0) you can still use the Promise version, in a less 
convenient but still practical way.

 ``` javascript
const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const opcua = require("node-opcua");
const AttributeIds = opcua.AttributeIds;
const OPCUAClient = opcua.OPCUAClient;

(function main(){

    const client = new OPCUAClient({});

    let the_session = null;
    client.connect(endpointUrl)
        .then(function() {
            return client.createSession({userName: "user1", password: "password1"});
        })
        .then(function(session){
            the_session = session;
            return session.read({
                nodeId: "ns=1;s=Temperature",
                attributeId: AttributeIds.Value
            });
        })
        .then(function(dataValue){
            console.log(`Temperature is ${dataValue.value.value.toPrecision(3)}°C.`);
        }).then(function() {
            return client.closeSession(the_session,true);
        }).then(function() {
            return client.disconnect();
        });
})(); 
```
 
However, if you're still using node 4.0, native support to Promise doesn't exist and you may have to 
use the old coding style , and avoid falling into callback hell by using the 'async' librairies:

``` javascript
const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";

var async = require("async");
var opcua = require("node-opcua");
var AttributeIds = opcua.AttributeIds;
var OPCUAClient = opcua.OPCUAClient;

(function main() {

    var client = new OPCUAClient({});
    var the_session = null;

    async.series([
            function (callback) {
                client.connect(endpointUrl, callback);
            },
            function (callback) {
                client.createSession({userName: "user1", password: "password1"},function (err, session) {
                    if (err) {
                        return callback(err);
                    }
                    the_session = session;
                    callback();
                });
            },
            function (callback) {
                return the_session.read({
                    nodeId: "ns=1;s=Temperature",
                    attributeId: AttributeIds.Value
                }, function (err, dataValue) {
                    if (err) {
                        return callback(err);
                    }
                    console.log("Temperature is ", dataValue.value.value.toPrecision(3), "°C.");
                    callback();
                });

            },
            function (callback) {
                client.closeSession(the_session, true, callback);
            },
            function (callback) {
                return client.disconnect(callback);
            }
        ],
        function (err) {
            if (err) {
                console.log("Err  !!! ", err);
            }
        });
})();
```

***So ! Which one do you prefer ? Isn't it time to switch to [nodejs 9](https://nodejs.org) ?**

[http://node.green/](http://node.green/) provides a nice way to compare different version of nodejs and their conformance to
 the various evolution of the Javascript language.
  
reference:
 * [mastering async-await in nodejs](https://blog.risingstack.com/mastering-async-await-in-nodejs)
 * [async await explained](https://tutorialzine.com/2017/07/javascript-async-await-explained)
