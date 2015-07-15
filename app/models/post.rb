class Post < ActiveRecord::Base
  belongs_to :user
  has_many :images
  has_many :comments
  has_many :votes
  has_many :post_tags
  has_many :tags, through: :post_tags
  accepts_nested_attributes_for :images, allow_destroy: true
  scope :recent, -> { order(created_at: :desc) }
  scope :title,    -> { order(title: :desc) }
  scope :oldest, -> { order(created_at: :asc) }
  scope :votes, -> { order("votes_count desc")}
   

  def self.sort_by(sort_param)
  if %w(recent title votes oldest).include? sort_param
    send sort_param
  else
    all
   end
 end



 def self.search(search)
  where("title ILIKE ?", "%#{search}%") 
  end
end

