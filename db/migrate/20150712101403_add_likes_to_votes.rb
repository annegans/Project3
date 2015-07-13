class AddLikesToVotes < ActiveRecord::Migration
  def change
    add_column :votes, :likes, :integer
  end
end
