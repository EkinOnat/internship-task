using Microsoft.EntityFrameworkCore;
using MyCryptoTracker.Data;
using MyCryptoTracker.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// SQLite 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository 
builder.Services.AddScoped<IAssetRepository, AssetRepository>();

var app = builder.Build();

// 2. Middleware 
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();