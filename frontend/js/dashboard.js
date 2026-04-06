/**
 * Dashboard - Linked Repositories Display
 * Fetches and displays repositories linked via GitHub integration
 */

const API_BASE_URL = 'http://localhost:8001'; // Backend API URL

class DashboardLinkedRepos {
    constructor() {
        this.userId = localStorage.getItem('user_id') || this.generateUserId();
        this.linkedRepos = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLinkedRepositories();
    }

    setupEventListeners() {
        document.getElementById('refresh-linked-repos-btn')?.addEventListener('click', () => {
            this.refreshRepositories();
        });
    }

    async loadLinkedRepositories() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/github/linked-repos?user_id=${this.userId}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                // User hasn't connected GitHub yet, show empty state
                this.showEmptyState();
                return;
            }

            const data = await response.json();

            if (data.count === 0) {
                this.showEmptyState();
                return;
            }

            this.linkedRepos = data.repositories;
            this.renderLinkedRepositories();

        } catch (error) {
            console.error('Failed to load linked repositories:', error);
            this.showEmptyState();
        }
    }

    renderLinkedRepositories() {
        const grid = document.getElementById('linked-repos-grid');
        const section = document.getElementById('linked-repos-section');
        const emptyState = document.getElementById('linked-repos-empty');

        grid.innerHTML = '';
        emptyState.classList.add('hidden');
        section.classList.remove('hidden');

        this.linkedRepos.forEach(repo => {
            const card = this.createRepositoryCard(repo);
            grid.appendChild(card);
        });
    }

    createRepositoryCard(repo) {
        const div = document.createElement('div');
        div.className = 'group bg-[#111827] border border-white/10 rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-indigo-500/30';
        
        const lastUpdated = new Date(repo.last_updated).toLocaleDateString();
        const privacyBadge = repo.is_private 
            ? '<span class="bg-tertiary/20 text-tertiary text-[10px] font-label font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Private</span>'
            : '<span class="bg-white/5 text-slate-400 text-[10px] font-label px-2 py-0.5 rounded-full uppercase tracking-wider">Public</span>';

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <span class="material-symbols-outlined text-indigo-400">folder</span>
                    </div>
                    <div class="flex gap-2">
                        ${privacyBadge}
                    </div>
                </div>
                <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="font-headline font-bold text-xl mb-2 text-white group-hover:text-indigo-400 transition-colors hover:underline">
                    ${repo.name}
                </a>
                <p class="text-on-surface-variant text-sm font-body line-clamp-2 mb-6">
                    Linked repository from GitHub
                </p>
            </div>
            <div class="flex items-center justify-between pt-6 border-t border-white/5">
                <div class="flex items-center gap-4 text-xs font-label text-slate-400">
                    <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs">star</span>
                        ${repo.stars}
                    </span>
                    <span>${lastUpdated}</span>
                </div>
                <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-full bg-indigo-600/10 text-indigo-400 font-headline font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                    View
                </a>
            </div>
        `;

        return div;
    }

    showEmptyState() {
        const section = document.getElementById('linked-repos-section');
        const grid = document.getElementById('linked-repos-grid');
        const emptyState = document.getElementById('linked-repos-empty');

        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        section.classList.remove('hidden');
    }

    async refreshRepositories() {
        try {
            const btn = document.getElementById('refresh-linked-repos-btn');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const response = await fetch(
                `${API_BASE_URL}/auth/github/refresh-repos?user_id=${this.userId}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                throw new Error('Failed to refresh repositories');
            }

            // Reload the repositories
            await this.loadLinkedRepositories();

            // Show success feedback
            this.showRefreshSuccess();

        } catch (error) {
            console.error('Failed to refresh repositories:', error);
            this.showRefreshError(error.message);
        } finally {
            const btn = document.getElementById('refresh-linked-repos-btn');
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    showRefreshSuccess() {
        const btn = document.getElementById('refresh-linked-repos-btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Refreshed';
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
        }, 2000);
    }

    showRefreshError(message) {
        const btn = document.getElementById('refresh-linked-repos-btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">error</span> Error';
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
        }, 2000);
    }

    generateUserId() {
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('user_id', userId);
        return userId;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardLinkedRepos = new DashboardLinkedRepos();
});
