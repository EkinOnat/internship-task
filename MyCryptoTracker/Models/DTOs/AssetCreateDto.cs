namespace MyCryptoTracker.Models.DTOs;

public class AssetCreateDto
{
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Amount { get; set; }
    public double PurchasePrice { get; set; }
}