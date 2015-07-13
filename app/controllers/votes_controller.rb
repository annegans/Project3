class VotesController < ApplicationController
  
  def create 
    user_id = current_user
    Vote.create(post_id: params['vote']['post_id'], user: current_user)
    @votes = Vote.where(post_id: params['vote']['post_id'])
    respond_to do |format|
      format.html
      format.json { render :json => @votes.count }
    end
  end

end
