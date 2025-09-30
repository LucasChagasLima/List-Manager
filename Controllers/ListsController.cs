using Microsoft.AspNetCore.Mvc;
using ListManager.Models;
using ListManager.Services;

namespace ListManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListsController : ControllerBase
    {
        private readonly IListService _listService;

        public ListsController(IListService listService)
        {
            _listService = listService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TodoList>>> GetAllLists()
        {
            var lists = await _listService.GetAllListsAsync();
            return Ok(lists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoList>> GetList(int id)
        {
            var list = await _listService.GetListByIdAsync(id);
            if (list == null)
                return NotFound();

            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<TodoList>> CreateList(CreateListRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Nome da lista é obrigatório");

            var newList = await _listService.CreateListAsync(request);
            return CreatedAtAction(nameof(GetList), new { id = newList.Id }, newList);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TodoList>> UpdateList(int id, CreateListRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Nome da lista é obrigatório");

            var updatedList = await _listService.UpdateListAsync(id, request);
            if (updatedList == null)
                return NotFound();

            return Ok(updatedList);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var success = await _listService.DeleteListAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{listId}/items")]
        public async Task<ActionResult<ListItem>> AddItemToList(int listId, CreateItemRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest("Título do item é obrigatório");

            var newItem = await _listService.AddItemToListAsync(listId, request);
            if (newItem == null)
                return NotFound("Lista não encontrada");

            return CreatedAtAction(nameof(GetList), new { id = listId }, newItem);
        }

        [HttpPut("{listId}/items/{itemId}")]
        public async Task<ActionResult<ListItem>> UpdateItem(int listId, int itemId, UpdateItemRequest request)
        {
            var updatedItem = await _listService.UpdateItemAsync(listId, itemId, request);
            if (updatedItem == null)
                return NotFound();

            return Ok(updatedItem);
        }

        [HttpDelete("{listId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int listId, int itemId)
        {
            var success = await _listService.DeleteItemAsync(listId, itemId);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPatch("{listId}/items/{itemId}/toggle")]
        public async Task<IActionResult> ToggleItemCompletion(int listId, int itemId)
        {
            var success = await _listService.ToggleItemCompletionAsync(listId, itemId);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
