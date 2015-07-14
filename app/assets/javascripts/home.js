console.log('home.js');
// function populatePage(){
//   console.log('populate')
//   $.ajax({
//     type: 'get',
//     url: '/',
//     data: {  
//       format: 'json',
//     }
//   }).done(function(data){
//    console.log(data)
//    $(data).each(function(index, item){
//     var post = item.posts
//       $(post).each(function(index,item){
//           $('.post-title-js').append("<p>" + item.title + "</p>");
//           $('.post-title-js').append("<button class='.add-comment-js'>Add comment</button>" )
//      })
//    }) 
//   })
// }

function searchForm(){
 $('.search-form').css({
   'display': 'block'
 })
}

function commentForm(){
 var form = $(this).parent().find('.comment-form');
 form.css({
  'display': 'block'
  })
}

function createComment(e){
  e.preventDefault(); 

  title = $('#comment_title', $(this)).val();
  text = $('#comment_text', $(this)).val();
  var postId =  $(this).closest('.post').data('id')
  console.log('createComment');
   $.ajax({
    method: 'post',
    url: '/comments',
    dataType: 'json',
    data: {
      comment:{title: title, text: text, post_id: postId}
    }
   }).done(function(data){
    console.log(data, 'comment')
   $('[data-id=' + data.post_id + ']').find('.ajax-comments').append('<p>' + title + '</p>' )
   })
}


function newLike(e){
  e.preventDefault(); 
  var postId2 = $(this).closest('.post').data('id')
  _this = $(this)
  $.ajax({
     method: 'post',
     url: '/votes',
     dataType: 'json',
     data: {
     vote:{post_id: postId2}
    }
  }).done(function(data){
    //data is the count
    // updateView(data);
    console.log(data)

    _this.prev().find('.like-count-js').html(data);

  })
}

function updateView(count){
  console.log(count)
  $('.like-count-js').html(count);
}

function deletePost(e){
  e.preventDefault()
  var postId =  $(this).data('id');
  console.log(postId);
  //Storing a reference to the delete button because the context of this changes
  _post = $(this);
  $.ajax({
    dataType: 'json',
    method: 'delete',
    url: '/posts/' + postId
  }).done(function(data){
    //Remove the post from the page;
    _post.closest('.your-posts').remove()
  })
}


$(function(){
  console.log('ddsa')
  $('.new-comment-js').on('click', commentForm);
  $('.fa-search').on('click', searchForm)
  $('.post').on('submit', '.new_comment', createComment)
  $('.like-js').on('click', newLike);
  $('body').on('click', '.delete-post', deletePost)
})

///going home when click on logo
// $('.logo').on('click', window.location.href ="/")






