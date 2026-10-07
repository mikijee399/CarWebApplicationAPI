using CarWebApplicationAPI.Dto;
using CarWebApplicationAPI.Models;

namespace CarWebApplicationAPI.Services
{
    public interface ICarService
    {
        Task<List<CarDto>> GetCarsAsync();
        Task<CarDto> AddCarAsync(CarDto car);
        Task<CarDto?> GetCarByIdAsync(int id);
        Task<CarDto?> UpdateCarAsync(int id, Car car);
        Task<bool> DeleteCarAsync(int id);
    }
}
