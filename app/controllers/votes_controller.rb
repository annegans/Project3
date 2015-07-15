class VotesController < ApplicationController
  
  def create 
    user_id = current_user
    Vote.create(post_id: params['vote']['post_id'], user: current_user)
    @votes = Vote.where(post_id: params['vote']['post_id'])
    respond_to do |format|
      format.html
      format.json { render :json => @votes.count }
    end
    # vote = Vote.last
    # vote.post.votes_count ++ 1
  end

end
