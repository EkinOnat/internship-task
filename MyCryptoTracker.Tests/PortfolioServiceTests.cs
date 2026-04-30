using MyCryptoTracker.Services;
using Xunit;

namespace MyCryptoTracker.Tests;

public class PortfolioServiceTests
{
    [Fact]
    public void CalculateProfitLoss_ShouldReturnCorrectValue_WhenPriceIncreases()
    {
        // Arrange 
        var service = new PortfolioService();
        double amount = 0.5;
        double purchasePrice = 50000;
        double currentPrice = 60000;

        // Act 
        var result = service.CalculateProfitLoss(amount, purchasePrice, currentPrice);

        // Assert 
        Assert.Equal(5000, result);
    }

    [Fact]
    public void CalculateProfitLoss_ShouldReturnNegativeValue_WhenPriceDrops()
    {
        // Arrange
        var service = new PortfolioService();
        double amount = 2;
        double purchasePrice = 100;
        double currentPrice = 80;

        // Act
        var result = service.CalculateProfitLoss(amount, purchasePrice, currentPrice);

        // Assert
        Assert.Equal(-40, result);
    }
}