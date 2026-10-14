using System.ComponentModel.DataAnnotations;

namespace CarWebApplicationAPI.Dto
{
    public class CarDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage ="Marka je obavezna")]
        [StringLength(20)]
        public string Marka { get; set; } = string.Empty;

        [Required(ErrorMessage ="Model je obavezan")]
        [StringLength(20)]
        public string Model { get; set; } = string.Empty;


        [Range(1900, 2027,ErrorMessage = "Godište mora biti između 1900 i 2027.")]
        public int Godiste { get; set; }

        [Range(1,1000000,ErrorMessage ="Cijena mora biti izmedju 1KM i 1 milion KM")]
        public decimal Cijena { get; set; }

        public string? SlikaUrl { get; set; }
    }
}
