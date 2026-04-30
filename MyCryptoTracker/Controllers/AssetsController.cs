using Microsoft.AspNetCore.Mvc;
using MyCryptoTracker.Models.Entities;
using MyCryptoTracker.Models.DTOs;
using MyCryptoTracker.Repositories;

namespace MyCryptoTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetRepository _repository;

    public AssetsController(IAssetRepository repository)
    {
        _repository = repository;
    }

    // GET: api/assets
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var assets = await _repository.GetAllAsync();
        return Ok(assets);
    }

    // GET: api/assets/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _repository.GetByIdAsync(id);
        if (asset == null)
            return NotFound(new { message = $"Asset with ID {id} not found." }); // Meaningful error handling

        return Ok(asset);
    }

    // POST: api/assets
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AssetCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var asset = new Asset
        {
            Symbol = dto.Symbol.ToUpper(),
            Name = dto.Name,
            Amount = dto.Amount,
            PurchasePrice = dto.PurchasePrice,
            AddedDate = DateTime.UtcNow
        };

        await _repository.AddAsync(asset);

        return CreatedAtAction(nameof(GetById), new { id = asset.Id }, asset);
    }

    // DELETE: api/assets/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound(new { message = $"Asset with ID {id} not found." });

        await _repository.DeleteAsync(id);
        return NoContent(); // 204 No Content
    }
}