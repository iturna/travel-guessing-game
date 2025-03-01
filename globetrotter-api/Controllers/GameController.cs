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
                    .Skip(skip)
                    .FirstOrDefaultAsync();

                if (destination == null)
                    return NotFound();

                return Ok(new DestinationDTO
                {
                    Id = destination.Id,
                    Clues = destination.Clues.Select(c => c.Text).ToList(),
                    Options = await GetRandomCityOptions(destination.City)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching random destination");
                return StatusCode(500, "Error fetching destination");
            }
        }

        [HttpPost("check-answer")]
        public async Task<ActionResult<Models.DTOs.AnswerResponse>> CheckAnswer(Models.DTOs.AnswerRequest request)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.FunFacts)
                    .FirstOrDefaultAsync(d => d.Id == request.DestinationId);

                if (destination == null)
                    return NotFound("Destination not found");

                var isCorrect = destination.City.Equals(request.Answer, StringComparison.OrdinalIgnoreCase);

                // Get a random fun fact
                var funFact = destination.FunFacts.Count > 0
                    ? destination.FunFacts[_random.Next(destination.FunFacts.Count)].Text
                    : "No fun fact available for this destination.";

                return Ok(new Models.DTOs.AnswerResponse
                {
                    IsCorrect = isCorrect,
                    FunFact = funFact,
                    TotalScore = isCorrect ? 1 : 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking answer");
                return StatusCode(500, "Error checking answer");
            }
        }

        private async Task<List<string>> GetRandomCityOptions(string correctCity)
        {
            try
            {
                // Get 3 random cities excluding the correct one
                var otherCities = await _context.Destinations
                    .Where(d => d.City != correctCity)
                    .OrderBy(r => Guid.NewGuid()) // Random ordering
                    .Take(3)
                    .Select(d => d.City)
                    .ToListAsync();

                // Add the correct city and shuffle all options
                var options = new List<string> { correctCity };
                options.AddRange(otherCities);
                
                // Shuffle the options
                return options.OrderBy(x => Guid.NewGuid()).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting random city options");
                throw;
            }
        }
    }
}