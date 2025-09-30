namespace ListManager.Models
{
    public class TodoList
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = "Todo"; // Todo, Shopping, Notes, etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<ListItem> Items { get; set; } = new List<ListItem>();
        public string Color { get; set; } = "#3b82f6"; // Cor para personalização
    }
}
