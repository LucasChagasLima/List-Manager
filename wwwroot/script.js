// API Base URL
const API_BASE = '/api';

// Estado da aplicação
let currentLists = [];
let currentListId = null;
let selectedColor = '#3b82f6';
let editingListId = null;

// Elementos DOM
const elements = {
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    listsGrid: document.getElementById('listsGrid'),
    listModal: document.getElementById('listModal'),
    viewListModal: document.getElementById('viewListModal'),
    listForm: document.getElementById('listForm'),
    addItemForm: document.getElementById('addItemForm'),
    newListBtn: document.getElementById('newListBtn'),
    closeModal: document.getElementById('closeModal'),
    closeViewModal: document.getElementById('closeViewModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    modalTitle: document.getElementById('modalTitle'),
    viewListTitle: document.getElementById('viewListTitle'),
    viewListDescription: document.getElementById('viewListDescription'),
    itemsList: document.getElementById('itemsList'),
    editListBtn: document.getElementById('editListBtn'),
    deleteListBtn: document.getElementById('deleteListBtn')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        await loadLists();
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showError('Erro ao carregar dados. Tente recarregar a página.');
    }
}

function setupEventListeners() {
    // Botões principais
    elements.newListBtn.addEventListener('click', () => openListModal());
    elements.closeModal.addEventListener('click', () => closeListModal());
    elements.closeViewModal.addEventListener('click', () => closeViewListModal());
    elements.cancelBtn.addEventListener('click', () => closeListModal());
    
    // Formulários
    elements.listForm.addEventListener('submit', handleListSubmit);
    elements.addItemForm.addEventListener('submit', handleAddItem);
    
    // Botões do modal de visualização
    elements.editListBtn.addEventListener('click', () => editCurrentList());
    elements.deleteListBtn.addEventListener('click', () => deleteCurrentList());
    
    // Seleção de cor
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectColor(btn.dataset.color);
        });
    });
    
    // Fechar modal clicando fora
    elements.listModal.addEventListener('click', (e) => {
        if (e.target === elements.listModal) closeListModal();
    });
    
    elements.viewListModal.addEventListener('click', (e) => {
        if (e.target === elements.viewListModal) closeViewListModal();
    });
}

// Funções da API
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    if (response.status === 204) return null;
    return await response.json();
}

async function loadLists() {
    showLoading();
    try {
        const lists = await apiCall('/lists');
        currentLists = lists;
        displayLists(lists);
    } catch (error) {
        console.error('Erro ao carregar listas:', error);
        showError('Erro ao carregar listas');
    }
}

async function createList(listData) {
    return await apiCall('/lists', {
        method: 'POST',
        body: JSON.stringify(listData)
    });
}

async function updateList(id, listData) {
    return await apiCall(`/lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(listData)
    });
}

async function deleteList(id) {
    return await apiCall(`/lists/${id}`, {
        method: 'DELETE'
    });
}

async function addItemToList(listId, itemData) {
    return await apiCall(`/lists/${listId}/items`, {
        method: 'POST',
        body: JSON.stringify(itemData)
    });
}

async function updateItem(listId, itemId, itemData) {
    return await apiCall(`/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
    });
}

async function deleteItem(listId, itemId) {
    return await apiCall(`/lists/${listId}/items/${itemId}`, {
        method: 'DELETE'
    });
}

async function toggleItemCompletion(listId, itemId) {
    return await apiCall(`/lists/${listId}/items/${itemId}/toggle`, {
        method: 'PATCH'
    });
}

// Funções de UI
function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.emptyState.classList.add('hidden');
    elements.listsGrid.classList.add('hidden');
}

function showEmpty() {
    elements.loadingState.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    elements.listsGrid.classList.add('hidden');
}

function showLists() {
    elements.loadingState.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
    elements.listsGrid.classList.remove('hidden');
}

function displayLists(lists) {
    if (lists.length === 0) {
        showEmpty();
        return;
    }
    
    showLists();
    elements.listsGrid.innerHTML = '';
    
    lists.forEach(list => {
        const listCard = createListCard(list);
        elements.listsGrid.appendChild(listCard);
    });
}

