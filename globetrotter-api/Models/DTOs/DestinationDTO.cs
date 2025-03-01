using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models.DTOs
{
    public class DestinationDTO
    {
        public int Id { get; set; }
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public List<string> Clues { get; set; } = new();
        public List<string> FunFacts { get; set; } = new();
        public List<string> Trivia { get; set; } = new();
        public List<string> Options { get; set; } = new();
    }
}

public class AnswerRequest
{
    public int DestinationId { get; set; }
    public string Answer { get; set; }
}

public class AnswerResponse
{
    public bool IsCorrect { get; set; }
    public string FunFact { get; set; }
    public int TotalScore { get; set; }
} 