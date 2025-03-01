using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models
{
    public class Destination
    {
        public int Id { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        
        public List<Clue> Clues { get; set; } = new();
        
        public List<FunFact> FunFacts { get; set; } = new();
        
        public List<Trivia> Trivia { get; set; } = new();
    }
} 