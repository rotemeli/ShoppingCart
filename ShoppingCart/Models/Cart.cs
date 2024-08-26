using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ShoppingCart.Models
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("items")]
        public List<CartItem> Items { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {
        public string Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int Quantity { get; set; }
    }
}
