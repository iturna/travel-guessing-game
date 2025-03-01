using System;
using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models
{
    public class Trivia
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public Guid DestinationId { get; set; }
        
        [JsonIgnore]
        public required Destination Destination { get; set; }
    }
} 