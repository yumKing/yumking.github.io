document.addEventListener('DOMContentLoaded', function() {
    // 创建搜索模态框 HTML
    const modalHTML = `
        <div id="search-modal" class="search-modal" style="display: none;">
            <div class="search-modal-overlay" data-close></div>
            <div class="search-modal-container">
                <div class="search-modal-header">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="搜索文档..." 
                        autocomplete="off"
                        aria-label="搜索文档"
                    >
                    <kbd class="search-shortcut">ESC</kbd>
                </div>
                <div id="search-results" class="search-results">
                    <div class="search-hint">
                        <p>输入关键词搜索文档内容</p>
                        <div class="search-keys">
                            <kbd>↑</kbd><kbd>↓</kbd> 导航
                            <kbd>↵</kbd> 选择
                            <kbd>/</kbd> 聚焦
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 获取 DOM 元素
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const overlay = modal.querySelector('.search-modal-overlay');
    
    let searchIndex = null;
    let currentResults = [];
    let selectedIndex = -1;
    
    // 加载 Sphinx 搜索索引
    async function loadSearchIndex() {
        if (searchIndex) return searchIndex;
        
        try {
            const response = await fetch(`${DOCUMENTATION_OPTIONS.URL_ROOT}searchindex.js`);
            const script = await response.text();
            eval(script); // 执行 searchindex.js，生成 Search.index
            
            // Sphinx 会自动生成 Search.index
            searchIndex = window.Search;
            return searchIndex;
        } catch (error) {
            console.error('加载搜索索引失败:', error);
            return null;
        }
    }
    
    // 打开搜索框
    function openSearch() {
        modal.style.display = 'flex';
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭搜索框
    function closeSearch() {
        modal.style.display = 'none';
        input.value = '';
        results.innerHTML = '';
        document.body.style.overflow = '';
        selectedIndex = -1;
    }
    
    // 执行搜索
    async function performSearch(query) {
        if (!query.trim()) {
            results.innerHTML = `
                <div class="search-hint">
                    <p>输入关键词搜索文档内容</p>
                    <div class="search-keys">
                        <kbd>↑</kbd><kbd>↓</kbd> 导航
                        <kbd>↵</kbd> 选择
                        <kbd>/</kbd> 聚焦
                    </div>
                </div>
            `;
            return;
        }
        
        const index = await loadSearchIndex();
        if (!index) {
            results.innerHTML = '<p class="search-error">搜索索引加载失败</p>';
            return;
        }
        
        // 使用 Sphinx 的搜索功能
        const searchTerms = query.toLowerCase().split(/\s+/);
        const fileMap = DOCUMENTATION_OPTIONS.FILE_SUFFIX === '.html' ? 
            window.Search.output : [];
        
        // 简化搜索逻辑（实际应使用 Search.query）
        if (window.Search.query) {
            const resultsData = window.Search.query(query);
            displayResults(resultsData, query);
        } else {
            // 备用方案：直接搜索
            fetch(`${DOCUMENTATION_OPTIONS.URL_ROOT}search.html?q=${encodeURIComponent(query)}`)
                .then(r => r.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const items = doc.querySelectorAll('#search-results .search-result-item');
                    
                    const resultsData = Array.from(items).map(item => ({
                        title: item.querySelector('.search-title')?.textContent || '',
                        url: item.querySelector('a')?.href || '',
                        excerpt: item.querySelector('.search-excerpt')?.textContent || ''
                    }));
                    
                    displayResults(resultsData, query);
                });
        }
    }
    
    // 显示搜索结果
    function displayResults(resultsData, query) {
        if (resultsData.length === 0) {
            results.innerHTML = `
                <div class="search-no-results">
                    <p>未找到相关结果</p>
                    <p class="search-suggestion">尝试其他关键词</p>
                </div>
            `;
            currentResults = [];
            return;
        }
        
        currentResults = resultsData.slice(0, 10); // 限制显示10条
        selectedIndex = -1;
        
        const html = currentResults.map((item, index) => `
            <div class="search-result-item" data-index="${index}" data-url="${item.url || ''}">
                <div class="search-result-title">${highlightText(item.title, query)}</div>
                ${item.excerpt ? `<div class="search-result-excerpt">${highlightText(item.excerpt, query)}</div>` : ''}
            </div>
        `).join('');
        
        results.innerHTML = html;
        
        // 添加点击事件
        results.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url) window.location.href = url;
            });
        });
    }
    
    // 高亮关键词
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.split(/\s+/).join('|')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // 键盘导航
    function handleKeydown(e) {
        if (modal.style.display === 'none') return;
        
        const items = results.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'Escape':
                closeSearch();
                break;
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelection(items);
                break;
            case 'Enter':
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    items[selectedIndex].click();
                }
                break;
        }
    }
    
    // 更新选中状态
    function updateSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    // 事件监听
    overlay.addEventListener('click', closeSearch);
    input.addEventListener('input', (e) => performSearch(e.target.value));
    document.addEventListener('keydown', handleKeydown);
    
    // 全局快捷键：按 / 触发搜索
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openSearch();
        }
    });
    
    // 添加搜索按钮到导航栏（如果不存在）
    addSearchButton();
});

// 添加搜索按钮
function addSearchButton() {
    const navBar = document.querySelector('.sidebar-drawer, .header-center, .wy-nav-side');
    if (!navBar) return;
    
    const button = document.createElement('button');
    button.className = 'search-button';
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span class="search-button-text">搜索</span>
        <kbd class="search-button-shortcut">/</kbd>
    `;
    button.addEventListener('click', () => {
        const event = new CustomEvent('openSearch');
        document.dispatchEvent(event);
    });
    
    navBar.insertBefore(button, navBar.firstChild);
}