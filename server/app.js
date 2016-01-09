var ADMIN_PASSWORD = 'superduperpassword';

var coll = new Mongo.Collection('shortUrls');

Meteor.startup(function() {
  coll._ensureIndex({path: 1});
});

Meteor.publish('urls', function () {
  if (this.userId)
    return coll.find();
  return [];
});

Meteor.publish('my-user', function () {
  if (this.userId)
    return Meteor.users.find({_id: this.userId}, {fields: {emails: 1, admin: 1}});
  return [];
});


Meteor.methods({
  // creates a short url from the given path
  'url-shortener/shorten': function(path, id) {

    var doc = coll.findOne({_id: id});

    if (doc) {
      coll.update({_id: id}, {$set:{path: path}});
    } else {
      doc = {
        path: path,
        createdAt: new Date
      };
      doc._id = id;
      id = coll.insert(doc);
    }
  },

  'i-am-admin': function (secret) {
    if (secret === ADMIN_PASSWORD && this.userId)
      Meteor.users.update(this.userId, {$set:{admin: true}});
  }
});

Router.map(function() {
  this.route('urlShortener', {
    where: 'server',
    path: '/:id',
    action: function() {
      //XXX: check host headers if we want to make sure user is requesting
      //the short url
      
      var query;
      query = {_id: this.params.id};

      var url = coll.findOne(query);

      //XXX: Do we want to 404 or fail differently here?
      if (url) {
        this.response.writeHead(301, {Location: url.path});
        this.response.end();
      } else {
        this.next();
      }
    }
  });
});
