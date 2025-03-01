using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models
{
    public class DestinationJson
    {
        [JsonPropertyName("city")]
        public required string City { get; set; }

        [JsonPropertyName("country")]
        public required string Country { get; set; }

        [JsonPropertyName("clues")]
        public required List<string> Clues { get; set; }

        [JsonPropertyName("fun_fact")]
        public required List<string> FunFact { get; set; }

        [JsonPropertyName("trivia")]
        public required List<string> Trivia { get; set; }
    }
} 