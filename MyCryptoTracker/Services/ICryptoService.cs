namespace MyCryptoTracker.Services;

public interface ICryptoService
{
    // Current price of a cryptocurrency in USD
    Task<Dictionary<string, decimal>> GetPricesInUsdAsync(IEnumerable<string> symbols);
}