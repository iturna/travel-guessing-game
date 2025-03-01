using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models
{
    public class FunFact
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public int DestinationId { get; set; }
        
        [JsonIgnore]
        public required Destination Destination { get; set; }
    }
} 