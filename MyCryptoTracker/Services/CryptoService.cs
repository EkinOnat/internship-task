using System.Text.Json;

namespace MyCryptoTracker.Services;

public class CryptoService : ICryptoService
{
    private readonly IHttpClientFactory _httpClientFactory;

    // CoinGecko semboller yerine id'ler kullanır (btc -> bitcoin)
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
        var coinId = _symbolMap.GetValueOrDefault(symbol.ToUpper());

        if (string.IsNullOrEmpty(coinId)) return null;

        try
        {
            var response = await client.GetAsync($"https://api.coingecko.com/api/v3/simple/price?ids={coinId}&vs_currencies=usd");

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty(coinId, out var coinData))
            {
                return coinData.GetProperty("usd").GetDecimal();
            }
        }
        catch { }

        return null;
    }
}