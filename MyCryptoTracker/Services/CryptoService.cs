using System.Text.Json;

namespace MyCryptoTracker.Services;

public class CryptoService : ICryptoService
{
    private readonly IHttpClientFactory _httpClientFactory;

    // CoinGecko uses IDs instead of symbols (btc -> bitcoin)
    private readonly Dictionary<string, string> _symbolMap = new()
    {
        { "BTC", "bitcoin" },
        { "ETH", "ethereum" },
        { "SOL", "solana" }
    };

    public CryptoService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

   public async Task<Dictionary<string, decimal>> GetPricesInUsdAsync(IEnumerable<string> symbols)
{
    var client = _httpClientFactory.CreateClient();
    client.DefaultRequestHeaders.Add("User-Agent", "MyCryptoTrackerApp/1.0");

    // Sembolleri CoinGecko ID'lerine çevir ve virgülle birleştir
    var ids = symbols.Select(s => _symbolMap.GetValueOrDefault(s.ToUpper()))
                     .Where(id => id != null);

    if (!ids.Any()) return new Dictionary<string, decimal>();

    var idsPath = string.Join(",", ids);
    var url = $"https://api.coingecko.com/api/v3/simple/price?ids={idsPath}&vs_currencies=usd";

    try 
    {
        var response = await client.GetAsync(url);
        if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
        {
            Console.WriteLine("Rate limit hit! Need to wait.");
            return new Dictionary<string, decimal>(); 
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var results = new Dictionary<string, decimal>();

        foreach (var symbol in symbols)
        {
            var coinId = _symbolMap.GetValueOrDefault(symbol.ToUpper());
            if (coinId != null && doc.RootElement.TryGetProperty(coinId, out var coinData))
            {
                results[symbol.ToUpper()] = coinData.GetProperty("usd").GetDecimal();
            }
        }
        return results;
    }
    catch { return new Dictionary<string, decimal>(); }
}
}