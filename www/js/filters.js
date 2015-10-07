angular.module('lookin4.filters', [])

.filter('toDateString', function(){
  return function(input) {
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var date = (new Date(input))
    return month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  }
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('nl2br',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
);
