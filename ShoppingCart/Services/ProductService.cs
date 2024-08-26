using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingCart.Models;

namespace ShoppingCart.Services
{
    public class ProductService
    {
        private readonly MongoDBContext _context;
        private readonly IMongoCollection<Product> _products;

        public ProductService(MongoDBContext context)
        {
            _context = context;
            _products = _context.GetCollection<Product>("products");
        }

        public async Task CreateProductAsync(Product product)
        {
            await _products.InsertOneAsync(product);
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _products.Find(p => p.ProductId == id).FirstOrDefaultAsync();
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _products.Find(new BsonDocument()).ToListAsync();
        }
    }
}
