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

            function normalizeValue(value) {
                return String(value || '')
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
            }

            function matchesFilter(prod, filterValue) {
                const normalizedFilter = normalizeValue(filterValue);
                const prodFilter = normalizeValue(prod.filter);
                const prodCategory = normalizeValue(prod.categoria);

                if (!normalizedFilter || normalizedFilter === 'all') return true;

                if (prodFilter === normalizedFilter || prodCategory === normalizedFilter) {
                    return true;
                }

                if (normalizedFilter === 'tintos' && (prodFilter.includes('tinto') || prodCategory.includes('tinto'))) {
                    return true;
                }

                if (normalizedFilter === 'blanco' && (prodFilter.includes('blanco') || prodCategory.includes('blanco'))) {
                    return true;
                }

                if (normalizedFilter === 'naranja' && (prodFilter.includes('naranja') || prodCategory.includes('naranja'))) {
                    return true;
                }

                return false;
            }

            function renderProducts(filterValue = 'all') {
                catalogGrid.innerHTML = '';

                const filtrados = filterValue === 'all'
                    ? productos
                    : productos.filter((prod) => matchesFilter(prod, filterValue));

                if (filtrados.length === 0) {
                    catalogGrid.innerHTML = `
                        <p class="no-products" style="grid-column: 1/-1; font-family: var(--font-body); text-align: center; color: white; padding: 20px;">
                            Próximamente más ingresos en esta categoría.
                        </p>
                    `;
                    return;
                }

                filtrados.forEach((prod) => {
                    const card = document.createElement('div');
                    card.className = 'wine-card';
                    card.setAttribute('data-category', prod.categoria || '');
                    card.style.borderRadius = '0';
                    card.style.borderTopLeftRadius = '0';
                    card.style.borderTopRightRadius = '0';
                    card.style.borderBottomLeftRadius = '0';
                    card.style.borderBottomRightRadius = '0';
                    card.style.overflow = 'hidden';
                    card.style.clipPath = 'none';

                    const disponible = prod.disponible !== false;
                    const mensajeWa = encodeURIComponent(`¡Hola! Me interesa consultar por el producto: ${prod.nombre}`);
                    const urlWhatsapp = `https://wa.me/5491130604617?text=${mensajeWa}`;

                    const imageUrl = prod.imagen ? encodeURI(prod.imagen) : '';

                    card.innerHTML = `
                        <div class="wine-img-container" style="position: relative; border-radius: 0; overflow: hidden; clip-path: none;">
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

            filterButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    filterButtons.forEach((btn) => btn.classList.remove('active'));
                    this.classList.add('active');
                    renderProducts(this.getAttribute('data-filter'));
                });
            });

            renderProducts('all');
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
