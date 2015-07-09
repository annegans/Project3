class UsersController < ApplicationController
  def account
    return redirect_to root_path unless current_user 
    @posts = Post.where(user_id: current_user.id)
    @post = Post.new
    @image = Image.new
  end
end
