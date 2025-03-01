namespace GlobetrotterAPI.Models
{
    public class AnswerResponse
    {
        public required bool IsCorrect { get; set; }
        public required string FunFact { get; set; }
        public required int TotalScore { get; set; }
    }
} 