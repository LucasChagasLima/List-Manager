using ListManager.Models;

namespace ListManager.Services
{
    public interface IListService
    {
        Task<List<TodoList>> GetAllListsAsync();
        Task<TodoList?> GetListByIdAsync(int id);
        Task<TodoList> CreateListAsync(CreateListRequest request);
        Task<TodoList?> UpdateListAsync(int id, CreateListRequest request);
        Task<bool> DeleteListAsync(int id);
        Task<ListItem?> AddItemToListAsync(int listId, CreateItemRequest request);
        Task<ListItem?> UpdateItemAsync(int listId, int itemId, UpdateItemRequest request);
        Task<bool> DeleteItemAsync(int listId, int itemId);
        Task<bool> ToggleItemCompletionAsync(int listId, int itemId);
    }

    public class ListService : IListService
    {
        private static List<TodoList> _lists = new List<TodoList>();
        private static int _nextListId = 1;
        private static int _nextItemId = 1;

        static ListService()
        {
            // Dados de exemplo
            var sampleList = new TodoList
            {
                Id = _nextListId++,
                Name = "Lista de Compras",
                Description = "Compras do supermercado",
                Type = "Shopping",
                Color = "#10b981"
            };

            sampleList.Items.Add(new ListItem
            {
                Id = _nextItemId++,
                Title = "Leite",
                Description = "1 litro de leite integral",
                Category = "Laticínios",
                Priority = 2
            });

            sampleList.Items.Add(new ListItem
            {
                Id = _nextItemId++,
                Title = "Pão",
                Description = "Pão francês",
                Category = "Padaria",
                Priority = 3
            });

            _lists.Add(sampleList);

            var todoSample = new TodoList
            {
                Id = _nextListId++,
                Name = "Tarefas do Trabalho",
                Description = "Tarefas importantes para esta semana",
                Type = "Todo",
                Color = "#f59e0b"
            };

            todoSample.Items.Add(new ListItem
            {
                Id = _nextItemId++,
                Title = "Revisar código",
                Description = "Revisar pull request do projeto X",
                Category = "Desenvolvimento",
                Priority = 3
            });

            _lists.Add(todoSample);
        }

        public Task<List<TodoList>> GetAllListsAsync()
        {
            return Task.FromResult(_lists.ToList());
        }

        public Task<TodoList?> GetListByIdAsync(int id)
        {
            var list = _lists.FirstOrDefault(l => l.Id == id);
            return Task.FromResult(list);
        }

        public Task<TodoList> CreateListAsync(CreateListRequest request)
        {
            var newList = new TodoList
            {
                Id = _nextListId++,
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                Color = request.Color
            };

            _lists.Add(newList);
            return Task.FromResult(newList);
        }

        public Task<TodoList?> UpdateListAsync(int id, CreateListRequest request)
        {
            var list = _lists.FirstOrDefault(l => l.Id == id);
            if (list == null) return Task.FromResult<TodoList?>(null);

            list.Name = request.Name;
            list.Description = request.Description;
            list.Type = request.Type;
            list.Color = request.Color;

            return Task.FromResult<TodoList?>(list);
        }

        public Task<bool> DeleteListAsync(int id)
        {
            var list = _lists.FirstOrDefault(l => l.Id == id);
            if (list == null) return Task.FromResult(false);

            _lists.Remove(list);
            return Task.FromResult(true);
        }

        public Task<ListItem?> AddItemToListAsync(int listId, CreateItemRequest request)
        {
            var list = _lists.FirstOrDefault(l => l.Id == listId);
            if (list == null) return Task.FromResult<ListItem?>(null);

            var newItem = new ListItem
            {
                Id = _nextItemId++,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Priority = request.Priority
            };

            list.Items.Add(newItem);
            return Task.FromResult<ListItem?>(newItem);
        }

        public Task<ListItem?> UpdateItemAsync(int listId, int itemId, UpdateItemRequest request)
        {
            var list = _lists.FirstOrDefault(l => l.Id == listId);
            if (list == null) return Task.FromResult<ListItem?>(null);

            var item = list.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return Task.FromResult<ListItem?>(null);

            if (request.Title != null) item.Title = request.Title;
            if (request.Description != null) item.Description = request.Description;
            if (request.Category != null) item.Category = request.Category;
            if (request.Priority.HasValue) item.Priority = request.Priority.Value;
            if (request.IsCompleted.HasValue)
            {
                item.IsCompleted = request.IsCompleted.Value;
                item.CompletedAt = request.IsCompleted.Value ? DateTime.UtcNow : null;
            }

            return Task.FromResult<ListItem?>(item);
        }

        public Task<bool> DeleteItemAsync(int listId, int itemId)
        {
            var list = _lists.FirstOrDefault(l => l.Id == listId);
            if (list == null) return Task.FromResult(false);

            var item = list.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return Task.FromResult(false);

            list.Items.Remove(item);
            return Task.FromResult(true);
        }

        public Task<bool> ToggleItemCompletionAsync(int listId, int itemId)
        {
            var list = _lists.FirstOrDefault(l => l.Id == listId);
            if (list == null) return Task.FromResult(false);

            var item = list.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return Task.FromResult(false);

            item.IsCompleted = !item.IsCompleted;
            item.CompletedAt = item.IsCompleted ? DateTime.UtcNow : null;

            return Task.FromResult(true);
        }
    }
}
