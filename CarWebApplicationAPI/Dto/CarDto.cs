namespace CarWebApplicationAPI.Dto
{
    public class CarDto
    {
        public string Marka { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Godiste { get; set; }
        public decimal Cijena { get; set; }
    }
}
