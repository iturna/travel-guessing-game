using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobetrotterAPI.Data;
using GlobetrotterAPI.Models;
using GlobetrotterAPI.Models.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace GlobetrotterAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GameController> _logger;
        private static readonly Random _random = new Random();

        public GameController(ApplicationDbContext context, ILogger<GameController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("random-destination")]
        public async Task<ActionResult<DestinationDTO>> GetRandomDestination()
        {
            try
            {
                // First check if we have any destinations
                if (!await _context.Destinations.AnyAsync())
                {
                    return NotFound("No destinations available");
                }

                // Get a random destination using a more reliable method
                var destination = await _context.Destinations
                    .Include(d => d.Clues)
                    .Include(d => d.FunFacts)
                    .Include(d => d.Trivia)
                    .OrderBy(r => EF.Functions.Random())  // Use EF.Functions.Random() instead of Skip
                    .FirstOrDefaultAsync();

                if (destination == null)
                {
                    return NotFound("Failed to get random destination");
                }

                // Get random cities for options (including correct answer)
                var otherCities = await _context.Destinations
                    .Where(d => d.Id != destination.Id)
                    .OrderBy(r => EF.Functions.Random())
                    .Take(3)
                    .Select(d => d.City)
                    .ToListAsync();

                var options = new List<string> { destination.City };
                options.AddRange(otherCities);
                options = options.OrderBy(r => Guid.NewGuid()).ToList();

                // Get 1-2 random clues
                var randomClueCount = _random.Next(1, 3); // Returns either 1 or 2
                var randomClues = destination.Clues
                    .OrderBy(r => Guid.NewGuid())
                    .Take(randomClueCount)
                    .Select(c => c.Text)
                    .ToList();

                // Log the response for debugging
                _logger.LogInformation($"Returning destination: {destination.City} with {destination.Clues.Count} clues");

                return Ok(new DestinationDTO
                {
                    Id = destination.Id,
                    City = destination.City,
                    Country = destination.Country,
                    Clues = randomClues,  // Now contains only 1-2 random clues
                    FunFacts = destination.FunFacts.Select(f => f.Text).ToList(),
                    Trivia = destination.Trivia.Select(t => t.Text).ToList(),
                    Options = options
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving random destination");
                return StatusCode(500, "Error retrieving destination. Please try again.");
            }
        }

        [HttpPost("check-answer")]
        public async Task<ActionResult<AnswerResponse>> CheckAnswer([FromBody] AnswerRequest request)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.FunFacts)
                    .FirstOrDefaultAsync(d => d.Id == request.DestinationId);

                if (destination == null)
                {
                    return NotFound("Destination not found");
                }

                var isCorrect = destination.City.Equals(request.Answer, StringComparison.OrdinalIgnoreCase);

                // Get a random fun fact
                var funFact = destination.FunFacts.Count > 0
                    ? destination.FunFacts[_random.Next(destination.FunFacts.Count)].Text
                    : "No fun fact available for this destination.";

                return Ok(new AnswerResponse
                {
                    IsCorrect = isCorrect,
                    FunFact = funFact,
                    TotalScore = isCorrect ? 1 : 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error checking answer");
            }
        }
    }
}