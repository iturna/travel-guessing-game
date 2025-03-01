using System;

namespace GlobetrotterAPI.Models.DTOs
{
    public class AnswerResponse
    {
        public bool IsCorrect { get; set; }
        public string FunFact { get; set; } = string.Empty;
        public int TotalScore { get; set; }
    }
}