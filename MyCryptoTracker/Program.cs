using Microsoft.EntityFrameworkCore;
using MyCryptoTracker.Data;
using MyCryptoTracker.Repositories;
using MyCryptoTracker.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ICryptoService, CryptoService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();

// SQLite 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository 
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // React portun hangisiyse
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});

var app = builder.Build();

// 2. Middleware 
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

}
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();