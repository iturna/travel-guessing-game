using System.Collections.Generic;

namespace GlobetrotterAPI.Models.DTOs
{
    public class AnswerResponse
    {
        public bool IsCorrect { get; set; }
        public string FunFact { get; set; } = string.Empty;
        public List<string> Trivia { get; set; } = new();
        public string CorrectCity { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public int TotalScore { get; set; }
        public int CorrectAnswers { get; set; }
        public int IncorrectAnswers { get; set; }
    }
} 