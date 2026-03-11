// app.js - Neon Nexus Engine

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Element Caching ---
    const promptList = document.getElementById('prompt-list');
    const promptTitle = document.getElementById('prompt-title');
    const promptContent = document.getElementById('prompt-content');
    const copyBtn = document.getElementById('copy-btn');
    
    // New View Containers
    const welcomeDashboard = document.getElementById('welcome-dashboard');
    const codeViewer = document.getElementById('code-viewer');
    
    // Cache the pipeline nodes
    const pipelineSteps = [
        document.getElementById('step-omni'),
        document.getElementById('step-crawl'),
        document.getElementById('step-engineer'),
        document.getElementById('step-architect')
    ];

    // --- 2. Sidebar & Card Generation ---
    function initSidebar() {
        if (typeof PROMPT_CONFIG === 'undefined') {
            welcomeDashboard.classList.add('hidden');
            codeViewer.classList.remove('hidden');
            promptContent.textContent = "System Error: Neural map (config.js) offline.";
            return;
        }

        PROMPT_CONFIG.forEach(prompt => {
            const li = document.createElement('li');
            
            // Base Tailwind classes for the inactive "Bento Card"
            li.className = 'group cursor-pointer p-4 rounded-xl border border-transparent transition-all duration-200 hover:bg-white/5 hover:border-white/10 relative overflow-hidden';
            li.dataset.file = prompt.file;
            
            li.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-accent-purple bg-accent-purple/10 border border-accent-purple/20">
                        System Module
                    </span>
                    <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg class="w-4 h-4 text-slate-500 hover:text-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    </div>
                </div>
                <h3 class="font-semibold text-slate-300 group-hover:text-white transition-colors text-sm">${prompt.title}</h3>
            `;
            
            li.addEventListener('click', () => triggerPipeline(prompt, li));
            promptList.appendChild(li);
        });
    }

    // --- 3. High-Speed Pipeline Simulation ---
    async function triggerPipeline(prompt, clickedElement) {
        // Toggle Views: Hide Welcome Dashboard, Show Code Viewer
        if (welcomeDashboard && !welcomeDashboard.classList.contains('hidden')) {
            welcomeDashboard.classList.add('hidden');
            codeViewer.classList.remove('hidden');
        }

        // Reset all sidebar items to inactive state
        document.querySelectorAll('#prompt-list li').forEach(item => {
            item.classList.remove('bg-[#16182a]', 'border-borderline', 'shadow-md');
            item.classList.add('border-transparent');
            
            const accent = item.querySelector('.active-indicator');
            if (accent) accent.remove();
        });

        // Apply Active State to clicked element
        clickedElement.classList.remove('border-transparent', 'hover:bg-white/5');
        clickedElement.classList.add('bg-[#16182a]', 'border-borderline', 'shadow-md');
        
        clickedElement.insertAdjacentHTML('afterbegin', '<div class="active-indicator absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-purple to-accent-blue rounded-l-xl shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>');

        // Reset main viewer UI
        copyBtn.classList.add('hidden');
        promptTitle.textContent = "Compiling Payload...";
        promptContent.textContent = "Awaiting data stream from internal storage...";

        // Deterministic Pipeline Flash
        for (let i = 0; i < pipelineSteps.length; i++) {
            if (pipelineSteps[i]) {
                pipelineSteps[i].classList.add('pipeline-active');
                await new Promise(r => setTimeout(r, 150)); 
                pipelineSteps[i].classList.remove('pipeline-active');
            }
        }
        
        // Fire actual network request
        await loadPromptData(prompt);
    }

    // --- 4. Secure File Fetching ---
    async function loadPromptData(prompt) {
        try {
            const response = await fetch(`prompts/${prompt.file}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const text = await response.text();
            
            // Final DOM injection
            promptTitle.textContent = prompt.title;
            promptContent.textContent = text;
            copyBtn.classList.remove('hidden');

        } catch (error) {
            console.error("Failed to load prompt telemetry:", error);
            promptTitle.textContent = "System Fault";
            promptContent.textContent = `Error 404: Payload [${prompt.file}] could not be located in the /prompts directory.`;
        }
    }

    // --- 5. Secure Clipboard Integration ---
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const textToCopy = promptContent.textContent;
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                const originalHTML = copyBtn.innerHTML;
                
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span class="text-green-400">Payload Secured</span>
                `;
                copyBtn.classList.add('border-green-500/50', 'bg-green-500/10');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('border-green-500/50', 'bg-green-500/10');
                }, 2000);
            } catch (err) {
                console.error('Clipboard neural link failed:', err);
                alert('Clipboard access denied. Secure copy failed.');
            }
        });
    }

    // --- IGNITION ---
    initSidebar();
});