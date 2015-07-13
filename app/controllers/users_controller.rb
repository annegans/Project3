class UsersController < ApplicationController
  def account
    return redirect_to root_path unless current_user 
    @posts = Post.where(user_id: current_user.id)
    @post = Post.new
    @image = Image.new
    @comments = Comment.where(user_id: current_user.id )

    # axax populate acountpage
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: {posts: @posts } }
    end
  end


end
