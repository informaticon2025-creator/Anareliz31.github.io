window.onload = function() {
    // 1. CARGA DINÁMICA DE ARTÍCULOS DESDE ARCHIVOS TXT
    const articleFiles = ['art1.txt', 'art2.txt', 'art3.txt', 'art4.txt', 'art5.txt', 'art6.txt', 'art7.txt', 'art8.txt', 'art9.txt', 'art10.txt'];
    const container = document.getElementById('articles-container');
    const modal = document.getElementById('article-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close-btn');

    if (container) {
        articleFiles.forEach(file => {
            fetch(`./file/article/${file}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    const parsed = parseArticleText(text);
                    if (parsed && parsed.title) {
                        const articleElem = createArticleCard(parsed);
                        container.appendChild(articleElem);
                    }
                })
                .catch(err => {
                    console.error(`Error al cargar el archivo ./file/article/${file}:`, err);
                });
        });
    }

    function parseArticleText(rawText) {
        const getSection = (tag) => {
            const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\[[A-Z]+\\]|$)`, 'i');
            const match = rawText.match(regex);
            return match ? match[1].trim() : '';
        };

        return {
            title: getSection('TITLE') || 'Sin título',
            image: getSection('IMAGE'),
            description: getSection('DESCRIPTION') || getSection('DESCRITION') || 'Sin descripción',
            shop: getSection('SHOP') || 'Comprar'
        };
    }

    function createArticleCard(data) {
        const card = document.createElement('article');
        card.className = 'article-card';

        const imageHTML = data.image ? `<img src="${data.image}" alt="${data.title}">` : '';

        card.innerHTML = `
            <h2>${data.title}</h2>
            ${imageHTML}
            <p>${data.description}</p>
        `;

        card.addEventListener('click', () => {
            openModal(`
                <div class="modal-article-detail">
                    <h2>${data.title}</h2>
                    ${data.image ? `<div class="modal-img-wrapper"><img src="${data.image}" alt="${data.title}"></div>` : ''}
                    <p class="modal-article-desc">${data.description}</p>
                </div>
            `);
        });

        return card;
    }

    // 2. FUNCIONES DE APERTURA Y CIERRE DE MODAL ESTÁNDAR
    function openModal(contentHTML) {
        if (modalBody && modal) {
            modalBody.innerHTML = contentHTML;
            modal.classList.remove('hidden');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 3. MÓDULO BIOGRAFÍA
    function openBioModal() {
        const bioHTML = `
            <div class="bio-simple-container">
                <h2 class="bio-title">VEN A VISITARNOS</h2>
                <p class="bio-subtitle">DIRÍGETE Y DISFRUTA DE LAS PLAYAS Y SAZÓN EN NUESTRA ZONA.</p>
                
                <div class="map-frame">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        style="border:0" 
                        src="https://maps.google.com/maps?q=Taguao,Vargas,Venezuela&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                        allowfullscreen>
                    </iframe>
                </div>

<div class="photo-card" style="margin-top: 1rem;">
    <h3>Playas Paradisíacas</h3>
    <img src="file/imgs/ex_kiosko-1" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
    <p style="font-size:0.85rem; color:#666; margin-top:0.4rem;">Relájate en la costa de Taguao con las mejores vistas al mar Caribe.</p>
</div>

<div class="photo-card" style="margin-top: 1rem;">
    <h3>Al Gusto Familia</h3>
    <img src="file/imgs/ex_kiosko-2" alt="Foto" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
    <p style="font-size:0.85rem; color:#666; margin-top:0.4rem;">Relájate en la costa de Taguao con las mejores vistas al mar Caribe.</p>
</div>

<div class="photo-card" style="margin-top: 1rem;">
    <h3>Vista al mar Caribe</h3>
    <img src="file/imgs/ex_kiosko-3" alt="Foto" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
    <p style="font-size:0.85rem; color:#666; margin-top:0.4rem;">Relájate en la costa de Taguao con las mejores vistas al mar Caribe.</p>
</div>

<div class="photo-card" style="margin-top: 1rem;">
    <h3>Trae a tus niños</h3>
    <img src="file/imgs/ex_kiosko-4" alt="Foto" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
    <p style="font-size:0.85rem; color:#666; margin-top:0.4rem;">Relájate en la costa de Taguao con las mejores vistas al mar Caribe.</p>
</div>
        `;
        openModal(bioHTML);
    }

    // 4. NAV EVENT LISTENERS
    const btnHome = document.getElementById('nav-home');
    const btnBio = document.getElementById('nav-bio');
    const mobileHome = document.getElementById('mobile-home');
    const mobileBio = document.getElementById('mobile-bio');

    if (btnHome) btnHome.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
    if (mobileHome) mobileHome.addEventListener('click', () => closeModal());

    if (btnBio) btnBio.addEventListener('click', (e) => { e.preventDefault(); openBioModal(); });
    if (mobileBio) mobileBio.addEventListener('click', () => openBioModal());

    const mobileButtons = document.querySelectorAll('.mobile-nav-btn');
    mobileButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            mobileButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 5. CONTROL DRAWER MÓVIL LATERAL
    const hamburgerBtn = document.getElementById('hamburger-toggle-btn');
    const mobileDrawerMenu = document.getElementById('mobile-drawer-menu');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    function openDrawer() {
        if (mobileDrawerMenu && drawerOverlay) {
            mobileDrawerMenu.classList.add('open');
            drawerOverlay.classList.remove('hidden');
        }
    }

    function closeDrawer() {
        if (mobileDrawerMenu && drawerOverlay) {
            mobileDrawerMenu.classList.remove('open');
            drawerOverlay.classList.add('hidden');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // 6. CONTROL DESPLEGABLE CONTACTO DESKTOP
    const contactDropdownBtn = document.getElementById('contact-dropdown-btn');
    const contactDropdownMenu = document.getElementById('contact-dropdown-menu');

    if (contactDropdownBtn && contactDropdownMenu) {
        contactDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            contactDropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!contactDropdownMenu.contains(e.target) && !contactDropdownBtn.contains(e.target)) {
                contactDropdownMenu.classList.add('hidden');
            }
        });
    }

    const btnCopyDesktop = document.getElementById('btn-copy-desktop');
    const toastCopy = document.getElementById('toast-copy');

    if (btnCopyDesktop) {
        btnCopyDesktop.addEventListener('click', () => {
            const phone = btnCopyDesktop.getAttribute('data-phone');
            navigator.clipboard.writeText(phone).then(() => {
                if (contactDropdownMenu) contactDropdownMenu.classList.add('hidden');
                if (toastCopy) {
                    toastCopy.classList.remove('hidden');
                    toastCopy.classList.add('show');
                    setTimeout(() => {
                        toastCopy.classList.add('hidden');
                        toastCopy.classList.remove('show');
                    }, 2500);
                }
            });
        });
    }

    // 7. BOTÓN CONTACTO MÓVIL
    const mobileContactBtn = document.getElementById('mobile-contact-btn');
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', () => {
            const contactHTML = `
                <div class="mobile-contact-container">
                    <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:1rem; text-align:center;">Contacta con Nosotros</h2>
                    <div class="mobile-contact-actions">
                        <a href="https://wa.me/584123691153?text=Hola!%20Deseo%20hacer%20un%20pedido%20en%20Anareliz31" target="_blank" class="btn-contact-modal btn-whatsapp-modal">
                            WhatsApp Directo
                        </a>
                        <a href="tel:+584123691153" class="btn-contact-modal btn-phone-modal">
                            Llamar por Teléfono
                        </a>
                    </div>
                </div>
            `;
            openModal(contactHTML);
        });
    }

    // 8. VISTAS DEL MENÚ DRAWER (SOPORTE, COPYRIGHT, ACERCA DE)
    const btnSupport = document.getElementById('btn-menu-support');
    const btnCopyright = document.getElementById('btn-menu-copyright');
    const btnAbout = document.getElementById('btn-menu-about');

    // SOPORTE: TELEGRAM Y WHATSAPP
    if (btnSupport) {
        btnSupport.addEventListener('click', () => {
            closeDrawer();
            openModal(`
                <div style="text-align:center; padding:0.5rem;">
                    <h2 style="margin-bottom:0.5rem; font-size:1.4rem;">Centro de Soporte</h2>
                    <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.25rem;">Selecciona el canal de tu preferencia para atención personalizada:</p>
                    
                    <div style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="https://t.me/denisonromero" target="_blank" class="btn-contact-modal" style="background-color:#0088cc; color:#fff;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4"/></svg>
                            Telegram
                        </a>
                        <a href="https://wa.me/584264214126?text=Hola!%20Requiero%20soporte%20técnico%20de%20Anareliz31" target="_blank" class="btn-contact-modal btn-whatsapp-modal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            WhatsApp
                        </a>
                    </div>
                </div>
            `);
        });
    }

    // COPYRIGHT
    if (btnCopyright) {
        btnCopyright.addEventListener('click', () => {
            closeDrawer();
            openModal(`
                <div style="text-align:center; padding:0.5rem;">
                    <h2 style="margin-bottom:0.5rem; font-size:1.3rem;">Derechos de Autor</h2>
                    <span style="font-weight:900; font-size:1.2rem; color:var(--brand-red);">ANARELIZ31</span>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin:0.8rem 0;">Plataforma interactiva de comercio local e información digital.</p>
                    
                    <div style="display:flex; justify-content:center; gap:0.8rem; margin:1.2rem 0;">
                        <a href="https://www.instagram.com/anareliskiosco/" target="_blank" class="social-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                        <a href="https://www.facebook.com/profile.php?id=100081042746841&sk=photos" target="_blank" class="social-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                        <a href="https://www.tiktok.com/@invercionesanarelis_31" target="_blank" class="social-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
                    </div>
                    
                    <p style="color:var(--text-muted); font-size:0.75rem; border-top:1px solid #eee; padding-top:0.8rem;">
                        &copy; 2026 Anareliz31. Todos los derechos reservados.
                    </p>
                </div>
            `);
        });
    }

    // ACERCA DE (LOGO + TÉRMINOS)
    if (btnAbout) {
        btnAbout.addEventListener('click', () => {
            closeDrawer();
            openModal(`
                <div style="text-align:center; padding:0.5rem;">
                    <img src="./logo.ico" alt="Logo Anareliz31" style="width:70px; height:70px; object-fit:contain; margin-bottom:0.5rem; filter:drop-shadow(0 2px 6px rgba(229,9,20,0.5));">
                    <h2 style="font-size:1.3rem; margin-bottom:0.5rem;">Acerca de Anareliz31</h2>
                    
                    <div style="text-align:left; font-size:0.82rem; color:var(--text-muted); line-height:1.5; background:#f8f9fa; padding:1rem; border-radius:8px; border:1px solid #eee; max-height:200px; overflow-y:auto; margin-top:0.8rem;">
                        <h4 style="color:#111; margin-bottom:0.3rem;">Términos y Condiciones</h4>
                        <p style="margin-bottom:0.5rem;">Bienvenido a Kiosco Anareliz31. Al utilizar nuestra plataforma digital, aceptas los siguientes términos de servicio:</p>
                        <ul style="padding-left:1.2rem; display:flex; flex-direction:column; gap:0.3rem;">
                            <li>Todos los productos y servicios están sujetos a disponibilidad en el kiosco.</li>
                            <li>Las imágenes mostradas son referenciales.</li>
                            <li>Nos reservamos el derecho de actualizar los precios y servicios sin previo aviso.</li>
                            <li>La atención directa en playa depende del flujo de visitantes y condiciones climáticas.</li>
                        </ul>
                    </div>
                </div>
            `);
        });
    }
};
