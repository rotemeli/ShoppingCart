using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Models;
using ShoppingCart.Services;

namespace ShoppingCart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MongoDBContext _mongoDBContext;

        public UsersController(MongoDBContext mongoDBContext)
        {
            _mongoDBContext = mongoDBContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            var users = await _mongoDBContext.GetUsersAsync();
            return Ok(users);
        }
    }
}
