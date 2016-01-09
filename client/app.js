Template.bbody.helpers({
  admin: function () {
    return Meteor.user().admin;
  }
});
Template.adder.events({
  'submit form': function (e) {
    e.preventDefault();

    Meteor.call('url-shortener/shorten',
                $('#url').val(),
                $('#path').val()
    );
    
    return false;
  }
});

Template.list.helpers({
  stuff: function () {
    return coll.find();
  }
});

Template.validator.events({
  'submit form': function (e) {
    e.preventDefault();

    Meteor.call('i-am-admin',
                $('#secret').val()
    );

    return false;
  }
});

Template.header.helpers({
  loginError: function () {
    return Session.get('login-errors') ? 'error' : '';
  }
});

Template.header.events({
  'click .action-sign-out': function (e) {
    Meteor.logout();
    return false;
  },
  'click .login-form .button.login-button': function (e) {
    login();
    return false;
  },
  'click .login-form .button.signup-button': function (e) {
    signup();
    return false;
  },
  'submit .login-form': function (e) {
    login();
    return false;
  },
  'keydown .login-form input': function (e) {
    if (e.keyCode == 13) {
      Template.instance().$('form').submit();
      return false;
    }
  }
});


function signup() {
  Accounts.createUser({
    email: $('.login-form input.login').val(),
    password: $('.login-form input.password').val()
  }, function (err) {
    if (err)
      Session.set('login-errors', true);
  });
}

function login() {
  Meteor.loginWithPassword(
    $('.login-form input.login').val(),
    $('.login-form input.password').val(),
    function (err) {
      if (err)
        Session.set('login-errors', true);
    }
  );
}

var coll = new Mongo.Collection('shortUrls');
Meteor.startup(function() {
  Meteor.subscribe('urls');
  Meteor.subscribe('my-user');
});


Router.route('/', function () {
  this.render('bbody', {
    data: function () {}
  });
});

