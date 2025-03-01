using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobetrotterAPI.Data;
using GlobetrotterAPI.Models;
using GlobetrotterAPI.Models.DTOs;
using System;
using System.Threading.Tasks;

namespace GlobetrotterAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterRequest request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (existingUser != null)
                return BadRequest("Username already taken");

            // Generate a unique invite code
            var inviteCode = Guid.NewGuid().ToString("N").Substring(0, 8);

            var user = new User
            {
                Username = request.Username,
                CreatedAt = DateTime.UtcNow,
                InviteCode = inviteCode
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Score = 0,
                InviteCode = user.InviteCode
            });
        }

        [HttpGet("by-invite-code/{inviteCode}")]
        public async Task<ActionResult<UserDTO>> GetByInviteCode(string inviteCode)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.InviteCode == inviteCode);

            if (user == null)
                return NotFound("User not found");

            return Ok(new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Score = user.Score,
                InviteCode = user.InviteCode
            });
        }
    }
}