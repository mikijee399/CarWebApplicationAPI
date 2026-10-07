namespace CarWebApplicationAPI.Models
{
    public class Car
    {

        public int Id { get; set; }
        public string Marka { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Godiste { get; set; }
        public decimal Cijena { get; set; }
    }
}
