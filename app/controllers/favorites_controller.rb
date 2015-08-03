class FavoritesController <ApplicationController
 def index 
  @favorites = Favorite.where(user_id: current_user.id)
 end

 def create 
  favorite = Favorite.create(text: params['favorite']['text'], user: current_user)
  render :json => favorite
 end

 def destroy
  @favorite = Favorite.find(params[:id]).destroy

   respond_to do |format|
    format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
    format.json { head :no_content }
    end
 end
 
end


