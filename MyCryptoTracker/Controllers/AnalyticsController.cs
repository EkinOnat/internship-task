using Microsoft.AspNetCore.Mvc;
using MyCryptoTracker.Models.DTOs;
using MyCryptoTracker.Repositories;
using MyCryptoTracker.Services;

namespace MyCryptoTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAssetRepository _repository;
    private readonly ICryptoService _cryptoService;
    private readonly IPortfolioService _portfolioService;

    public AnalyticsController(
        IAssetRepository repository,
        ICryptoService cryptoService,
        IPortfolioService portfolioService)
    {
        _repository = repository;
        _cryptoService = cryptoService;
        _portfolioService = portfolioService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
var assets = await _repository.GetAllAsync();
    
    // 1. get unique symbols 
    var uniqueSymbols = assets.Select(a => a.Symbol).Distinct();

    // 2. get prices
    var prices = await _cryptoService.GetPricesInUsdAsync(uniqueSymbols);

    var summary = new PortfolioSummaryDto();
    double totalPurchaseCost = 0;

    foreach (var asset in assets)
    {
        if (prices.TryGetValue(asset.Symbol.ToUpper(), out var currentPrice))
        {
            var price = (double)currentPrice;
            var profitLoss = _portfolioService.CalculateProfitLoss(asset.Amount, asset.PurchasePrice, price);
            
            summary.TotalValueUsd += asset.Amount * price;
            summary.TotalProfitLossUsd += profitLoss;
            totalPurchaseCost += asset.Amount * asset.PurchasePrice;

            summary.AssetPerformances.Add(new AssetPerformanceDto {
                Symbol = asset.Symbol,
                CurrentPrice = price,
                ProfitLoss = profitLoss
            });
        }
    }

        if (totalPurchaseCost > 0)
        {
            summary.ProfitLossPercentage = (summary.TotalProfitLossUsd / totalPurchaseCost) * 100;
        }

        return Ok(summary);
    }
}