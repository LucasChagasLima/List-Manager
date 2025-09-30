namespace ListManager.Models
{
    public class ListItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public string Category { get; set; } = "Geral";
        public int Priority { get; set; } = 1; // 1 = Baixa, 2 = Média, 3 = Alta
    }
}
