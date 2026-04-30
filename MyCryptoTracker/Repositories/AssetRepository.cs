using Microsoft.EntityFrameworkCore;
using MyCryptoTracker.Data;
using MyCryptoTracker.Models.Entities;

namespace MyCryptoTracker.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly AppDbContext _context; // Eğer dosya ismin AddDbContext ise burayı ona göre güncelle

    public AssetRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _context.Assets.ToListAsync();
    }

    public async Task<Asset?> GetByIdAsync(int id)
    {
        return await _context.Assets.FindAsync(id);
    }

    public async Task AddAsync(Asset asset)
    {
        await _context.Assets.AddAsync(asset);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Asset asset)
    {
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var asset = await _context.Assets.FindAsync(id);
        if (asset != null)
        {
            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
        }
    }
}