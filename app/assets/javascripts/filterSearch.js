 console.log('filterSearch.js');

 $.ajax({
  url: 'http://localhost:3000/',
  dataType: 'json'
}).done(function(response) {
  console.log(response);
  // debugger;
  var FJS = FilterJS(response, '#post', {
    template: '.post-template',
    search: {ele: '.form-control', fields: ['post.title']}
  });
})