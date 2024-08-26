using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingCart.Models;

namespace ShoppingCart.Services
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IConfiguration config)
        {
            var client = new MongoClient(config.GetValue<string>("MongoDBSettings:ConnectionString"));
            _database = client.GetDatabase(config.GetValue<string>("MongoDBSettings:DatabaseName"));
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        public async Task CreateUserAsync(User user)
        {
            var collection = GetCollection<User>("users");
            await collection.InsertOneAsync(user);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            var collection = GetCollection<User>("users");
            return await collection.Find(new BsonDocument()).ToListAsync();
        }

        public async Task<User> GetUserAsync(string email)
        {
            var collection = GetCollection<User>("users");
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            return await collection.Find(filter).SingleOrDefaultAsync();
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            var collection = GetCollection<Product>("products");
            return await collection.Find(new BsonDocument()).ToListAsync();
        }
    }
}
