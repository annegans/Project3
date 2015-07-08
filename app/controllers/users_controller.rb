class UsersController < ApplicationController
  def account
    @posts = Post.where(user_id: current_user.id)
  end
end
