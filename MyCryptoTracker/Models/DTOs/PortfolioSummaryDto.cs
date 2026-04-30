namespace MyCryptoTracker.Models.DTOs;

public class PortfolioSummaryDto
{
    public double TotalValueUsd { get; set; }
    public double TotalProfitLossUsd { get; set; }
    public double ProfitLossPercentage { get; set; }
    public List<AssetPerformanceDto> AssetPerformances { get; set; } = new();
}

public class AssetPerformanceDto
{
    public string Symbol { get; set; } = string.Empty;
    public double CurrentPrice { get; set; }
    public double ProfitLoss { get; set; }
}