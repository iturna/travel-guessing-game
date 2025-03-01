using System;
using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models
{
    public class Clue
    {
        public Guid Id { get; set; }
        public required string Text { get; set; }
        public Guid DestinationId { get; set; }
        
        [JsonIgnore]
        public required Destination Destination { get; set; }
    }
} 