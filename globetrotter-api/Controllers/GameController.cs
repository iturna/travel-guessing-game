using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobetrotterAPI.Data;
using GlobetrotterAPI.Models;
using GlobetrotterAPI.Models.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

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
                var count = await _context.Destinations.CountAsync();
                var skip = _random.Next(count);
                
                var destination = await _context.Destinations
                    .Include(d => d.Clues)
                    .Include(d => d.Trivia)  // Include trivia data
                    .Skip(skip)
                    .FirstOrDefaultAsync();

                if (destination == null)
                    return NotFound();

                // Get other cities for options - fetch first, then randomize in memory
                var otherCities = await _context.Destinations
                    .Where(d => d.City != destination.City)
                    .Select(d => new { Id = d.Id, City = d.City })
                    .ToListAsync();

                // Randomly select 3 cities in memory
                var randomCities = otherCities
                    .OrderBy(_ => _random.Next())
                    .Take(3)
                    .Select(d => new CityOption { Id = d.Id, Name = d.City })
                    .ToList();

                // Add correct city to options
                var options = new List<CityOption> 
                { 
                    new CityOption { Id = destination.Id, Name = destination.City } 
                };
                options.AddRange(randomCities);
                
                // Shuffle options in memory
                options = options.OrderBy(_ => _random.Next()).ToList();

                return Ok(new DestinationDTO
                {
                    Id = destination.Id,
                    Clues = destination.Clues.Select(c => c.Text).ToList(),
                    Options = options,
                    Trivia = destination.Trivia.Select(t => t.Text).ToList()  // Add trivia to the response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching random destination");
                return StatusCode(500, "Error fetching destination");
            }
        }

        [HttpPost("check-answer")]
        public async Task<ActionResult<AnswerResponse>> CheckAnswer(AnswerRequest request)
        {
            try
            {
                // Validate the GUIDs
                if (request.DestinationId == Guid.Empty || request.AnswerId == Guid.Empty)
                {
                    return BadRequest("Invalid destination or answer ID");
                }

                var destination = await _context.Destinations
                    .Include(d => d.FunFacts)
                    .Include(d => d.Trivia)
                    .FirstOrDefaultAsync(d => d.Id == request.DestinationId);

                if (destination == null)
                    return NotFound("Destination not found");

                // Check if the answer ID matches the destination ID
                var isCorrect = request.AnswerId == destination.Id;

                // Get a random fun fact
                var funFact = destination.FunFacts.Count > 0
                    ? destination.FunFacts[_random.Next(destination.FunFacts.Count)].Text
                    : "No fun fact available for this destination.";

                // Get trivia items
                var trivia = destination.Trivia
                    .Select(t => t.Text)
                    .ToList();

                return Ok(new AnswerResponse
                {
                    IsCorrect = isCorrect,
                    FunFact = funFact,
                    Trivia = trivia,
                    CorrectCity = destination.City,
                    Country = destination.Country,
                    TotalScore = isCorrect ? 1 : 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking answer: {Message}", ex.Message);
                return StatusCode(500, "Error checking answer");
            }
        }
    }
}