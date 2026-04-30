namespace MyCryptoTracker.Services;

public class PortfolioService : IPortfolioService
{
    public double CalculateProfitLoss(double amount, double purchasePrice, double currentPrice)
    {
        return (currentPrice - purchasePrice) * amount;
    }
}