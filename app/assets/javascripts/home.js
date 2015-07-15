//search form
function searchForm(){
 $('.search-form').css({
   'display': 'block'
 })
}

//coment form 
function commentForm(){
 var form = $(this).parent().find('.comment-form');
 form.css({
  'display': 'block'
  })
}

// create comment homepage 
// function createComment(e){
//   e.preventDefault(); 
//   title = $('#comment_title', $(this)).val();
//   text = $('#comment_text', $(this)).val();
//   var postId =  $(this).closest('.post').data('id')
//   console.log('createComment');
//    $.ajax({
//     method: 'post',
//     url: '/comments',
//     dataType: 'json',
//     data: {
//       comment:{title: title, text: text, post_id: postId}
//     }
//    }).done(function(data){
//     $('[data-id=' + data.post_id + ']').find('.ajax-comments').append('<p>' + title + '</p>' )
//    })
// }

function createComment(e){
  e.preventDefault(); 
  title = $('#comment_title', $(this)).val();
  text = $('#comment_text', $(this)).val();
  var urlSplit = window.location.pathname.split('/')
  var id = Number(urlSplit[2])

  console.log('createComment');
   $.ajax({
    method: 'post',
    url: '/comments',
    dataType: 'json',
    data: {
      comment:{title: title, text: text, post_id: id}
    }
   }).done(function(data){
    $('[data-id=' + data.post_id + ']').find('.ajax-comments').append('<p>' + title + '</p>' )
   })
}


//create new like
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
    console.log(data)
    // _this.prev().find('.like-count-js').html(data);
    _this.prev().prev().prev().find('.like-count-js').html(data);
  })
  .fail(function(err) {
    console.log(err)
  })
}


// function updateView(count){
//   console.log(count)
//   $('.like-count-js').html(count);
// }

//delete post
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


//eventlisteners
$(function(){
  console.log('ddsa')
  $('.new-comment-js').on('click', commentForm);
  $('.fa-search').on('click', searchForm)
  $('.post').on('submit', '.new_comment', createComment)

  $('.like-js').on('click', newLike);
  $('body').on('click', '.delete-post', deletePost)

  //order
  $('.order').on('click', function(){
    $.ajax("/home/sort_by")
  })


  // Dropdown toggle
$('.dropdown-toggle').click(function(){
  $(this).next('.dropdown').toggle();
});

$(document).click(function(e) {
  var target = e.target;
  if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
    $('.dropdown').hide();
  }
});
})









