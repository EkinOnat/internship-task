namespace MyCryptoTracker.Services;

public interface ICryptoService
{
    // Current price of a cryptocurrency in USD
    Task<decimal?> GetPriceInUsdAsync(string symbol);
}