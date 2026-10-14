using CarWebApplicationAPI.Data;
using CarWebApplicationAPI.Dto;
using CarWebApplicationAPI.Models;
using CarWebApplicationAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ValueGeneration;

namespace CarWebApplicationAPI.CarsController
{

    [Route("api/[controller]")]
    [ApiController]

    public class CarsController(ICarService carService) : Controller
    {

        [HttpGet]

        public async Task<ActionResult<List<CarDto>>> GetCars()
        {
            var cars = await carService.GetCarsAsync();
            return Ok(cars);
        }

        [HttpPost]
        public async Task<ActionResult<CarDto>> AddCar(CarDto car)
        {
            var result = await carService.AddCarAsync(car);

            return Ok(result);
        }
        [HttpGet("{id}")]

        public async Task<ActionResult<List<CarDto>>> GetCarById(int id)
        {
            var car = await carService.GetCarByIdAsync(id);

            if (car is null)
                return NotFound();

            return Ok(car);
        }

        [HttpGet("pretraga")]
        public async Task<ActionResult<List<CarDto>>> FindCar(
       [FromQuery] string marka)
        {
            var automobili = await carService.FindCarsAsync(marka);

            return Ok(automobili);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CarDto>> UpdateCar(int id, CarDto car)
        {
            var result = await carService.UpdateCarAsync(id, car);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var result = await carService.DeleteCarAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }

}
