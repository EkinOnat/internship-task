using Microsoft.EntityFrameworkCore;
using MyCryptoTracker.Models.Entities;

namespace MyCryptoTracker.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Asset> Assets { get; set; }
}