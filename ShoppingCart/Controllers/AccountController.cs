using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.DTOs;
using ShoppingCart.Models;
using ShoppingCart.Services;
using System.Security.Cryptography;
using System.Text;

namespace ShoppingCart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly MongoDBContext _mongoDBContext;

        public AccountController(MongoDBContext mongoDBService)
        {
            _mongoDBContext = mongoDBService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // Check if the passwords match
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if the email is already taken
            if (await UserExists(registerDto.Email))
            {
                return BadRequest("Email is already taken");
            }
            using var hmac = new HMACSHA512();

            // Create a new user
            var user = new User
            {
                Email = registerDto.Email.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            // Save the user to the database
            await _mongoDBContext.CreateUserAsync(user);
            return Ok(new UserDto {
                Id = user.Id,
                Email = user.Email
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _mongoDBContext.GetUserAsync(loginDto.Email.ToLower());

            // Check if the user exists
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // Compute the hash of the provided password using the stored password salt
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            // Compare the computed hash with the stored hash
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Invalid email or password");
                }
            }

            // Return the user's email in a UserDto
            return Ok(new UserDto {
                Id = user.Id,
                Email = user.Email
            });
        }

        private async Task<bool> UserExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            var user = await _mongoDBContext.GetUserAsync(email.ToLower());
            return user != null;
        }
    }
}
