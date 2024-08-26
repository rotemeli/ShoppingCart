using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Models;
using ShoppingCart.Services;

namespace ShoppingCart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartsController(CartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<Cart>> GetCart(string userId)
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);

            if (cart == null)
            {
                return NotFound();
            }

            return Ok(cart);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateCart(string userId, [FromBody] Cart cart)
        {
            if (cart == null || string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid cart data.");
            }

            var existingCart = await _cartService.GetCartByUserIdAsync(userId);

            if (existingCart == null)
            {
                cart.UserId = userId;
                await _cartService.CreateCartAsync(cart);
            }
            else
            {
                existingCart.Items = cart.Items;
                await _cartService.UpdateCartAsync(existingCart);
            }

            return NoContent();
        }
    }
}
