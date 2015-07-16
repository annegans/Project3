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
    $('[data-id=' + data.post_id + ']').append('<p>' + title + '</p>' )
  
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
    _this.prev().find('.like-count-js').html(data);
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
  // $('.new-comment-js').on('click', commentForm);
  $('.fa-search').on('click', searchForm)
  // $('.post').on('submit', '.new_comment', createComment)
  $('.new_comment').on('submit', createComment)


  $('.like-js').on('click', newLike);
  $('body').on('click', '.delete-post', deletePost)

  //ajax call for order
  // $('#user_nav').on('click', '.votes-order', function(e){
  //   e.preventDefault();
  //   var sortTag = $(this).text();

  //   $.ajax({
  //     dataType: 'json',
  //     method: 'get',
  //     url: '/home/sort_by?tag=' + sortTag
  //   }).done(function(data){
  //     $('.post1').empty()
  //     debugger;
  //     var htmlstring = value.title
  //   })
  // })


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

  ///random-color-js
  $(document).ready(function()
{
    $(".logo").hover(function(e)
    {
        var randomClass = getRandomClass();
        $(e.target).attr("class", randomClass);
    });
});

function getRandomClass()
{
    //Store available css classes
    var classes = new Array("green", "purple", "teal", "violet", "pink");
    
    //Give a random number from 0 to 5
    var randomNumber = Math.floor(Math.random()*6);
    
    return classes[randomNumber];
}


})