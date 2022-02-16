---
layout: post
title: "Node-Opcua 0.0.50 : ObjectType and Object instantiation"
date:   2015-12-5 12:00:00  +0100
comments: true
categories: tutorial
---

####  setting parent node when creating Object and Variable nodes.

When creating a object of variable node, you can now establish a reference
link with its parent node using the ```componentOf``` , ```propertyOf```, or
```organizedBy``` property of the ```options``` object.

{% highlight javascript %}

var addressSpace = server.engine.addressSpace.

var objectFolder = addressSpace.findObjectByName("ObjectFolder");
var myObject = addressSpace.addObject({
  organizedBy: objectFolder,
  browseName: "MyObject"
});

var myVar  = addressSpace.addVariale({
    componentOf: myObject,
    browseName: "Temperature",
    dataType: "Double",
    value: new opcua.Variant({ dataType: opcua.DataType.Double, value: 10.0});
});

{% endhighlight %}

### creating a new ObjectType

You can easily declare a new object type in your addressSpace. ObjectType are
useful to help clients of your server to detect easily if the address space of
the server contains objects of the given type.

{% highlight javascript %}
var temperatureSensorType = addressSpace.addObjectType({
  browseName: "TemperatureSensorType"
});
{% endhighlight %}
By default, newly created type are sub type of "BaseObjectType", unless you specify
a "subTypeOf" property in the ```options``` object. For instance, we
could derive a new ObjectType from our TemperatureSensorType.

{% highlight javascript %}
var specialTemperatureSensorType = addressSpace.addObjectType({
    browseName: "specialTemperatureSensorType",
    subTypeOf: temperatureSensorType
});
{% endhighlight %}

Note: the subTypeOf property could be given either a Node object,
a nodeId object, or even a string matching the browsename of the node you wish
to refer to.


### enriching an ObjectType with components and properties

ObjetType are useful to provide a description of what components or properties
are expected on object instance of this type.

For instance,  we could specify that objects of type TemperatureSensorType are expected
to have a mandatory "Temperature" component and a optional "IdentificationNumber" component.

The "Temperature" and "IdentificationNumber" variables will be linked with the main temperatureSensor instance
with an ```"HasComponent"``` reference.


We can specify ```modellingRule``` as ```"Mandatory"```, ```"Optional"``` , ```"PlaceHolderMandatory"```, ```"PlaceHolderOptional"```.
 If the ```modellingRule``` is missing, ```"Mandatory"``` is assumed.

{% highlight javascript %}
var temperatureSensorType = addressSpace.addObjectType({
  browseName: "TemperatureSensorType"
});

var temperature = addressSpace.addVariable({
  componentOf: temperateurSensorType,
  browseName: "Temperature",
  description: "the temperature value (in degree C) measured by the sensor",
  dataType: "Float",
  modellingRule: "Mandatory"
});

var idNumber = addressSpace.addVariable({
  componentOf: temperateurSensorType,
  browseName: "IdentificationNumber",
  description: "the identification number of the sensor (could be serial number of 1Wire ID)",
  dataType: "String",
  modellingRule: "Optional"
});
{% endhighlight %}


### instantiating an Object node from its ObjectType.

A instance of our TemperatureSensor Type can now be easily created.

{% highlight javascript %}

var temperatureSensor = temperatureSensorType.instantiate({
  browseName: "MyTemperatureSensor"
});

{% endhighlight %}


This newly created instance is already fitted with fresh instances of  the
mandatory components and propertiesthat are defined in the ObjectType.
The temperatureSensor node created above has
already a temperature component that can be set with a a value.

{% highlight javascript %}
  temperatureSensor.getComponentByName("Temperature").setValueFromSource({
    dataType: opcua.DataType.Double,
    value: 37.2
  });
{% endhighlight %}

Conveniently, NodeOPCUA has automatically added new members to the temperatureSensor
object so you can access OPCUA properties and components more easily.

The code above could be written this way:

{% highlight javascript %}
  temperatureSensor.temperature.setValueFromSource({
    dataType: opcua.DataType.Double,
    value: 37.2
  });
{% endhighlight %}

Note that the name of the javascript property doesn't match exactly the nameof the UA component of Property.
In javacript, we follow the camel case naming convention. For this reason, the "Temperature" component is
accessible throught the javascript "temperature" (starting with a lower case 't' ).

By default, ObjectType#instantiate only instantiate components and properties
that have a "Mandatory" modelling rule.
Component or property marked as optional in the ObjectType definition will be
instatiated if their browseName appear in the ```options.optional```  array.

{% highlight javascript %}

var temperatureSensor = temperatureSensorType.instantiate({
  browseName: "MyTemperatureSensor",
  optional: ["IdentificationNumber"]
});

temperatureSensor.identificationNumber.setValueFromSource({
  dataType: opcua.DataType.String,
  value: "SN#1234"
});

{% endhighlight %}
