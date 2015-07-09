class Post < ActiveRecord::Base
  belongs_to :user
  has_many :images
  has_many :comments
  has_many :votes
  has_many :post_tags
  has_many :tags, through: :post_tags
  accepts_nested_attributes_for :images, allow_destroy: true
end
