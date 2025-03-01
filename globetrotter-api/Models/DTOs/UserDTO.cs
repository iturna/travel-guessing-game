namespace GlobetrotterAPI.Models.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Score { get; set; }
        public string? InviteCode { get; set; }
    }

    public class RegisterRequest
    {
        public required string Username { get; set; }
    }
} 