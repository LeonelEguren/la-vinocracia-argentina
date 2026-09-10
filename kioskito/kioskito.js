(function () {
    const containerId = 'kioskito-container';
    const container = document.getElementById(containerId);

    if (!container) return;

    async function initKioskito() {
        try {
            const response = await fetch(window.kioskitoHtmlPath || 'kioskito/kioskito.html');
            if (!response.ok) throw new Error(`No se pudo cargar kioskito.html: ${response.status}`);

            container.innerHTML = await response.text();

            // Después de cargar el contenido, verificar si hay un hash en la URL
            // y desplazarse a él si existe.
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            const catalogGrid = document.getElementById('catalogGrid');
            const filterButtons = container.querySelectorAll('.filter-btn');


            let activeFilter = 'all';
            let navbarSearchAttached = false;

            function normalizeValue(value) {
                return String(value || '')
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
            }

            function renderProductsList(lista, mensaje = 'no encontramos el vino que buscas', targetGrid = catalogGrid) {
                targetGrid.innerHTML = '';

                if (lista.length === 0) {
                    targetGrid.innerHTML = `
                        <p class="no-products" style="grid-column: 1/-1; font-family: var(--font-body); text-align: center; color: white; padding: 20px;">
                            ${mensaje}
                        </p>
                    `;
                    return;
                }

                lista.forEach((prod) => {
                    const card = document.createElement('div');
                    card.className = 'wine-card';
                    card.setAttribute('data-category', prod.categoria || '');
                    card.dataset.productId = prod.id || '';
                    card.style.borderRadius = '0';
                    card.style.overflow = 'hidden';
                    card.style.cursor = 'pointer';
                    card.title = 'Ver detalle del producto';

                    const disponible = prod.disponible !== false;
                    const mensajeWa = encodeURIComponent(`¡Hola! Me interesa consultar por el producto: ${prod.nombre}`);
                    const urlWhatsapp = `https://wa.me/5491130604617?text=${mensajeWa}`;
                    const imageUrl = prod.imagen ? encodeURI(prod.imagen) : '';

                    card.innerHTML = `
                        <div class="wine-img-container" style="position: relative; border-radius: 0; overflow: hidden;">
                            <img src="${imageUrl}" alt="${prod.nombre}" class="wine-img" style="border-radius: 0;">
                            ${!disponible ? '<span class="badge badge-error" style="position: absolute; top: 10px; right: 10px; background: #852229; color: white; padding: 5px 10px; font-family: var(--font-body); font-size: 12px; border-radius: 4px; font-weight: bold;">Sin Stock</span>' : ''}
                        </div>
                        <div class="wine-info">
                            <div class="wine-details">
                                <h3 class="wine-title" style="margin: 5px 0; font-family: var(--font-title);">${prod.nombre}</h3>
                                <p class="wine-description" style="margin: 4px 0; font-size: 0.85rem; opacity: 0.9;"><strong>Variedades:</strong> ${prod.variedades || 'Sin información'}</p>
                                <p class="wine-description" style="margin: 4px 0; font-size: 0.85rem; opacity: 0.9;"><strong>Región:</strong> ${prod.region || 'Sin información'}</p>
                                <p class="wine-description" style="margin: 4px 0; font-size: 0.85rem; opacity: 0.9;"><strong>Productor:</strong> ${prod.productor || 'Sin información'}</p>
                                <p class="wine-description" style="margin: 4px 0; font-size: 0.85rem; opacity: 0.9;"><strong>Categoría:</strong> ${prod.categoria || 'Sin información'}</p>
                            </div>
                            <a href="${urlWhatsapp}" target="_blank" class="wine-btn-consultar">
                                ${disponible ? 'Consultar vía WhatsApp' : 'Consultar próxima tanda'}
                            </a>
                        </div>
                    `;

                    card.addEventListener('click', () => {
                        openProductDetail(prod.id);
                    });

                    targetGrid.appendChild(card);

                    const whatsappButton = card.querySelector('.wine-btn-consultar');
                    if (whatsappButton) {
                        whatsappButton.addEventListener('click', (e) => {
                            e.stopPropagation();
                        });
                    }
                });
            }

            function matchesFilter(prod, filterValue) {
                const normalizedFilter = normalizeValue(filterValue);
                const prodFilter = normalizeValue(prod.filter);
                const prodCategory = normalizeValue(prod.categoria);

                if (!normalizedFilter || normalizedFilter === 'all') return true;

                if (prodFilter === normalizedFilter || prodCategory === normalizedFilter) return true;
                if (normalizedFilter === 'tintos' && (prodFilter.includes('tinto') || prodCategory.includes('tinto'))) return true;
                if (normalizedFilter === 'blanco' && (prodFilter.includes('blanco') || prodCategory.includes('blanco'))) return true;
                if (normalizedFilter === 'naranja' && (prodFilter.includes('naranja') || prodCategory.includes('naranja'))) return true;

                return false;
            }

            function setActiveFilterButton(filterValue) {
                const normalizedFilter = normalizeValue(filterValue);
                filterButtons.forEach((btn) => {
                    const btnValue = normalizeValue(btn.getAttribute('data-filter'));
                    btn.classList.toggle('active', btnValue === normalizedFilter);
                });
            }

            function matchesSearch(prod, termino) {
                const searchTerm = normalizeValue(termino);
                if (!searchTerm) return false;

                const campos = [
                    prod.nombre,
                    prod.bodega,
                    prod.variedades,
                    prod.region,
                    prod.productor,
                    prod.categoria,
                    prod.filter
                ];

                return campos.some((campo) => {
                    if (!campo) return false;
                    return normalizeValue(campo).includes(searchTerm);
                });
            }

            function inferFilterFromTerm(termino) {
                const normalizedTerm = normalizeValue(termino);

                if (!normalizedTerm) return 'all';
                if (normalizedTerm.includes('blanco')) return 'blancos';
                if (normalizedTerm.includes('naranja')) return 'naranjos';
                if (normalizedTerm.includes('tinto')) return 'tintos';
                if (normalizedTerm.includes('rosado')) return 'all';

                return 'all';
            }

            function getFilterFromMatches(matches, preferredFilter = activeFilter) {
                const normalizedPreferred = normalizeValue(preferredFilter);
                const categorias = [...new Set(matches.map((prod) => normalizeValue(prod.categoria || prod.filter || 'all')).filter(Boolean))];

                if (categorias.length === 1) {
                    return categorias[0];
                }

                if (normalizedPreferred && normalizedPreferred !== 'all' && matches.some((prod) => matchesFilter(prod, normalizedPreferred))) {
                    return normalizedPreferred;
                }

                return 'all';
            }

            function aplicarCatalogo(termino = '', filtro = activeFilter) {
                const terminoNormalizado = normalizeValue(termino);
                let productosFiltrados = productos;
                let filtroAplicado = filtro || 'all';

                if (terminoNormalizado) {
                    const filtroInferido = inferFilterFromTerm(terminoNormalizado);
                    if (filtroInferido !== 'all') {
                        filtroAplicado = filtroInferido;
                    }

                    productosFiltrados = productos.filter((prod) => matchesSearch(prod, terminoNormalizado));
                    filtroAplicado = getFilterFromMatches(productosFiltrados, filtroAplicado);
                    productosFiltrados = productosFiltrados.filter((prod) => matchesFilter(prod, filtroAplicado));
                } else if (filtroAplicado !== 'all') {
                    productosFiltrados = productos.filter((prod) => matchesFilter(prod, filtroAplicado));
                }

                activeFilter = filtroAplicado;
                setActiveFilterButton(activeFilter);

                if (terminoNormalizado && productosFiltrados.length === 0) {
                    renderProductsList([], 'no encontramos el vino que buscas');
                    return;
                }

                renderProductsList(productosFiltrados);

                if (terminoNormalizado && productosFiltrados.length > 0) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            function ejecutarBusquedaNavbar(termino = '') {
                aplicarCatalogo(termino, activeFilter);
            }

            window.buscarVinosNavbar = ejecutarBusquedaNavbar;

            function getSearchOverlayElements() {
                return {
                    searchOverlay: document.getElementById('search-overlay'),
                    searchOverlayInput: document.getElementById('search-overlay-input'),
                    searchOverlayResults: document.getElementById('search-overlay-results'),
                    searchOverlayClose: document.getElementById('search-overlay-close')
                };
            }

            function updateSearchResults(termino) {
                const { searchOverlayResults } = getSearchOverlayElements();
                if (!searchOverlayResults) return;
                const terminoNormalizado = normalizeValue(termino);
                if (!terminoNormalizado) {
                    searchOverlayResults.innerHTML = '';
                    return;
                }
                const resultados = productos.filter((prod) => matchesSearch(prod, terminoNormalizado));
                renderProductsList(resultados, 'No encontramos vinos para tu búsqueda', searchOverlayResults);
            }

            function openSearchOverlay(termino = '') {
                const { searchOverlay, searchOverlayInput, searchOverlayResults } = getSearchOverlayElements();
                if (!searchOverlay || !searchOverlayInput || !searchOverlayResults) return;
                searchOverlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
                searchOverlayInput.value = termino;
                if (termino.trim()) {
                    updateSearchResults(termino);
                } else {
                    searchOverlayResults.innerHTML = '';
                }
                searchOverlayInput.focus();
            }

            function closeSearchOverlay() {
                const { searchOverlay, searchOverlayInput, searchOverlayResults } = getSearchOverlayElements();
                if (!searchOverlay || !searchOverlayInput || !searchOverlayResults) return;
                searchOverlay.classList.remove('visible');
                document.body.style.overflow = '';
                searchOverlayInput.value = '';
                searchOverlayResults.innerHTML = '';
            }

            // Spanish-friendly wrappers requested by UI: abrirBuscador / cerrarBuscador
            function abrirBuscador(termino = '') {
                openSearchOverlay(termino);
            }

            function cerrarBuscador() {
                closeSearchOverlay();
            }

            // Manejo de tecla ESC para cerrar el overlay cuando esté visible
            document.addEventListener('keydown', (e) => {
                try {
                    const searchOverlay = document.getElementById('search-overlay');
                    if (!searchOverlay) return;
                    if (e.key === 'Escape' || e.key === 'Esc') {
                        if (searchOverlay.classList.contains('visible')) {
                            cerrarBuscador();
                        }
                    }
                } catch (err) {
                    // no-op
                }
            });

            window.openKioskitoSearchOverlay = openSearchOverlay;
            window.closeKioskitoSearchOverlay = closeSearchOverlay;
            // Exponer nombres en español solicitados
            window.abrirBuscador = abrirBuscador;
            window.cerrarBuscador = cerrarBuscador;

            function setupNavbarSearchListeners() {
                const navSearchToggle = document.getElementById('navSearchToggle');
                const navBuscador = document.getElementById('navBuscador');
                const navSearchAction = document.getElementById('navSearchAction');
                const searchOverlay = document.getElementById('search-overlay');
                const searchOverlayInput = document.getElementById('search-overlay-input');
                const searchOverlayClose = document.getElementById('search-overlay-close');

                if (navSearchToggle && searchOverlay && searchOverlayClose) {
                    navSearchToggle.addEventListener('click', () => openSearchOverlay(''));
                    searchOverlayClose.addEventListener('click', closeSearchOverlay);

                    searchOverlay.addEventListener('click', (event) => {
                        if (event.target === searchOverlay) {
                            closeSearchOverlay();
                        }
                    });
                }

                if (searchOverlayInput) {
                    searchOverlayInput.addEventListener('input', (e) => {
                        const termino = e.target.value || '';
                        updateSearchResults(termino);
                    });
                }

                if (navBuscador && navSearchAction) {
                    navSearchAction.addEventListener('click', () => {
                        const termino = navBuscador.value || '';
                        openSearchOverlay(termino);
                    });

                    navBuscador.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            navSearchAction.click();
                        }
                    });
                }
            }

            setupNavbarSearchListeners();
            const navbarRetry = setInterval(setupNavbarSearchListeners, 100);
            setTimeout(() => clearInterval(navbarRetry), 5000);

            filterButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const cat = this.getAttribute('data-filter') || 'all';
                    aplicarCatalogo('', cat);
                });
            });

            function openProductDetail(productId) {
                const prod = productos.find((item) => item.id === productId);
                if (!prod) return;

                const imageUrl = prod.imagen ? encodeURI(prod.imagen) : '';
                const disponible = prod.disponible !== false;
                const mensajeWa = encodeURIComponent(`¡Hola! Me interesa consultar por el producto: ${prod.nombre}`);
                const urlWhatsapp = `https://wa.me/5491130604617?text=${mensajeWa}`;

                document.getElementById('detail-overlay-content').innerHTML = `
                    <div class="detail-overlay-header">
                        <img src="${imageUrl}" alt="${prod.nombre}" class="detail-overlay-img">
                        <div class="detail-overlay-info">
                            <span class="detail-overlay-category">${prod.categoria || 'Producto'}</span>
                            <h2>${prod.nombre}</h2>
                            <p><strong>Bodega:</strong> ${prod.bodega || 'Sin información'}</p>
                            <p><strong>Variantes:</strong> ${prod.variedades || 'Sin información'}</p>
                            <p><strong>Región:</strong> ${prod.region || 'Sin información'}</p>
                            <p><strong>Productor:</strong> ${prod.productor || 'Sin información'}</p>
                            <div class="detail-overlay-meta">
                                ${disponible ? '' : '<span>Sin stock actualmente</span>'}
                                <span>${prod.detalle || 'Descripción breve no disponible para este producto.'}</span>
                            </div>
                            <div class="detail-overlay-actions">
                                <a href="${urlWhatsapp}" target="_blank" class="detail-overlay-whatsapp">Consultar vía WhatsApp</a>
                            </div>
                        </div>
                    </div>
                `;

                const detailOverlay = document.getElementById('detail-overlay');
                detailOverlay.classList.add('visible');
                detailOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }

            function closeProductDetail() {
                const detailOverlay = document.getElementById('detail-overlay');
                detailOverlay.classList.remove('visible');
                detailOverlay.setAttribute('aria-hidden', 'true');
                document.getElementById('detail-overlay-content').innerHTML = '';
                // Si el overlay de búsqueda sigue visible, mantenemos el bloqueo del scroll.
                if (document.getElementById('search-overlay')?.classList.contains('visible')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }

            // --- LÓGICA DEL BUSCADOR DEL NAVBAR Y OVERLAY ---
            function attachNavbarSearchListener() {
                // Conectar el botón de cierre del detalle del producto
                const detailOverlayElement = document.getElementById('detail-overlay');
                const detailOverlayCloseElement = document.getElementById('detail-overlay-close');
                if (detailOverlayElement && detailOverlayCloseElement) {
                    detailOverlayCloseElement.addEventListener('click', closeProductDetail);
                    detailOverlayElement.addEventListener('click', (event) => {
                        if (event.target === detailOverlayElement) closeProductDetail();
                    });
                }
                if (navbarSearchAttached) return;

                const navSearchToggle = document.getElementById('navSearchToggle');
                if (!navSearchToggle) {
                    window.setTimeout(attachNavbarSearchListener, 100);
                    return;
                }

                navbarSearchAttached = true;

                const productos = Array.isArray(window.listaVinos) ? window.listaVinos : [];
                const searchOverlay = document.getElementById('search-overlay');
                const searchOverlayInput = document.getElementById('search-overlay-input');
                const searchOverlayResults = document.getElementById('search-overlay-results');
                const searchOverlayClose = document.getElementById('search-overlay-close');
                const navBuscador = document.getElementById('navBuscador');
                const navSearchAction = document.getElementById('navSearchAction');

                const openSearchOverlay = (termino = '') => {
                    if (!searchOverlay || !searchOverlayInput) return;
                    searchOverlay.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                    searchOverlayInput.value = termino;
                    updateSearchResults(termino);
                    searchOverlayInput.focus();
                };

                const closeSearchOverlay = () => {
                    if (!searchOverlay || !searchOverlayInput || !searchOverlayResults) return;
                    searchOverlay.classList.remove('visible');
                    document.body.style.overflow = '';
                    searchOverlayInput.value = '';
                    searchOverlayResults.innerHTML = '';
                };

                const updateSearchResults = (termino) => {
                    if (!searchOverlayResults) return;
                    const terminoNormalizado = normalizeValue(termino);
                    const resultados = terminoNormalizado ? productos.filter((prod) => matchesSearch(prod, terminoNormalizado)) : productos;
                    renderProductsList(resultados, 'No encontramos vinos para tu búsqueda', searchOverlayResults);
                };

                window.openKioskitoSearchOverlay = openSearchOverlay;
                window.closeKioskitoSearchOverlay = closeSearchOverlay;

                if (searchOverlay && searchOverlayInput && searchOverlayResults && searchOverlayClose) {
                    navSearchToggle.addEventListener('click', () => openSearchOverlay(''));
                    searchOverlayClose.addEventListener('click', closeSearchOverlay);

                    searchOverlay.addEventListener('click', (event) => {
                        if (event.target === searchOverlay) {
                            closeSearchOverlay();
                        }
                    });

                    searchOverlayInput.addEventListener('input', (e) => {
                        const termino = e.target.value;
                        updateSearchResults(termino);
                    });
                }

                if (navBuscador && navSearchAction) {
                    navSearchAction.addEventListener('click', () => {
                        const termino = navBuscador.value || '';
                        openSearchOverlay(termino);
                    });

                    navBuscador.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            navSearchAction.click();
                        }
                    });
                }
            }

            // Inicializamos el catálogo
            renderProductsList(Array.isArray(window.listaVinos) ? window.listaVinos : []);
            document.addEventListener('navbarLoaded', attachNavbarSearchListener);
            attachNavbarSearchListener();
        } catch (error) {
            console.error('Error al cargar kioskito.html:', error);
            container.innerHTML = '<p style="text-align:center; color:white; padding:20px;">No se pudo cargar el catálogo en este momento.</p>';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKioskito);
    } else {
        initKioskito();
    }

})();