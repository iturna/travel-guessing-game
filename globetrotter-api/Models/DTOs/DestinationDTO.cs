using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models.DTOs
{
    public class DestinationDTO
    {
        public Guid Id { get; set; }
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public List<string> Clues { get; set; } = new();
        public List<string> FunFacts { get; set; } = new();
        public List<string> Trivia { get; set; } = new();
        public List<string> Options { get; set; } = new();
    }
}

