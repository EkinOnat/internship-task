using MyCryptoTracker.Models.Entities;

namespace MyCryptoTracker.Repositories;

// PATTERN USED: Repository Pattern
// Reason: To abstract the data access layer and promote testability by decoupling 
// the database context from the business services.
public interface IAssetRepository
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset?> GetByIdAsync(int id);
    Task AddAsync(Asset asset);
    Task UpdateAsync(Asset asset);
    Task DeleteAsync(int id);
}