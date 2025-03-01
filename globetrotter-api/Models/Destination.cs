using System;
using System.Collections.Generic;
using GlobetrotterAPI.Models;

namespace GlobetrotterAPI.Models
{
    public class Destination
    {
        public Guid Id { get; set; }
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public List<Clue> Clues { get; set; } = new();
        public List<FunFact> FunFacts { get; set; } = new();
        public List<Trivia> Trivia { get; set; } = new();
    }
}