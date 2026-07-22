(function () {
    const containerId = 'kioskito-container';
    const container = document.getElementById(containerId);

    if (!container) return;

    const productos = Array.isArray(window.listaVinos) ? window.listaVinos : [];

    async function initKioskito() {
        try {
            const response = await fetch('kioskito.html');
            if (!response.ok) throw new Error(`No se pudo cargar kioskito.html: ${response.status}`);

            container.innerHTML = await response.text();

            const catalogGrid = document.getElementById('catalogGrid');
            const filterButtons = container.querySelectorAll('.filter-btn');

            if (!catalogGrid) return;

            let activeFilter = 'all';
            let navbarSearchAttached = false;

            function normalizeValue(value) {
                return String(value || '')
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
            }

            function renderProductsList(lista, mensaje = 'no encontramos el vino que buscas') {
                catalogGrid.innerHTML = '';

                if (lista.length === 0) {
                    catalogGrid.innerHTML = `
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
                    card.style.borderRadius = '0';
                    card.style.overflow = 'hidden';

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
                                ${disponible ? 'Consultar Vía WhatsApp' : 'Consultar Próxima Tanda'}
                            </a>
                        </div>
                    `;
                    catalogGrid.appendChild(card);
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
                const campos = [
                    prod.nombre,
                    prod.bodega,
                    prod.variedades,
                    prod.region,
                    prod.productor,
                    prod.categoria,
                    prod.filter
                ];

                return campos.some((campo) => normalizeValue(campo).includes(termino));
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

            filterButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const cat = this.getAttribute('data-filter') || 'all';
                    aplicarCatalogo('', cat);
                });
            });

            // Inicializamos el catálogo
            renderProductsList(productos);

            // --- LÓGICA DEL BUSCADOR DEL NAVBAR PARA EL INDEX ---
            function attachNavbarSearchListener() {
                if (navbarSearchAttached) return;

                const navBuscador = document.getElementById('navBuscador');
                if (!navBuscador) {
                    window.setTimeout(attachNavbarSearchListener, 100);
                    return;
                }

                navbarSearchAttached = true;
                navBuscador.placeholder = 'Buscar vinos';
                navBuscador.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        ejecutarBusquedaNavbar(e.target.value);
                    }
                });

                const navSearchAction = document.getElementById('navSearchAction');
                if (navSearchAction) {
                    navSearchAction.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        ejecutarBusquedaNavbar(navBuscador.value);
                    });
                }

                document.addEventListener('navbarSearchRequested', (event) => {
                    const value = event.detail?.value ?? navBuscador.value;
                    ejecutarBusquedaNavbar(value);
                });
            }

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