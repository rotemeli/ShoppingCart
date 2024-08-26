using MongoDB.Driver;
using ShoppingCart.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoppingCart.Services
{
    public class CartService
    {
        private readonly MongoDBContext _context;
        private readonly IMongoCollection<Cart> _cartCollection;

        public CartService(MongoDBContext context)
        {
            _context = context;
            _cartCollection = _context.GetCollection<Cart>("cart");
        }

        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            userId = userId.Trim();
            return await _cartCollection.Find(cart => cart.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task CreateCartAsync(Cart cart)
        {
            await _cartCollection.InsertOneAsync(cart);
        }

        public async Task UpdateCartAsync(Cart cart)
        {
            await _cartCollection.ReplaceOneAsync(c => c.Id == cart.Id, cart);
        }
    }
}
