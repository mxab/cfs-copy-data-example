var STORE2 = false;
var transformWrite = function (fileObj, readStream, writeStream) {
  gm(readStream, fileObj.name()).resize('128', '128').stream().pipe(writeStream);
};
var stores = [
  new FS.Store.FileSystem("store1", {
    path: "~/uploads/store1",
    transformWrite: transformWrite
  })
];
if (STORE2) {
  stores.push(new FS.Store.FileSystem("store2", {
    path: "~/uploads/store2",
    transformWrite: transformWrite
  }))
}

var Images = new FS.Collection("images", {
  stores: stores
});

if (Meteor.isClient) {

  Template.gallery.helpers({
    store2: function () {
      return STORE2;
    },
    images: function () {
      return Images.find();
    }
  });

  Template.gallery.events({
    'change input[type=file]': FS.EventHandlers.insertFiles(Images),
    "click .js-copy": function () {
      if (!STORE2) {
        alert("enable STORE2 flag")
      } else {
        Meteor.call("copy");
      }

    }
  });
}
if (Meteor.isServer) {
  Meteor.methods({
    "copy": function () {
      console.log("copy file");
      Images.find().forEach(function (fileObj) {
        fileObj.copyData("store1", "store2");
      })
    }
  })
}
