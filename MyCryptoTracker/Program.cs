using Microsoft.EntityFrameworkCore;
using MyCryptoTracker.Data;
using MyCryptoTracker.Repositories;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

// OpenAPI/Swagger support
builder.Services.AddOpenApi();

// SQLite DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAssetRepository, AssetRepository>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();