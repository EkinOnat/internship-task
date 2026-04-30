using System.ComponentModel.DataAnnotations;

namespace MyCryptoTracker.Models.Entities;

public class Asset
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Symbol { get; set; } = string.Empty; // BTC, ETH

    [Required]
    public string Name { get; set; } = string.Empty;

    public double Amount { get; set; } // Eldeki miktar

    public double PurchasePrice { get; set; } // Alış fiyatı

    public DateTime AddedDate { get; set; } = DateTime.UtcNow;
}