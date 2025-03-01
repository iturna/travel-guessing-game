using Microsoft.EntityFrameworkCore;
using GlobetrotterAPI.Data;
using GlobetrotterAPI.Models;
using GlobetrotterAPI.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add DataSeeder service
builder.Services.AddScoped<DataSeeder>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "5047";
builder.WebHost.UseUrls($"http://*:{port}");


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(
                "http://localhost:3000",
                "https://travel-guessing-game-green.vercel.app",
                "https://globetrotter-client-pz69lg7mf-iturnas-projects.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Add this after app.MapControllers();

// Use CORS before other middleware
//app.UseCors();

// Comment out or remove this line
// app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => "Globetrotter API is running!");

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
        var seeder = services.GetRequiredService<DataSeeder>();
        await seeder.SeedData();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

app.Run();
