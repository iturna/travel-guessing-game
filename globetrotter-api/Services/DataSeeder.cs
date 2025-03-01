using GlobetrotterAPI.Data;
using GlobetrotterAPI.Models;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace GlobetrotterAPI.Services
{
    public class DataSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(ApplicationDbContext context, ILogger<DataSeeder> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedData()
        {
            try
            {
                if (!_context.Destinations.Any())
                {
                    _logger.LogInformation("Starting data seeding...");
                    
                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Resources", "data.json");
                    _logger.LogInformation($"Reading data from: {filePath}");
                    
                    if (!File.Exists(filePath))
                    {
                        _logger.LogError($"Data file not found at: {filePath}");
                        return;
                    }

                    var jsonData = await File.ReadAllTextAsync(filePath);
                    var destinations = JsonSerializer.Deserialize<List<DestinationJson>>(jsonData);
                    _logger.LogInformation($"Deserialized {destinations?.Count ?? 0} destinations");

                    if (destinations != null)
                    {
                        foreach (var destData in destinations)
                        {
                            var destination = new Destination
                            {
                                City = destData.City,
                                Country = destData.Country
                            };

                            destination.Clues = destData.Clues.Select(c => new Clue 
                            { 
                                Text = c,
                                Destination = destination 
                            }).ToList();

                            destination.FunFacts = destData.FunFact.Select(f => new FunFact 
                            { 
                                Text = f,
                                Destination = destination 
                            }).ToList();

                            destination.Trivia = destData.Trivia.Select(t => new Trivia 
                            { 
                                Text = t,
                                Destination = destination 
                            }).ToList();

                            _context.Destinations.Add(destination);
                        }

                        await _context.SaveChangesAsync();
                        _logger.LogInformation("Data seeding completed successfully");
                    }
                }
                else
                {
                    _logger.LogInformation("Database already contains data, skipping seed");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the data");
                throw;
            }
        }
    }
} 