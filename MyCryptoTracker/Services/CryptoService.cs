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

    public async Task<decimal?> GetPriceInUsdAsync(string symbol)
    {
        var client = _httpClientFactory.CreateClient();

        // critical: coingecko not allowing requests without user-agent
        client.DefaultRequestHeaders.Add("User-Agent", "MyCryptoTrackerApp/1.0");
        client.DefaultRequestHeaders.Add("Accept", "application/json");

        var coinId = _symbolMap.GetValueOrDefault(symbol.ToUpper());
        if (string.IsNullOrEmpty(coinId)) return null;

        try
        {
            var response = await client.GetAsync($"https://api.coingecko.com/api/v3/simple/price?ids={coinId}&vs_currencies=usd");

            // Hata durumunu loglayalım ki terminalde görebilesin
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"API Error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty(coinId, out var coinData))
            {
                return coinData.GetProperty("usd").GetDecimal();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
        }

        return null;
    }
}