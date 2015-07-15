class CommentsController <ApplicationController
 def create 
 
  # home page create comment
  comment = Comment.create(title: params['comment']['title'], text:params['comment']['text'], post_id: params['comment']['post_id'], user: current_user)
  render :json => comment

  # show page create comment
  # comment = Comment.create(title: params['comment']['title'], text:params['comment']['text'], post_id: @post_id, user: current_user)
  #   render :json => comment
 end
end