using CarWebApplicationAPI.Data;
using CarWebApplicationAPI.Dto;
using CarWebApplicationAPI.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarWebApplicationAPI.Services
{
    public class CarService(AppDbContext context) : ICarService
    {
        public async Task<CarDto> AddCarAsync(CarDto carDto)
        {
            var car = new Car
            {
                Marka = carDto.Marka,
                Model = carDto.Model,
                Godiste = carDto.Godiste,
                Cijena = carDto.Cijena
            };

            context.Cars.Add(car);

            await context.SaveChangesAsync();

            return new CarDto
            {
                Marka = car.Marka,
                Model = car.Model,
                Godiste = car.Godiste,
                Cijena = car.Cijena
            };
        }

        public async Task<bool> DeleteCarAsync(int id)
        {
            var car = await context.Cars.FindAsync(id);

            if (car == null)
                return false;

            context.Cars.Remove(car);

            await context.SaveChangesAsync();

            return true;
        }

        public async Task<CarDto?> GetCarByIdAsync(int id)
        {
            return await context.Cars
                 .Where(car => car.Id == id)
                 .Select(car => new CarDto
                 {
                     Marka=car.Marka,
                     Model = car.Model,
                     Godiste=car.Godiste,
                     Cijena=car.Cijena
                 }).FirstOrDefaultAsync();
        }

        public async Task<List<CarDto>> GetCarsAsync()
        {
            return await context.Cars
                .Select(car => new CarDto
                {
                    Marka=car.Marka,
                    Model=car.Model,
                    Godiste=car.Godiste,
                    Cijena=car.Cijena,
                }).ToListAsync();
        }

        public async Task<CarDto?> UpdateCarAsync(int id, Car car)
        {
            var existingCar = await context.Cars.FindAsync(id);

            if (existingCar is null)
                return null;

            existingCar.Marka = car.Marka;
            existingCar.Model = car.Model;
            existingCar.Godiste = car.Godiste;
            existingCar.Cijena = car.Cijena;

            await context.SaveChangesAsync();

            return new CarDto
            {
                Marka = existingCar.Marka,
                Model = existingCar.Model,
                Godiste = existingCar.Godiste,
                Cijena = existingCar.Cijena
            };
        }
    }
}
