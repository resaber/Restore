using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController(StoreContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            try
            {
                var products = await context.Products.ToListAsync();
                return Ok(products); //回傳200和資料
            }
            catch (Exception ex)
            {
                return StatusCode(500, "伺服器錯誤，請稍後再試");
            }

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int? id)
        {
            if (id == null)
                return BadRequest("id不得為null");
            var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("沒有這筆Product資訊");
            return Ok(product);
        }
    }
}
