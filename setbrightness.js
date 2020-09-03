#!/usr/bin/env node
var HID = require('node-hid');
fs = require('fs');

var devices = HID.devices();
device = new HID.HID(4292,33742); // same ID for both boards I got

// Board has 16 levels, the OS sees 21, so I remap the values and keep the 5 extra at max brightness. 
// Mappings might be off depending on the driver. Check values on /sys/class/backlight/*/actual_brightness.
// Was 0-100 by 5 intervals in my case. With the edp kernel patch it was 1-4439 with 222 increments.
var mapping = [['0', '0'], ['1', '16'],['2', '32'], 
['3', '48'], ['4', '64'], ['5', '80'], 
['6', '96'], ['7', '112'], ['8', '128'], 
['9', '144'], ['10', '160'], ['11', '176'], 
['12', '192'], ['13', '208'], ['14', '220'], 
['15', '255']];

var myMap = new Map(mapping);

// file path might change depending on the driver. 
fs.readFile('/sys/class/backlight/acpi_video0/actual_brightness', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.replace("\n", ''); // clear the newline
  data = myMap.get(data); // get corresponding value
  data = parseInt(data); 
  device.write([6, data]); // send to the usb device
//  console.log(data);
});
