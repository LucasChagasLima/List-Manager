namespace ListManager.Models
{
    public class CreateListRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = "Todo";
        public string Color { get; set; } = "#3b82f6";
    }

    public class CreateItemRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "Geral";
        public int Priority { get; set; } = 1;
    }

    public class UpdateItemRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool? IsCompleted { get; set; }
        public string? Category { get; set; }
        public int? Priority { get; set; }
    }
}