function createListCard(list) {
    const completedItems = list.items.filter(item => item.isCompleted).length;
    const totalItems = list.items.length;
    const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    const card = document.createElement('div');
    card.className = `list-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 ${list.type.toLowerCase()} fade-in`;
    card.style.borderLeftColor = list.color;
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${escapeHtml(list.name)}</h3>
                <p class="text-gray-600 text-sm">${escapeHtml(list.description || 'Sem descrição')}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                ${getTypeLabel(list.type)}
            </span>
        </div>
        
        <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>${completedItems}/${totalItems}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-300" 
                     style="width: ${progressPercent}%; background-color: ${list.color}"></div>
            </div>
        </div>
        
        <div class="flex justify-between items-center text-sm text-gray-500">
            <span><i class="fas fa-calendar-alt mr-1"></i>${formatDate(list.createdAt)}</span>
            <span><i class="fas fa-tasks mr-1"></i>${totalItems} itens</span>
        </div>
    `;
    
    card.addEventListener('click', () => openViewListModal(list));
    
    return card;
}

function openListModal(list = null) {
    editingListId = list ? list.id : null;
    elements.modalTitle.textContent = list ? 'Editar Lista' : 'Nova Lista';
    
    if (list) {
        document.getElementById('listName').value = list.name;
        document.getElementById('listDescription').value = list.description || '';
        document.getElementById('listType').value = list.type;
        selectColor(list.color);
    } else {
        elements.listForm.reset();
        selectColor('#3b82f6');
    }
    
    elements.listModal.classList.remove('hidden');
    document.getElementById('listName').focus();
}

function closeListModal() {
    elements.listModal.classList.add('hidden');
    elements.listForm.reset();
    editingListId = null;
}

function openViewListModal(list) {
    currentListId = list.id;
    elements.viewListTitle.textContent = list.name;
    elements.viewListDescription.textContent = list.description || 'Sem descrição';
    
    displayListItems(list.items);
    elements.viewListModal.classList.remove('hidden');
}

function closeViewListModal() {
    elements.viewListModal.classList.add('hidden');
    currentListId = null;
}

function displayListItems(items) {
    elements.itemsList.innerHTML = '';
    
    if (items.length === 0) {
        elements.itemsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-clipboard-list text-4xl mb-3"></i>
                <p>Nenhum item nesta lista ainda.</p>
                <p class="text-sm">Adicione o primeiro item acima!</p>
            </div>
        `;
        return;
    }
    
    // Ordenar itens: não completados primeiro, depois por prioridade
    const sortedItems = [...items].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
        }
        return b.priority - a.priority;
    });
    
    sortedItems.forEach(item => {
        const itemElement = createItemElement(item);
        elements.itemsList.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `list-item p-4 bg-white rounded-lg border border-gray-200 ${item.isCompleted ? 'completed' : ''} priority-${getPriorityClass(item.priority)} slide-in`;
    
    itemDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
                <button class="toggle-btn mr-3 text-xl ${item.isCompleted ? 'text-green-500' : 'text-gray-300'} hover:text-green-600 transition-colors">
                    <i class="fas ${item.isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <div class="flex-1">
                    <h4 class="item-title font-medium text-gray-900">${escapeHtml(item.title)}</h4>
                    ${item.description ? `<p class="text-sm text-gray-600 mt-1">${escapeHtml(item.description)}</p>` : ''}
                    <div class="flex items-center mt-2 space-x-3">
                        <span class="priority-badge priority-${getPriorityClass(item.priority)}">
                            ${getPriorityLabel(item.priority)}
                        </span>
                        <span class="text-xs text-gray-500">
                            <i class="fas fa-tag mr-1"></i>${escapeHtml(item.category)}
                        </span>
                        ${item.completedAt ? `<span class="text-xs text-gray-500">
                            <i class="fas fa-check mr-1"></i>Concluído em ${formatDate(item.completedAt)}
                        </span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
                <button class="edit-item-btn text-blue-600 hover:text-blue-800 p-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-item-btn text-red-600 hover:text-red-800 p-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Event listeners para os botões do item
    const toggleBtn = itemDiv.querySelector('.toggle-btn');
    const editBtn = itemDiv.querySelector('.edit-item-btn');
    const deleteBtn = itemDiv.querySelector('.delete-item-btn');
    
    toggleBtn.addEventListener('click', () => handleToggleItem(item.id));
    editBtn.addEventListener('click', () => handleEditItem(item));
    deleteBtn.addEventListener('click', () => handleDeleteItem(item.id));
    
    return itemDiv;
}

// Event Handlers
async function handleListSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const listData = {
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        color: selectedColor
    };
    
    try {
        if (editingListId) {
            await updateList(editingListId, listData);
            showSuccess('Lista atualizada com sucesso!');
        } else {
            await createList(listData);
            showSuccess('Lista criada com sucesso!');
        }
        
        closeListModal();
        await loadLists();
    } catch (error) {
        console.error('Erro ao salvar lista:', error);
        showError('Erro ao salvar lista. Tente novamente.');
    }
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const title = document.getElementById('itemTitle').value.trim();
    const priority = parseInt(document.getElementById('itemPriority').value);
    
    if (!title) return;
    
    const itemData = {
        title,
        description: '',
        category: 'Geral',
        priority
    };
    
    try {
        await addItemToList(currentListId, itemData);
        document.getElementById('itemTitle').value = '';
        document.getElementById('itemPriority').value = '1';
        
        // Recarregar a lista atual
        const updatedList = await apiCall(`/lists/${currentListId}`);
        displayListItems(updatedList.items);
        
        // Atualizar também a lista principal
        await loadLists();
        
        showSuccess('Item adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        showError('Erro ao adicionar item. Tente novamente.');
    }
}

async function handleToggleItem(itemId) {
    try {
        await toggleItemCompletion(currentListId, itemId);
        
        // Recarregar a lista atual
        const updatedList = await apiCall(`/lists/${currentListId}`);
        displayListItems(updatedList.items);
        
        // Atualizar também a lista principal
        await loadLists();
    } catch (error) {
        console.error('Erro ao alterar status do item:', error);
        showError('Erro ao alterar status do item.');
    }
}

async function handleEditItem(item) {
    const newTitle = prompt('Editar título:', item.title);
    if (newTitle && newTitle.trim() !== item.title) {
        try {
            await updateItem(currentListId, item.id, { title: newTitle.trim() });
            
            // Recarregar a lista atual
            const updatedList = await apiCall(`/lists/${currentListId}`);
            displayListItems(updatedList.items);
            
            await loadLists();
            showSuccess('Item atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar item:', error);
            showError('Erro ao editar item.');
        }
    }
}

async function handleDeleteItem(itemId) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        try {
            await deleteItem(currentListId, itemId);
            
            // Recarregar a lista atual
            const updatedList = await apiCall(`/lists/${currentListId}`);
            displayListItems(updatedList.items);
            
            await loadLists();
            showSuccess('Item excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            showError('Erro ao excluir item.');
        }
    }
}

async function editCurrentList() {
    const currentList = currentLists.find(list => list.id === currentListId);
    if (currentList) {
        closeViewListModal();
        openListModal(currentList);
    }
}

async function deleteCurrentList() {
    if (confirm('Tem certeza que deseja excluir esta lista e todos os seus itens?')) {
        try {
            await deleteList(currentListId);
            closeViewListModal();
            await loadLists();
            showSuccess('Lista excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir lista:', error);
            showError('Erro ao excluir lista.');
        }
    }
}

// Funções utilitárias
function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) {
            btn.classList.add('selected');
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getTypeLabel(type) {
    const labels = {
        'Todo': 'Tarefas',
        'Shopping': 'Compras',
        'Notes': 'Anotações',
        'Goals': 'Metas'
    };
    return labels[type] || type;
}

function getPriorityLabel(priority) {
    const labels = {
        1: 'Baixa',
        2: 'Média',
        3: 'Alta'
    };
    return labels[priority] || 'Baixa';
}

function getPriorityClass(priority) {
    const classes = {
        1: 'low',
        2: 'medium',
        3: 'high'
    };
    return classes[priority] || 'low';
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
