using System;

namespace GlobetrotterAPI.Models.DTOs
{
    public class AnswerRequest
    {
        public Guid DestinationId { get; set; }
        public Guid AnswerId { get; set; }
    }
} 