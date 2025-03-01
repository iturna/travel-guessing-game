namespace GlobetrotterAPI.Models
{
    public class AnswerRequest
    {
        public required int DestinationId { get; set; }
        public required string Answer { get; set; }
    }
} 