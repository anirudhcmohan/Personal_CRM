
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

$(document).ready(function() {
  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  };

  $('#name-typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    source: substringMatcher(full_names)
  });

  $('#company-typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    source: substringMatcher(companies)
  });

  $('#city-typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    source: substringMatcher(cities)
  });

  $('#date').val(new Date().toDateInputValue());
});