class FavoritesController <ApplicationController
 def index 
  @favorites = Favorite.where(user_id: current_user.id)
 end

 def create 
  favorite = Favorite.create(text: params['favorite']['text'], user: current_user)
  render :json => favorite
 end

end