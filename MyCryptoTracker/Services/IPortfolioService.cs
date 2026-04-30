namespace MyCryptoTracker.Services;

public interface IPortfolioService
{
    // Calculate profit/loss for an asset
    double CalculateProfitLoss(double amount, double purchasePrice, double currentPrice);
}