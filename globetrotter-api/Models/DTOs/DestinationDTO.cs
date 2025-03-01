using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GlobetrotterAPI.Models.DTOs
{
    public class DestinationDTO
    {
        public Guid Id { get; set; }
        public List<string> Clues { get; set; } = new();
        public List<CityOption> Options { get; set; } = new();
    }

    public class CityOption
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}

