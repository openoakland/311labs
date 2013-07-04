var $ = window.jQuery = require('jquery')
var Backbone = require('backbone')
require('bootstrap-sass')

// register site wide events
$('#submit-email-city-note').on('click', _handleUserContactInfoClickEvent)
$('#submit-email').on('click', _handleUserContactInfoClickEvent)
$('#confirm-submission').on('click', _clearFields)

// set active page in nav
var bodyid = $('body').attr('id').replace(/[^A-Za-z0-9]/g, '')
$("ul.nav li." + bodyid).addClass("selected")

// on experiments page
if ($('body#experiments').length > 0) {
  $('.experimentsnav li').on('click', _handleExperimentNavigationClickEvent)
  var experimentName = String(window.location.hash).slice(2)
  if (experimentName.length > 0) {
    $("div.screenshots div.experiments").hide()
    $("div.screenshots div#experiment-" + experimentName).show()
    $("ul.experimentsnav li").removeClass("selected")
    $("ul.experimentsnav li#expnav-" + experimentName).addClass("selected")
  }
}

// Utilities for saving form data.
var emailAddress = null
var city = null
var note = null

function _captureUserContactInfo(data) {
  // guard / validation
  if(data.type === "submit-email-city-note" || data.type === "submit-email-city") { 
    // form says that required values are not valid; eject
    if (!data.emailAddress[0].validity.valid || !data.city[0].validity.valid)
      return;
    
  }
  if(data.type === "submit-email") { 
    // form says that required value is not valid; eject
    if (!data.emailAddress[0].validity.valid) 
      return;
  }

  // we are good; create indication of interest model and save
  var d = new Date();
  var ioi = new IndicationOfInterest({
    "emailAddress": data.emailAddress.val(),
    "city": data.city.val(),
    "note": data.note.val(),
    "type": data.type,
    "time": d.toUTCString()
  }).save();
  
  // show modal
  $("#contact-modal").modal('toggle');
}

function _handleUserContactInfoClickEvent(e) {
  // get data elements from submitting form
  emailAddress = $('#emailAddress', e.target.form);
  city = $('#city', e.target.form);
  note = $('#note', e.target.form);

  // package data elements and pass to capture
  var data = {
    "type": e.currentTarget.id,
    "emailAddress": emailAddress,
    "city": city,
    "note": note
  };
  _captureUserContactInfo(data);
}

function _clearFields(e) {
  // clear form fields
  $(emailAddress).val('')
  $(city).val('')
  $(note).val('')
}

function _handleExperimentNavigationClickEvent(e){
  var id = $(e.target).attr("id").split("-")[1]
  $("div.screenshots div.experiments:visible").fadeOut("slow", function() {
      $("#experiment-"+id).fadeIn()
  })
  $("ul.experimentsnav li").removeClass("selected")
  $(e.target).addClass("selected")
  window.location.hash = '#/' + id
}

// Model to hold names, emails, cities of interested party.
IndicationOfInterest = Backbone.Model.extend({
  // override to package attributes in a document for MongoHA
  toJSON: function() {
    return {"document": this.attributes};
  },

  // override to specify post URL for this object
  sync: function(method, model, options) {
    options.url = "https://api.mongohq.com/databases/chicago/collections/interest/documents?_apikey=i0h95kvp3dyx14hvw9bl";
    return Backbone.sync(method, model, options);
  }
});
