using Microsoft.EntityFrameworkCore;
using GlobetrotterAPI.Models;

namespace GlobetrotterAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Clue> Clues { get; set; }
        public DbSet<FunFact> FunFacts { get; set; }
        public DbSet<Trivia> Trivia { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Destination>()
                .HasMany(d => d.Clues)
                .WithOne(c => c.Destination)
                .HasForeignKey(c => c.DestinationId);

            modelBuilder.Entity<Destination>()
                .HasMany(d => d.FunFacts)
                .WithOne(f => f.Destination)
                .HasForeignKey(f => f.DestinationId);

            modelBuilder.Entity<Destination>()
                .HasMany(d => d.Trivia)
                .WithOne(t => t.Destination)
                .HasForeignKey(t => t.DestinationId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
        }
    }
}