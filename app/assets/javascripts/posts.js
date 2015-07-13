
// function getPosts(){
//     $.ajax({
//     type: 'get',
//     url: '/account',
//     data: {  
//       format: 'json',
//     }
//   }).done(function(data){
//    console.log(data, 'adfsad')
//    $(data).each(function(index, item){
//     var post = item.posts
//     console.log(post)
//       $(post).each(function(index,item){
//         console.log(item.title)
//         $('.p-post-title-js').html("<p>" + item.title + "</p>");
//      })
//    }) 
//   })
// }

// $(function(){
// getPosts()

// })

function deletePost(){
  var postId =  $(this).data('id');
  console.log(postId);
  debugger;
  $.ajax({
    method: 'delete',
    url: '/posts/' + postId
  }).done(function(){
    console.log('it worked')
  })
}


$(function(){
  $('.your-posts').on('click', "#button_to", deletePost)
})



