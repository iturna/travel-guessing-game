using System;

namespace GlobetrotterAPI.Models.DTOs;

public class AnswerRequest
{
    public required Guid DestinationId { get; set; }
    public required string Answer { get; set; }
}

