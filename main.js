        // Tailwind script
        function initTailwind() {
            // Already included via CDN
        }

        // API Base
        const API_BASE = "https://gutendex.com/books";
        
        // State
        let currentView = 'home';
        let favorites = JSON.parse(localStorage.getItem('novelnest_favorites') || '[]');
        let pinned = JSON.parse(localStorage.getItem('novelnest_pinned') || '[]');
        let currentBook = null;
        let currentReadingBook = null;
        
        // DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            initTailwind();
            renderMoodGrid();
            renderTopics();
            loadHome();
            updateFavCount();
        });
        
        function updateFavCount() {
            document.getElementById('fav-count').textContent = favorites.length;
        }
        
        // Navigation
        function navigateTo(view) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active', 'bg-zinc-800'));
            
            const navItems = document.querySelectorAll('.nav-item');
            if (view === 'home') navItems[0].classList.add('active', 'bg-zinc-800');
            else if (view === 'trending') navItems[1].classList.add('active', 'bg-zinc-800');
            else if (view === 'library') navItems[2].classList.add('active', 'bg-zinc-800');
            
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('trending-view').classList.add('hidden');
            document.getElementById('search-view').classList.add('hidden');
            document.getElementById('library-view').classList.add('hidden');
            
            document.getElementById(view + '-view').classList.remove('hidden');
            document.getElementById('view-title').textContent = {
                'home': 'Discover',
                'trending': 'Trending',
                'library': 'My Library'
            }[view];
            
            currentView = view;
            
            if (view === 'trending') loadTrendingFull();
            if (view === 'library') loadLibrary();
        }
        
        // Fetch helper
        async function fetchBooks(params = {}) {
            let url = API_BASE + '?languages=en&sort=popular';
            
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    url += `&${key}=${encodeURIComponent(params[key])}`;
                }
            });
            
            try {
                const res = await fetch(url);
                const data = await res.json();
                return data.results || [];
            } catch (e) {
                console.error(e);
                return [];
            }
        }
        
        // Render book card
        function createBookCard(book) {
            const cover = book.formats['image/jpeg'] || 'https://picsum.photos/id/' + (book.id % 100) + '/300/400';
            
            const div = document.createElement('div');
            div.className = `book-card bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer group`;
            div.innerHTML = `
                <div class="relative">
                    <img src="${cover}" class="w-full aspect-[5/7] object-cover" alt="${book.title}">
                    <div class="absolute top-3 right-3 bg-black/70 text-[10px] px-2 py-1 rounded-xl font-mono">
                        ${book.download_count.toLocaleString()}
                    </div>
                </div>
                <div class="p-4">
                    <div class="font-semibold line-clamp-2 leading-tight group-hover:text-rose-400 transition-colors">${book.title}</div>
                    <div class="text-xs text-zinc-400 mt-2">${book.authors.map(a => a.name).join(', ')}</div>
                </div>
            `;
            div.onclick = () => showBookDetail(book);
            return div;
        }
        
        // Load Home
        async function loadHome() {
            // Trending
            const trendingBooks = await fetchBooks({});
            const trendingGrid = document.getElementById('trending-grid');
            trendingGrid.innerHTML = '';
            trendingBooks.slice(0, 12).forEach(book => {
                trendingGrid.appendChild(createBookCard(book));
            });
            
            // Hero
            if (trendingBooks.length > 0) {
                const heroBook = trendingBooks[0];
                document.getElementById('hero-image').src = heroBook.formats['image/jpeg'] || 'https://picsum.photos/id/1015/1200/600';
                document.getElementById('hero-title').textContent = heroBook.title;
                document.getElementById('hero-author').textContent = heroBook.authors.map(a => a.name).join(', ');
                window.currentHeroBook = heroBook;
            }
        }
        
        function readBookFromHero() {
            if (window.currentHeroBook) {
                showBookDetail(window.currentHeroBook);
            }
        }
        
        // Load full trending
        async function loadTrendingFull() {
            const books = await fetchBooks({});
            const grid = document.getElementById('trending-full-grid');
            grid.innerHTML = '';
            books.forEach(book => {
                grid.appendChild(createBookCard(book));
            });
        }
        
        // Topics
        const popularTopics = [
            {name: "Romance", slug: "romance"},
            {name: "Mystery", slug: "mystery"},
            {name: "Adventure", slug: "adventure"},
            {name: "Sci-Fi", slug: "science fiction"},
            {name: "Horror", slug: "horror"},
            {name: "Classics", slug: "classic"},
            {name: "Fantasy", slug: "fantasy"},
            {name: "History", slug: "history"}
        ];
        
        function renderTopics() {
            const container = document.getElementById('topics-grid');
            container.innerHTML = '';
            
            popularTopics.forEach(topic => {
                const div = document.createElement('div');
                div.className = `bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500 transition-all rounded-3xl p-6 cursor-pointer text-center`;
                div.innerHTML = `
                    <div class="text-4xl mb-4">📖</div>
                    <div class="font-semibold">${topic.name}</div>
                `;
                div.onclick = () => searchByTopic(topic.slug);
                container.appendChild(div);
            });
        }
        
        async function searchByTopic(topic) {
            navigateTo('search');
            document.getElementById('search-header').innerHTML = `
                <div class="text-3xl heading-font">Books about <span class="text-rose-400">${topic}</span></div>
            `;
            
            const books = await fetchBooks({topic: topic});
            renderSearchResults(books);
        }
        
        // Mood grid (similar to topics)
        function renderMoodGrid() {
            const moods = [
                {emoji: "❤️", label: "Love"},
                {emoji: "🕵️", label: "Mystery"},
                {emoji: "🧙", label: "Magic"},
                {emoji: "🌌", label: "Space"},
                {emoji: "🏰", label: "History"},
                {emoji: "👻", label: "Spooky"}
            ];
            
            const container = document.getElementById('mood-grid');
            container.innerHTML = '';
            
            moods.forEach(mood => {
                const div = document.createElement('div');
                div.className = `bg-zinc-800 hover:bg-rose-500 hover:text-white rounded-2xl p-4 text-center cursor-pointer transition-all`;
                div.innerHTML = `
                    <div class="text-4xl mb-2">${mood.emoji}</div>
                    <div class="text-sm font-medium">${mood.label}</div>
                `;
                div.onclick = () => {
                    const topicMap = {
                        "Love": "romance",
                        "Mystery": "mystery",
                        "Magic": "fantasy",
                        "Space": "science fiction",
                        "History": "history",
                        "Spooky": "horror"
                    };
                    searchByTopic(topicMap[mood.label]);
                };
                container.appendChild(div);
            });
        }
        
        // Search handler
        let searchTimeout = null;
        
        async function handleSearch(e) {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim();
            if (!query) {
                if (currentView === 'search') navigateTo('home');
                return;
            }
            
            searchTimeout = setTimeout(async () => {
                navigateTo('search');
                document.getElementById('search-header').innerHTML = `
                    <div class="text-3xl heading-font">Results for "<span class="text-rose-400">${query}</span>"</div>
                `;
                
                const books = await fetchBooks({search: query});
                renderSearchResults(books);
            }, 400);
        }
        
        function renderSearchResults(books) {
            const grid = document.getElementById('search-grid');
            grid.innerHTML = '';
            
            if (books.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center py-20 text-zinc-500">No books found.</div>`;
                return;
            }
            
            books.forEach(book => {
                grid.appendChild(createBookCard(book));
            });
        }
        
        // Book Detail
        async function showBookDetail(book) {
            currentBook = book;
            
            const cover = book.formats['image/jpeg'] || `https://picsum.photos/id/${book.id % 200}/800/1000`;
            
            let formatsHTML = '';
            Object.keys(book.formats).forEach(mime => {
                if (mime.includes('image')) return;
                const url = book.formats[mime];
                let label = mime.split('/').pop().toUpperCase();
                if (mime.includes('epub')) label = 'EPUB';
                if (mime.includes('mobi')) label = 'Kindle';
                if (mime.includes('plain')) label = 'Plain Text';
                
                formatsHTML += `
                    <a href="${url}" target="_blank" 
                       class="block bg-zinc-800 hover:bg-zinc-700 px-6 py-4 rounded-2xl text-sm flex justify-between items-center">
                        <span>${label}</span>
                        <i class="fa-solid fa-download"></i>
                    </a>
                `;
            });
            
            const subjects = book.subjects ? book.subjects.slice(0, 6).map(s => 
                `<span onclick="searchByTopic('${s.toLowerCase()}')" class="bg-zinc-800 text-xs px-4 py-2 rounded-3xl cursor-pointer hover:bg-rose-500">${s}</span>`
            ).join('') : '';
            
            const html = `
                <div class="flex gap-12">
                    <!-- Cover -->
                    <div class="w-80 flex-shrink-0">
                        <img src="${cover}" class="rounded-3xl shadow-2xl" alt="">
                        
                        <div class="mt-8 flex flex-col gap-3">
                            ${formatsHTML}
                        </div>
                    </div>
                    
                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-4xl heading-font leading-none">${book.title}</h1>
                                <p class="text-xl text-zinc-400 mt-3">${book.authors.map(a => a.name).join(' • ')}</p>
                            </div>
                            
                            <div onclick="toggleFavorite()" id="fav-btn"
                                 class="w-12 h-12 flex items-center justify-center text-3xl cursor-pointer ${isFavorite(book) ? 'text-rose-500' : 'text-zinc-600 hover:text-rose-400'}">
                                ❤️
                            </div>
                        </div>
                        
                        <div class="flex gap-6 mt-8">
                            <div>
                                <div class="uppercase text-xs tracking-widest text-zinc-500">Downloads</div>
                                <div class="text-4xl font-mono font-bold">${book.download_count.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="uppercase text-xs tracking-widest text-zinc-500">Language</div>
                                <div class="text-2xl">${book.languages.join(', ')}</div>
                            </div>
                        </div>
                        
                        ${book.summaries && book.summaries.length ? `
                        <div class="mt-10">
                            <div class="uppercase text-xs tracking-widest text-zinc-500 mb-3">Summary</div>
                            <p class="text-zinc-400 leading-relaxed">${book.summaries[0]}</p>
                        </div>` : ''}
                        
                        <div class="mt-10">
                            <div class="uppercase text-xs tracking-widest text-zinc-500 mb-4">Topics</div>
                            <div class="flex flex-wrap gap-2">
                                ${subjects}
                            </div>
                        </div>
                        
                        <button onclick="startReading()" 
                                class="mt-12 w-full bg-gradient-to-r from-rose-500 to-pink-600 py-6 rounded-3xl text-xl font-semibold flex items-center justify-center gap-4">
                            <i class="fa-solid fa-book-open"></i>
                            Read Now — It's Free
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-content').innerHTML = html;
            document.getElementById('detail-modal').classList.remove('hidden');
        }
        
        function closeModal() {
            document.getElementById('detail-modal').classList.add('hidden');
        }
        
        // Favorite
        function isFavorite(book) {
            return favorites.some(f => f.id === book.id);
        }
        
        function toggleFavorite() {
            if (!currentBook) return;
            
            if (isFavorite(currentBook)) {
                favorites = favorites.filter(f => f.id !== currentBook.id);
            } else {
                favorites.push(currentBook);
            }
            
            localStorage.setItem('novelnest_favorites', JSON.stringify(favorites));
            updateFavCount();
            
            // Refresh button
            document.getElementById('fav-btn').classList.toggle('text-rose-500', isFavorite(currentBook));
            document.getElementById('fav-btn').classList.toggle('text-zinc-600', !isFavorite(currentBook));
        }
        
        // Reading
        async function startReading() {
            closeModal();
            currentReadingBook = currentBook;
            
            document.getElementById('reader-title').textContent = currentBook.title;
            document.getElementById('reader-author').textContent = currentBook.authors.map(a => a.name).join(', ');
            
            document.getElementById('reader-modal').classList.remove('hidden');
            
            const readerText = document.getElementById('reader-text');
            readerText.innerHTML = `<div class="flex items-center justify-center h-96"><div class="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div></div>`;
            
            // Find best reading format
            let textUrl = null;
            
            // Prefer plain text
            if (currentBook.formats['text/plain; charset=utf-8']) {
                textUrl = currentBook.formats['text/plain; charset=utf-8'];
            } else if (currentBook.formats['text/plain']) {
                textUrl = currentBook.formats['text/plain'];
            } else if (currentBook.formats['text/html; charset=utf-8']) {
                textUrl = currentBook.formats['text/html; charset=utf-8'];
            } else if (currentBook.formats['text/html']) {
                textUrl = currentBook.formats['text/html'];
            }
            
            if (!textUrl) {
                readerText.innerHTML = `<div class="text-center py-20 text-zinc-400">Sorry, no readable text available for this book.<br><br><a href="#" onclick="downloadCurrentBook();return false" class="underline">Download instead</a></div>`;
                return;
            }
            
            try {
                const res = await fetch(textUrl);
                let text = await res.text();
                
                // Clean up plain text a bit
                if (textUrl.includes('plain')) {
                    text = text.replace(/\r\n/g, '\n\n');
                    text = text.split('\n').map(line => line.trim()).filter(line => line).join('\n\n');
                }
                
                readerText.innerHTML = `<div class="reader-content">${text.replace(/\n\n/g, '</p><p>')}</div>`;
            } catch (e) {
                readerText.innerHTML = `<div class="text-center py-20 text-rose-400">Failed to load book content. Try downloading instead.</div>`;
            }
        }
        
        function closeReader() {
            document.getElementById('reader-modal').classList.add('hidden');
            document.getElementById('reader-text').innerHTML = '';
        }
        
        function downloadCurrentBook() {
            if (!currentReadingBook) return;
            
            // Find first downloadable format
            for (let mime in currentReadingBook.formats) {
                if (mime.includes('epub') || mime.includes('mobi') || mime.includes('plain') || mime.includes('pdf')) {
                    const url = currentReadingBook.formats[mime];
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentReadingBook.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return;
                }
            }
        }
        
        // Library
        function toggleLibrary() {
            navigateTo('library');
        }
        
        function loadLibrary() {
            // Favorites tab
            const favGrid = document.getElementById('favorites-grid');
            favGrid.innerHTML = '';
            favorites.forEach(book => {
                favGrid.appendChild(createBookCard(book));
            });
            
            // Pinned (for now, reuse favorites as example)
            const pinnedGrid = document.getElementById('pinned-grid');
            pinnedGrid.innerHTML = '';
            // Demo: show first 6 favorites as pinned
            favorites.slice(0, 8).forEach(book => {
                pinnedGrid.appendChild(createBookCard(book));
            });
        }
        
        function switchLibraryTab(tab) {
            document.querySelectorAll('.library-tab').forEach((el, i) => {
                if (i === tab) {
                    el.classList.add('border-rose-500', 'text-white');
                } else {
                    el.classList.remove('border-rose-500', 'text-white');
                }
            });
            
            document.getElementById('favorites-grid').classList.toggle('hidden', tab !== 0);
            document.getElementById('pinned-grid').classList.toggle('hidden', tab !== 1);
        }
        
        // Random book
        async function showRandomBook() {
            const books = await fetchBooks({});
            const random = books[Math.floor(Math.random() * books.length)];
            showBookDetail(random);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.getElementById('search-input') !== document.activeElement) {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
        });
        
        // Initial active nav
        setTimeout(() => {
            document.querySelector('.nav-item').classList.add('active', 'bg-zinc-800');
        }, 100);
