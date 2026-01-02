/**
 * APP.JS - MINISTERIO DE ALABANZA
 * Integridad Absoluta: Código Completo
 */

// ================= CONFIGURACIÓN =================
// URL PROPORCIONADA POR EL USUARIO
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyevrQgX1ifj-hKDnkZBXuoSA_M6blg3zz3rbC-9In7QrXbn5obsCxZZbDj7sl5aQMxxA/exec";

// ================= PUENTE DE CONEXIÓN =================
async function callGasApi(action, payload = {}, password = "") {
    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify({ action, payload, password })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error API:", error);
        return { status: "error", message: "Error de conexión con el script." };
    }
}

// ================= INICIO DE TU CÓDIGO REACT ORIGINAL =================
const html = htm.bind(React.createElement);
const { useState, useEffect } = React;

// --- ICONOS SVG ---
const Icon = {
    ArrowLeft: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    ArrowRight: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    Calendar: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>`,
    Music: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    Users: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Plus: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    Trash: () => html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    Check: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>`,
    Copy: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    Fire: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    Dove: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12c-4 0-7-4-7-4s4 4 2 9a4 4 0 0 1-4 4c-3 0-5-3-5-6s-2-4-5-5L2 9a2 2 0 0 1 0-3l3-3a6 6 0 0 1 6 0l4 4a5 5 0 0 1 5 5 2 2 0 0 1 2 0z"/></svg>`,
    Hand: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`, 
    Ring: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>`, 
    Gift: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.9 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
    Info: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    List: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    WhatsApp: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
    Lock: () => html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    Unlock: () => html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
    Activity: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    Wrench: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    History: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`
};

// --- SEGURIDAD Y UTILIDADES CORE ---
const SafeText = ({ content }) => {
    if (content === null || content === undefined) return "";
    if (typeof content === 'string' || typeof content === 'number') return content;
    try { return ""; } catch (e) { return ""; }
};

const safeJoin = (list, separator = ', ') => {
    if (!Array.isArray(list)) return "";
    return list
        .map(item => { if (typeof item === 'object') return ""; return String(item); })
        .filter(i => i !== "")
        .join(separator);
};

const formatTonoDisplay = (rawTono) => {
    try {
        if (!rawTono) return "";
        if (typeof rawTono === 'string' && rawTono.trim().startsWith('{')) {
            const obj = JSON.parse(rawTono);
            return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' | ');
        }
        if (typeof rawTono === 'object') {
             return Object.entries(rawTono).map(([k, v]) => `${k}: ${v}`).join(' | ');
        }
        return String(rawTono);
    } catch(e) {
        return String(rawTono);
    }
};

const getBestTone = (rawTono, currentVocalist) => {
    try {
        if (!rawTono) return "";
        let obj = rawTono;
        if (typeof rawTono === 'string' && rawTono.trim().startsWith('{')) {
            try { obj = JSON.parse(rawTono); } catch(e) { return rawTono; }
        }
        if (typeof obj === 'object' && obj !== null) {
            return String(obj[currentVocalist] || obj["Original"] || "");
        }
        return String(rawTono);
    } catch(e) {
        return "";
    }
};

// --- COMPONENTE LOGS ---
function ActivityModal({ onClose }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        callGasApi('getRecentActivity').then(res => {
            if(res.status === 'success') {
                setLogs(res.data);
            }
            setLoading(false);
        });
    }, []);

    return html`
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 fade-in">
            <div className="glass-gold p-6 rounded-2xl w-full max-w-lg h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif text-white flex items-center gap-2"><${Icon.Activity} /> Bitácora</h2>
                    <button onClick=${onClose} className="text-slate-400 p-2">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
                    ${loading ? html`<div className="text-center text-yellow-500 mt-10"><div className="animate-spin h-6 w-6 border-2 border-yellow-500 rounded-full border-t-transparent mx-auto mb-2"></div>Cargando...</div>` :
                    logs.length === 0 ? html`<div className="text-center text-slate-500 mt-10">Sin actividad reciente.</div>` :
                    logs.map((log, i) => html`
                        <div key=${i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-xs">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span className="font-mono text-yellow-500"><${SafeText} content=${log.fecha} /> <${SafeText} content=${log.hora} /></span>
                                <span className="font-bold"><${SafeText} content=${log.accion} /></span>
                            </div>
                            <div className="text-slate-300"><${SafeText} content=${log.detalle} /></div>
                        </div>
                    `)}
                </div>
            </div>
        </div>
    `;
}

// --- COMPONENTE SPLASH SCREEN ---
function SplashScreen() {
    return html`
        <div className="bg-[#020617] h-screen w-screen flex flex-col items-center justify-center fixed top-0 left-0 z-[100] fade-in text-center px-6">
            <div className="mb-6 animate-pulse text-yellow-500">
                <${Icon.Music} style=${{width: 60, height: 60}} />
            </div>
            <h1 className="text-3xl font-serif text-white mb-2 tracking-widest font-bold">GRUPO DE ALABANZA</h1>
            <h2 className="text-xl font-cinzel text-yellow-500 tracking-[0.2em] mb-12">ICC VILLA ROSARIO</h2>
            
            <div className="absolute bottom-10 left-0 right-0 text-center opacity-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Creado por</p>
                <p className="text-xs font-bold text-white uppercase tracking-wider mt-1">Gerson Arrieta</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">A.S.T. ARRIETA SOLUCIONES TECNOLOGICAS</p>
            </div>
        </div>
    `;
}

// --- COMPONENTE MANUAL ---
function Manual({ onClose }) {
    const handleCloseForever = () => {
        localStorage.setItem('icc_tutorial_seen', 'true');
        onClose();
    };

    return html`
        <div className="fixed inset-0 bg-black/90 z-[90] flex items-center justify-center p-4 fade-in">
            <div className="glass-gold p-6 rounded-2xl max-w-sm w-full text-center border border-yellow-500/30">
                <div className="text-yellow-500 mb-4 flex justify-center"><${Icon.Info} style=${{width: 40, height: 40}} /></div>
                <h2 className="text-xl font-serif text-white mb-4">Bienvenido al Sistema</h2>
                <div className="text-left space-y-4 text-sm text-slate-300 mb-6">
                    <div className="flex gap-3">
                        <div className="bg-slate-800 p-2 rounded-lg h-fit"><${Icon.Music} /></div>
                        <div><strong className="text-white block">Banco de Canciones</strong>Agrega tus temas. Ahora soporta tonos por vocalista.</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-800 p-2 rounded-lg h-fit"><${Icon.Calendar} /></div>
                        <div><strong className="text-white block">Próximos Servicios</strong>Selecciona tu repertorio y ajusta tus tonos personales.</div>
                    </div>
                </div>
                <button onClick=${handleCloseForever} className="w-full bg-yellow-600 py-3 rounded-xl font-bold text-black mb-2 shadow-lg">Entendido</button>
                <button onClick=${onClose} className="text-slate-500 text-xs underline">Cerrar por ahora</button>
            </div>
        </div>
    `;
}

// --- APP CORE ---
function App() {
    const [view, setView] = useState('HOME');
    const [data, setData] = useState({ canciones: [], equipo: [], servicios: [], equiposMant: [], historial: [] });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentService, setCurrentService] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [showSplash, setShowSplash] = useState(true);
    const [showManual, setShowManual] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => { 
        const savedSession = localStorage.getItem('icc_admin');
        if(savedSession === 'true') setIsAdmin(true);
        setTimeout(() => {
            setShowSplash(false);
            const tutorialSeen = localStorage.getItem('icc_tutorial_seen');
            if (!tutorialSeen) setShowManual(true);
        }, 3500);
        fetchData(); 
    }, []);

    const fetchData = () => {
        callGasApi('getInitialData').then(res => {
            if (res.status === 'success') setData(res.data);
            setLoading(false);
        });
    };

    const handleLogin = () => {
        if(passwordInput === '1234' || passwordInput === '6991') { 
            setIsAdmin(true);
            localStorage.setItem('icc_admin', 'true');
            setShowLogin(false);
            setPasswordInput("");
        } else {
            alert("Contraseña incorrecta");
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        localStorage.removeItem('icc_admin');
    };

    const handleSaveService = (srv) => {
        setLoading(true);
        const pass = '1234'; 
        callGasApi('saveService', srv, pass).then(res => {
            if (res.status === 'success') {
                setData(res.data);
                setView('HOME');
            } else {
                alert("Error al guardar: " + res.message);
            }
            setLoading(false);
        });
    };

    const handleDeleteService = (id) => {
         if(!confirm("¿Estás seguro de ELIMINAR este servicio? Esta acción no se puede deshacer.")) return;
         setLoading(true);
         callGasApi('deleteService', {id: id}, '1234').then(res => {
             if (res.status === 'success') {
                setData(res.data);
                setView('HOME');
             } else {
                 alert("Error: " + res.message);
             }
             setLoading(false);
         });
    };

    const handleGenerateHistory = (id) => {
        if(!confirm("¿Deseas cerrar el servicio y generar el reporte historial?")) return;
        setLoading(true);
        callGasApi('generateHistory', { idServicio: id }, '1234').then(res => {
            if(res.status === 'success') { 
                setData(res.data); 
                alert("Historial generado correctamente.");
                setView('HISTORY');
            } else {
                alert("Error: " + res.message);
            }
            setLoading(false);
        });
    };

    if (showSplash) return html`<${SplashScreen} />`;
    if (loading) return html`
        <div className="bg-universe h-screen flex flex-col items-center justify-center text-yellow-500 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
            <span className="font-cinzel text-xs tracking-widest">CARGANDO RECURSOS...</span>
        </div>
    `;
    
    return html`
        <div className="bg-universe min-h-screen pb-12 font-sans text-slate-200">
            ${showManual && html`<${Manual} onClose=${() => setShowManual(false)} />`}
            ${showLogs && html`<${ActivityModal} onClose=${() => setShowLogs(false)} />`}
            
            ${view !== 'HOME' && html`
                <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur border-b border-white/5 p-4 flex items-center shadow-lg">
                    <button onClick=${() => setView('HOME')} className="bg-slate-800 p-2 rounded-full mr-3 text-slate-300 btn-active">
                        <${Icon.ArrowLeft} />
                    </button>
                    <h2 className="font-bold text-white uppercase tracking-wider text-sm">
                        ${view === 'SONGS' ? 'Banco de Canciones' : view === 'TEAM' ? 'Equipo' : view === 'POSTER' ? 'Cronograma' : view === 'MAINTENANCE' ? 'Mantenimiento' : view === 'HISTORY' ? 'Historial' : 'Servicio'}
                    </h2>
                </div>
            `}

            <div className="px-4 pt-6 max-w-lg mx-auto fade-in">
                ${view === 'HOME' && html`
                    <div className="flex justify-between items-center mb-4">
                        ${isAdmin && html`<button onClick=${() => setShowLogs(true)} className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded flex gap-1 items-center"><${Icon.Activity}/> Logs</button>`}
                        
                        <div className="flex-1 text-right">
                        ${!isAdmin ? 
                            html`<button onClick=${()=>setShowLogin(true)} className="text-xs text-slate-500 flex items-center gap-1 ml-auto"><${Icon.Lock}/> Director</button>` : 
                            html`<button onClick=${handleLogout} className="text-xs text-yellow-500 flex items-center gap-1 font-bold ml-auto"><${Icon.Unlock}/> Salir</button>`
                        }
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <div className="inline-block px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-3">
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.2em]">ICC Villa Rosario</span>
                        </div>
                        <h1 className="text-3xl font-serif text-white italic">Panel de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 font-cinzel font-bold not-italic">Adoración</span></h1>
                    </div>

                    <${UpcomingServicesList} servicios=${data.servicios} 
                        onEdit=${(s) => { setCurrentService(s); setView('SERVICE_EDITOR'); }}
                        onNew=${() => { 
                            if(isAdmin) {
                                setCurrentService({ id: null, fecha: new Date().toISOString().split('T')[0], jornada: 'Mañana', estado: 'Borrador', lider: '', coristas: [], musicos: [], repertorio: [] }); 
                                setView('SERVICE_EDITOR'); 
                            } else {
                                alert("Solo el Director crea servicios.");
                            }
                        }}
                        onHistory=${handleGenerateHistory}
                        isAdmin=${isAdmin}
                    />

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick=${() => setView('POSTER')} className="glass-gold p-4 rounded-xl flex flex-col items-center gap-2 btn-active">
                            <${Icon.Calendar} />
                            <span className="font-bold text-xs text-yellow-100">Ver Cronograma</span>
                        </button>
                        
                        <button onClick=${() => setView('HISTORY')} className="glass p-4 rounded-xl flex flex-col items-center gap-2 btn-active hover:bg-slate-800 border border-slate-700">
                             <${Icon.History} />
                             <span className="font-bold text-xs text-white">Ver Historial</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <button onClick=${() => setView('SONGS')} className="w-full glass p-4 rounded-xl flex items-center justify-between btn-active">
                            <div className="flex items-center gap-4">
                                <div className="text-orange-400"><${Icon.Music} /></div>
                                <div className="text-left">
                                    <div className="font-bold text-white text-sm">Banco de Canciones</div>
                                    <div className="text-xs text-slate-500">Agregar temas</div>
                                </div>
                            </div>
                        </button>
                        <button onClick=${() => setView('TEAM')} className="w-full glass p-4 rounded-xl flex items-center justify-between btn-active">
                            <div className="flex items-center gap-4">
                                <div className="text-teal-400"><${Icon.Users} /></div>
                                <div className="text-left">
                                    <div className="font-bold text-white text-sm">Equipo de Alabanza</div>
                                    <div className="text-xs text-slate-500">Ver listado</div>
                                </div>
                            </div>
                        </button>
                        
                         <button onClick=${() => setView('MAINTENANCE')} className="w-full glass p-4 rounded-xl flex items-center justify-between btn-active border-l-4 border-l-purple-500">
                            <div className="flex items-center gap-4">
                                <div className="text-purple-400"><${Icon.Wrench} /></div>
                                <div className="text-left">
                                    <div className="font-bold text-white text-sm">Mantenimiento</div>
                                    <div className="text-xs text-slate-500">Equipos e Instrumentos</div>
                                </div>
                            </div>
                        </button>
                    </div>
                    
                    <div className="mt-8 text-center opacity-30">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">A.S.T. Soluciones Tecnológicas</p>
                    </div>
                `}

                ${view === 'TEAM' && html`<${TeamManager} data=${data.equipo} isAdmin=${isAdmin} refresh=${fetchData} />`}
                ${view === 'SONGS' && html`<${SongManager} data=${data.canciones} equipo=${data.equipo} isAdmin=${isAdmin} refresh=${fetchData} />`}
                ${view === 'SERVICE_EDITOR' && html`<${ServiceEditor} service=${currentService} data=${data} isAdmin=${isAdmin} onSave=${handleSaveService} onDelete=${handleDeleteService} onCancel=${() => setView('HOME')} />`}
                ${view === 'POSTER' && html`<${MonthPoster} servicios=${data.servicios} />`}
                ${view === 'MAINTENANCE' && html`<${MaintenanceView} data=${data.equiposMant} isAdmin=${isAdmin} refresh=${fetchData} />`}
                ${view === 'HISTORY' && html`<${HistoryView} data=${data.historial} />`}
            </div>
            
            ${showLogin && html`
                <div className="bg-universe fixed inset-0 z-[80] flex flex-col items-center justify-center p-6 fade-in">
                    <div className="glass p-8 rounded-2xl w-full max-w-sm text-center">
                        <h2 className="text-white font-serif text-2xl mb-4">Acceso Director</h2>
                        <input type="password" className="input-dark mb-4 text-center text-xl tracking-widest" placeholder="PIN" value=${passwordInput} onInput=${e=>setPasswordInput(e.target.value)} />
                        <div className="flex gap-2">
                            <button onClick=${()=>setShowLogin(false)} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400">Cancelar</button>
                            <button onClick=${handleLogin} className="flex-1 py-3 bg-yellow-600 rounded-xl text-black font-bold">Entrar</button>
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
}

// --- LISTA DE PRÓXIMOS SERVICIOS ---
function UpcomingServicesList({ servicios, isAdmin, onEdit, onNew, onHistory }) {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = servicios
        .filter(s => s.fecha >= today)
        .sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    return html`
        <div className="mb-8">
            <div className="flex justify-between items-baseline px-1 mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Próximos Servicios</h3>
                ${isAdmin && html`<button onClick=${onNew} className="text-xs text-blue-400 font-bold">+ Nuevo</button>`}
            </div>
            <div className="space-y-3">
                ${upcoming.length === 0 && html`<div className="glass border-dashed border-2 border-slate-700 p-6 rounded-2xl text-center"><p className="text-slate-500 text-sm">No hay servicios programados.</p></div>`}
                ${upcoming.map(s => {
                    const d = new Date(s.fecha + "T00:00:00");
                    const songsCount = s.repertorio ? s.repertorio.length : 0;
                    return html`
                        <div key=${s.id} className="glass p-4 rounded-xl flex justify-between items-center relative overflow-hidden">
                            <div className=${`absolute left-0 top-0 bottom-0 w-1 ${s.estado === 'Oficial' ? 'bg-yellow-500' : 'bg-slate-600'}`}></div>
                            <div className="pl-3 flex-1 cursor-pointer" onClick=${() => onEdit(s)}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg font-bold text-white leading-none">${d.getDate()}</span>
                                    <span className="text-xs text-slate-400 uppercase font-bold">${d.toLocaleDateString('es-CO',{month:'short'})}</span>
                                    ${s.estado === 'Borrador' && html`<span className="text-[8px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Borrador</span>`}
                                </div>
                                <div className="text-sm text-slate-200">
                                    <span className="text-slate-500 text-xs mr-1">Dirige:</span>
                                    <${SafeText} content=${s.lider || "Sin asignar"} />
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <div className="text-[10px] font-bold text-yellow-500 uppercase mb-1">
                                    <${SafeText} content=${s.jornada} />
                                </div>
                                ${isAdmin ? html`
                                    <button onClick=${() => onHistory(s.id)} className="bg-green-900/30 text-green-500 border border-green-500/50 text-[10px] px-2 py-1 rounded hover:bg-green-800 hover:text-white transition">✔ Cerrar</button>
                                ` : html`<div className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded inline-block">${songsCount} Canciones</div>`}
                            </div>
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}

// --- VISTA NUEVA: MANTENIMIENTO ---
function MaintenanceView({ data, isAdmin, refresh }) {
    const [selectedEq, setSelectedEq] = useState(null);
    const [form, setForm] = useState({ fecha: new Date().toISOString().split('T')[0], responsable: '', costo: 0, descripcion: '' });

    const getStatusColor = (fechaProx) => {
        if(!fechaProx) return 'text-slate-500';
        const today = new Date();
        const next = new Date(fechaProx);
        const days = (next - today) / (1000 * 60 * 60 * 24);
        if (days < 0) return 'text-red-500 font-bold'; 
        if (days < 30) return 'text-yellow-500'; 
        return 'text-green-500';
    };

    const handleSave = () => {
        if(!selectedEq || !form.descripcion) return alert("Faltan datos");
        const payload = { ...form, idEquipo: selectedEq.id };
        callGasApi('saveMaintenance', payload, '1234').then(() => {
            alert("Mantenimiento registrado");
            setSelectedEq(null);
            setForm({ fecha: new Date().toISOString().split('T')[0], responsable: '', costo: 0, descripcion: '' });
            refresh();
        });
    };

    return html`
        <div className="space-y-6 pb-12 fade-in">
             <div className="text-center mb-4">
                <h2 className="font-serif text-xl text-white flex items-center justify-center gap-2"><${Icon.Wrench} className="text-purple-500"/> Gestión de Equipos</h2>
                <p className="text-xs text-slate-500">Control de mantenimiento preventivo</p>
            </div>

            ${selectedEq ? html`
                <div className="glass-gold p-4 rounded-xl border-t-2 border-yellow-500 fade-in">
                    <h3 className="text-white font-bold mb-3">Registrar Mantenimiento: <span className="text-yellow-500">${selectedEq.nombre}</span></h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase">Fecha Realizado</label>
                            <input type="date" className="input-dark" value=${form.fecha} onInput=${e => setForm({...form, fecha: e.target.value})} />
                        </div>
                        <input className="input-dark" placeholder="Responsable (Técnico)" value=${form.responsable} onInput=${e => setForm({...form, responsable: e.target.value})} />
                        <input type="number" className="input-dark" placeholder="Costo ($)" value=${form.costo} onInput=${e => setForm({...form, costo: e.target.value})} />
                        <textarea className="input-dark" placeholder="Descripción del trabajo..." value=${form.descripcion} onInput=${e => setForm({...form, descripcion: e.target.value})}></textarea>
                        <div className="flex gap-2">
                            <button onClick=${() => setSelectedEq(null)} className="flex-1 py-2 bg-slate-800 rounded-lg text-slate-400">Cancelar</button>
                            <button onClick=${handleSave} className="flex-1 py-2 bg-yellow-600 rounded-lg text-black font-bold">Guardar</button>
                        </div>
                    </div>
                </div>
            ` : html`
                <div className="space-y-3">
                    ${data.length === 0 && html`<div className="text-center text-slate-500 text-xs p-4 border border-dashed border-slate-700 rounded-xl">No hay equipos registrados. Agrega equipos en la hoja "EQUIPOS" de Google Sheets.</div>`}
                    
                    ${data.map(eq => html`
                        <div key=${eq.id} className="glass p-3 rounded-xl flex justify-between items-center border border-slate-800">
                            <div>
                                <div className="font-bold text-white text-sm"><${SafeText} content=${eq.nombre} /></div>
                                <div className="text-[10px] text-slate-400"><${SafeText} content=${eq.ubicacion} /></div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500">Próximo:</div>
                                <div className=${`text-xs ${getStatusColor(eq.proximoMant)}`}><${SafeText} content=${eq.proximoMant || 'N/A'} /></div>
                                ${isAdmin && html`
                                    <button onClick=${() => setSelectedEq(eq)} className="mt-1 bg-slate-800 text-purple-400 text-[10px] px-2 py-1 rounded border border-purple-500/30 hover:bg-purple-900 hover:text-white transition">Registrar</button>
                                `}
                            </div>
                        </div>
                    `)}
                </div>
            `}
        </div>
    `;
}

// --- VISTA NUEVA: HISTORIAL ---
function HistoryView({ data }) {
    return html`
        <div className="space-y-4 pb-12 fade-in">
             <div className="text-center mb-4">
                <h2 className="font-serif text-xl text-white flex items-center justify-center gap-2"><${Icon.History} className="text-blue-500"/> Historial de Servicios</h2>
                <p className="text-xs text-slate-500">Registros cerrados y reportes</p>
            </div>

            ${data.length === 0 && html`<div className="text-center text-slate-500 text-sm mt-10 p-4 border border-dashed border-slate-700 rounded-xl">No hay historial registrado. Cierra un servicio desde el Panel Principal para verlo aquí.</div>`}
            
            ${data.map(h => html`
                <div key=${h.id} className="glass p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-yellow-500 font-bold text-sm"><${SafeText} content=${h.fecha} /></span>
                        <span className="text-[10px] text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded"><${SafeText} content=${h.tipo} /></span>
                    </div>
                    <div className="text-xs text-slate-300 mb-2">
                        <span className="text-slate-500">Dirigió:</span> <strong><${SafeText} content=${h.director} /></strong>
                    </div>
                    
                    <div className="bg-slate-900/50 p-3 rounded-lg text-xs text-slate-300 italic mb-3 whitespace-pre-line border-l-2 border-green-500">
                        <${SafeText} content=${h.canciones} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                        <div>
                            <span className="text-yellow-600 font-bold block">Voces:</span>
                            <${SafeText} content=${h.voces} />
                        </div>
                        <div>
                            <span className="text-blue-600 font-bold block">Músicos:</span>
                            <${SafeText} content=${h.musicos} />
                        </div>
                    </div>
                </div>
            `)}
        </div>
    `;
}

// --- SERVICE EDITOR (COMPONENTE ORIGINAL COMPLETO) ---
function ServiceEditor({ service, data, isAdmin, onSave, onDelete, onCancel }) {
    const [form, setForm] = useState({ ...service });
    const [tab, setTab] = useState('REPERTORIO'); 
    const [showCalendarRef, setShowCalendarRef] = useState(false);

    // --- MANEJO DE LISTAS ---
    const toggleList = (listName, item) => {
        if (!isAdmin) return;
        const list = form[listName] || [];
        const exists = list.includes(item);
        setForm({ ...form, [listName]: exists ? list.filter(i => i !== item) : [...list, item] });
    };

    const copySetlist = () => {
        let t = `*🎵 SETLIST ${form.jornada.toUpperCase()}*\nICC Villa Rosario\n\n`;
        t += `🗓️ ${new Date(form.fecha + "T00:00:00").toLocaleDateString('es-CO', {weekday:'long', day:'numeric', month:'long'})}\n`;
        t += `👤 Lider: ${form.lider}\n\n`;
        const rapidas = form.repertorio.filter(s => s.ritmo === 'Rápida');
        const lentas = form.repertorio.filter(s => s.ritmo === 'Lenta');
        const ministracion = form.repertorio.filter(s => s.ritmo === 'Ministración');
        const otros = form.repertorio.filter(s => !['Rápida', 'Lenta', 'Ministración'].includes(s.ritmo));

        if(rapidas.length) { t += `*🔥 ALABANZA*\n`; rapidas.forEach(s => t += `- ${s.titulo} (${getBestTone(s.tono, form.lider) || '?'})\n`); t += `\n`; }
        if(lentas.length) { t += `*🕊️ ADORACIÓN*\n`; lentas.forEach(s => t += `- ${s.titulo} (${getBestTone(s.tono, form.lider) || '?'})\n`); t += `\n`; }
        if(ministracion.length) { t += `*🙌 MINISTRACIÓN*\n`; ministracion.forEach(s => t += `- ${s.titulo} (${getBestTone(s.tono, form.lider) || '?'})\n`); t += `\n`; }
        if(otros.length) { t += `*✨ OTROS*\n`; otros.forEach(s => t += `- ${s.titulo} (${getBestTone(s.tono, form.lider) || '?'})\n`); }
        
        navigator.clipboard.writeText(t);
        alert("¡Setlist copiado para WhatsApp!");
    };
    
    return html`
        <div className="pb-24 fade-in">
            <div className="flex bg-slate-900/80 p-1 rounded-xl mb-4 border border-white/5 overflow-x-auto">
                ${['INFO', 'EQUIPO', 'REPERTORIO', 'SETLIST'].map(t => html`
                    <button key=${t} onClick=${() => setTab(t)} className=${`flex-1 py-2 text-[10px] font-bold rounded-lg transition px-2 ${tab === t ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>${t}</button>
                `)}
            </div>

            ${tab === 'INFO' && html`
                <div className="space-y-4">
                    ${!isAdmin && html`<div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded text-[10px] text-yellow-500 text-center">Solo lectura.</div>`}
                    
                    <button onClick=${() => setShowCalendarRef(!showCalendarRef)} className="w-full bg-slate-800 text-yellow-500 py-2 rounded-xl text-xs font-bold border border-yellow-500/30 flex items-center justify-center gap-2">
                        <${Icon.Calendar} /> ${showCalendarRef ? "Ocultar Ocupación" : "Ver Ocupación del Mes"}
                    </button>
                    
                    ${showCalendarRef && html`
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-2 mb-4">
                            <p className="text-[10px] text-slate-400 text-center mb-2 uppercase">Referencia visual</p>
                            <${MonthPoster} servicios=${data.servicios} />
                        </div>
                    `}

                    <input type="date" className=${isAdmin ? "input-dark" : "input-dark input-disabled"} value=${form.fecha} onInput=${e => isAdmin && setForm({...form, fecha: e.target.value})} readOnly=${!isAdmin} />
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <input list="jornada-opts" className=${isAdmin ? "input-dark" : "input-dark input-disabled"} value=${form.jornada} onInput=${e => isAdmin && setForm({...form, jornada: e.target.value})} disabled=${!isAdmin} placeholder="Jornada" />
                            <datalist id="jornada-opts">
                                <option value="Mañana"/>
                                <option value="Noche"/>
                                <option value="Vigilia"/>
                                <option value="Ayuno"/>
                            </datalist>
                        </div>
                        <select className=${isAdmin ? "input-dark" : "input-dark input-disabled"} value=${form.estado} onChange=${e => isAdmin && setForm({...form, estado: e.target.value})} disabled=${!isAdmin}><option>Borrador</option><option>Oficial</option></select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        ${data.equipo.filter(e => e.rol === 'Líder').map(l => html`
                            <button onClick=${() => isAdmin && setForm({...form, lider: l.nombre})} className=${`p-3 rounded-xl text-xs font-bold border ${form.lider === l.nombre ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'} ${!isAdmin ? 'cursor-not-allowed opacity-70' : ''}`}>
                                <${SafeText} content=${l.nombre} />
                            </button>
                        `)}
                    </div>
                </div>
            `}

            ${tab === 'EQUIPO' && html`
                <div className="space-y-4">
                    <div><p className="text-xs text-yellow-500 uppercase font-bold mb-2">Coristas</p><div className="space-y-2">${data.equipo.filter(e => e.rol === 'Corista').map(c => html`<div onClick=${() => toggleList('coristas', c.nombre)} className=${`p-3 rounded-xl border flex justify-between cursor-pointer ${form.coristas.includes(c.nombre) ? 'bg-slate-800 border-yellow-500' : 'border-slate-800 bg-slate-900/50'} ${!isAdmin ? 'cursor-not-allowed' : ''}`}><span className="text-sm"><${SafeText} content=${c.nombre}/></span>${form.coristas.includes(c.nombre) && html`<${Icon.Check}/>`}</div>`)}</div></div>
                    <div><p className="text-xs text-blue-500 uppercase font-bold mb-2">Músicos</p><div className="space-y-2">${data.equipo.filter(e => e.rol === 'Músico' || e.rol === 'Líder').map(m => html`<div onClick=${() => toggleList('musicos', m.nombre)} className=${`p-3 rounded-xl border flex justify-between cursor-pointer ${form.musicos.includes(m.nombre) ? 'bg-slate-800 border-blue-500' : 'border-slate-800 bg-slate-900/50'} ${!isAdmin ? 'cursor-not-allowed' : ''}`}><span className="text-sm"><${SafeText} content=${m.nombre}/> <span className="text-[10px] text-slate-500">(${m.instrumento})</span></span>${form.musicos.includes(m.nombre) && html`<${Icon.Check}/>`}</div>`)}</div></div>
                </div>
            `}

            ${tab === 'REPERTORIO' && html`
                <div className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold text-white uppercase mb-3 flex justify-between"><span>Tu Setlist (${form.repertorio.length})</span></h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            ${form.repertorio.map((r, idx) => html`
                                <div key=${idx} className="bg-slate-800 p-2 rounded-lg flex justify-between items-center border-l-2 border-green-500">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white truncate"><${SafeText} content=${r.titulo} /></div>
                                        <div className="text-[10px] text-slate-400 truncate"><${SafeText} content=${r.vocalista} /></div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        <input className="bg-slate-900 border border-slate-600 rounded w-10 text-center text-white text-xs py-1" value=${getBestTone(r.tono, form.lider)} placeholder="Ton" onClick=${e => e.stopPropagation()} onInput=${e => {const newRep = [...form.repertorio]; newRep[idx].tono = e.target.value; setForm({...form, repertorio: newRep});}} />
                                        <button onClick=${() => {const newRep = form.repertorio.filter((_, i) => i !== idx); setForm({...form, repertorio: newRep})}} className="text-red-400 p-1"><${Icon.Trash}/></button>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <${SongManager} data=${data.canciones} equipo=${data.equipo} isAdmin=${true} refresh=${()=>{}} 
                         embedMode=${true} 
                         onSelect=${(song) => {
                             const exists = form.repertorio.some(r => r.id === song.id);
                             if(!exists) {
                                 const bestTone = getBestTone(song.tono, form.lider);
                                 setForm({...form, repertorio: [...form.repertorio, {...song, tono: bestTone}]});
                             }
                         }} 
                       />
                    </div>
                </div>
            `}

            ${tab === 'SETLIST' && html`
                <div className="space-y-6 text-center pt-4">
                    <button onClick=${copySetlist} className="w-full bg-green-600 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 btn-active"><${Icon.WhatsApp} /> Copiar Setlist</button>
                </div>
            `}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020617]/95 border-t border-slate-800 flex gap-3 backdrop-blur z-50">
                <button onClick=${onCancel} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400">Cancelar</button>
                ${isAdmin && form.id && html`
                    <button onClick=${() => onDelete(form.id)} className="w-12 py-3 bg-red-900/50 border border-red-500 text-red-400 rounded-xl flex items-center justify-center mr-3"><${Icon.Trash}/></button>
                `}
                <button onClick=${() => onSave(form)} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold shadow-lg text-white">${isAdmin ? "Guardar Todo" : "Guardar Repertorio"}</button>
            </div>
        </div>
    `;
}

// --- MONTH POSTER ---
function MonthPoster({ servicios }) {
    const [offset, setOffset] = useState(0);
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    const monthName = date.toLocaleDateString('es-CO', { month: 'long' });
    const year = date.getFullYear();
    
    const safeServicios = Array.isArray(servicios) ? servicios : [];
    const monthServices = safeServicios.filter(s => {
        if(!s.fecha) return false;
        const d = new Date(s.fecha + "T00:00:00");
        return d.getMonth() === date.getMonth() && d.getFullYear() === year;
    }).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    const copyText = () => {
        let t = `*🗓️ CRONOGRAMA ${monthName.toUpperCase()}*\nICC Villa Rosario\n\n`;
        monthServices.forEach(s => {
            const d = new Date(s.fecha + "T00:00:00");
            const dia = d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric' });
            const coros = safeJoin(s.coristas) || 'Pendiente';
            const musics = safeJoin(s.musicos) || 'Pendiente';
            t += `📌 *${dia.toUpperCase()}* (${s.jornada})\n👤 Lider: ${s.lider}\n🎤 Coros: ${coros}\n🎹 Música: ${musics}\n\n`;
        });
        navigator.clipboard.writeText(t);
        alert("¡Copiado para WhatsApp!");
    };

    return html`
        <div className="fade-in pb-10">
            <div className="flex justify-between items-center glass p-2 rounded-xl mb-4">
                <button onClick=${() => setOffset(offset - 1)} className="p-2"><${Icon.ArrowLeft}/></button>
                <span className="font-bold uppercase text-sm">${monthName} ${year}</span>
                <button onClick=${() => setOffset(offset + 1)} className="p-2"><${Icon.ArrowRight}/></button>
            </div>
            <button onClick=${copyText} className="w-full bg-green-600 mb-4 p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg btn-active"><${Icon.Copy} /> Copiar Resumen WhatsApp</button>
            <div className="glass-gold p-6 rounded-xl relative overflow-hidden">
                <div className="text-center border-b border-yellow-500/30 pb-4 mb-4"><p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.3em] mb-1">Cronograma Oficial</p><h2 className="text-2xl font-serif font-bold text-white uppercase">${monthName}</h2></div>
                <div className="space-y-6">
                    ${monthServices.length === 0 && html`<p className="text-center text-slate-500 text-xs italic">Sin programación oficial.</p>`}
                    ${monthServices.map(s => {
                        const d = new Date(s.fecha + "T00:00:00");
                        const coros = safeJoin(s.coristas) || 'Pendiente';
                        const musics = safeJoin(s.musicos) || 'Pendiente';
                        return html`
                            <div className="border-l-2 border-yellow-500 pl-4 relative">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold text-white capitalize">${d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric' })}</h3>
                                    <span className="text-[9px] uppercase font-bold text-yellow-500"><${SafeText} content=${s.jornada} /></span>
                                </div>
                                <div className="text-sm mb-2"><span className="text-slate-400 block text-xs">Dirige:</span><strong className="text-white text-base"><${SafeText} content=${s.lider} /></strong></div>
                                <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                                    <div><span className="text-yellow-600 font-bold mr-1">Coros:</span><${SafeText} content=${coros} /></div>
                                    <div><span className="text-blue-500 font-bold mr-1">Músicos:</span><${SafeText} content=${musics} /></div>
                                </div>
                            </div>`;
                    })}
                </div>
            </div>
        </div>
    `;
}

// --- TEAM MANAGER ---
function TeamManager({ data, isAdmin, refresh }) {
    const [form, setForm] = useState({ nombre: '', rol: 'Corista', instrumento: '' });
    
    const save = () => { if (!form.nombre) return; callGasApi('saveMember', form, '1234').then(() => { setForm({ nombre: '', rol: 'Corista', instrumento: '' }); refresh(); }); };
    const remove = (id) => { if (confirm('¿Eliminar?')) callGasApi('deleteMember', {id: id}, '1234').then(refresh); };

    return html`
        <div className="space-y-6">
            ${isAdmin ? html`
                <div className="glass p-4 rounded-xl space-y-3 border-t-2 border-teal-500">
                    <h3 className="text-xs font-bold text-teal-400 uppercase">Nuevo Integrante</h3>
                    <input className="input-dark" placeholder="Nombre completo" value=${form.nombre} onInput=${e => setForm({...form, nombre: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                        <select className="input-dark" value=${form.rol} onChange=${e => setForm({...form, rol: e.target.value})}><option>Líder</option><option>Corista</option><option>Músico</option></select>
                        <input className="input-dark" placeholder="Instrumento" value=${form.instrumento} onInput=${e => setForm({...form, instrumento: e.target.value})} />
                    </div>
                    <button onClick=${save} className="w-full bg-teal-600 py-3 rounded-lg font-bold text-sm shadow-lg btn-active">Guardar</button>
                </div>
            ` : html`<div className="p-3 bg-slate-900 rounded-xl text-center text-slate-500 text-xs italic"><${Icon.Lock} /> Solo el Director puede editar el equipo.</div>`}
            <div className="space-y-2 pb-10">
                ${data.map(m => html`<div key=${m.id} className="glass p-3 rounded-xl flex justify-between items-center"><div className="flex items-center gap-3"><div className=${`w-1 h-8 rounded-full ${m.rol==='Líder'?'bg-yellow-500':(m.rol==='Músico'?'bg-purple-500':'bg-blue-500')}`}></div><div><div className="font-bold text-sm text-white"><${SafeText} content=${m.nombre} /></div><div className="text-[10px] text-slate-400 uppercase"><${SafeText} content=${m.rol} /> <${SafeText} content=${m.instrumento ? '• ' + m.instrumento : ''} /></div></div></div>${isAdmin && html`<button onClick=${() => remove(m.id)} className="text-red-400 p-2"><${Icon.Trash}/></button>`}</div>`)}
            </div>
        </div>
    `;
}

// --- SONG MANAGER (COMPLETO) ---
function SongManager({ data, equipo, isAdmin, refresh, embedMode, onSelect }) {
    const [mode, setMode] = useState('LIST'); 
    const [filterVocalist, setFilterVocalist] = useState("TODOS");
    const [search, setSearch] = useState("");
    const [song, setSong] = useState({ titulo: '', vocalista: '', ritmo: 'Rápida', letra: '', link: '', tono: '' });
    const [batchList, setBatchList] = useState([]);

    const saveSingle = () => { if(!song.titulo) return; callGasApi('saveSong', song).then(() => { refresh(); setMode('LIST'); }); };
    const startBatch = () => { setBatchList([{ id: Date.now(), titulo: '', vocalista: '', ritmo: 'Rápida', tono: '', link: '', letra: '' }]); setMode('BATCH_ADD'); };
    const addBatchRow = () => { setBatchList([...batchList, { id: Date.now(), titulo: '', vocalista: '', ritmo: 'Rápida', tono: '', link: '', letra: '' }]); };
    const updateBatchRow = (id, field, value) => { const newList = batchList.map(item => item.id === id ? { ...item, [field]: value } : item); setBatchList(newList); };
    const removeBatchRow = (id) => { if (batchList.length > 1) { setBatchList(batchList.filter(item => item.id !== id)); } };
    const saveBatch = () => { const toSave = batchList.filter(s => s.titulo.trim() !== ""); if (toSave.length === 0) return alert("Agrega al menos un título."); callGasApi('saveSongsBatch', toSave).then(() => { refresh(); setMode('LIST'); }); };

    const groups = [
        { id: 'Rápida', icon: Icon.Fire, label: 'Rápidas', color: 'text-orange-400' },
        { id: 'Lenta', icon: Icon.Dove, label: 'Lentas', color: 'text-blue-400' },
        { id: 'Ministración', icon: Icon.Hand, label: 'Ministración', color: 'text-purple-400' },
        { id: 'Matrimonio', icon: Icon.Ring, label: 'Matrimonios', color: 'text-pink-400' },
        { id: 'Eventos/Navidad', icon: Icon.Gift, label: 'Eventos', color: 'text-green-400' }
    ];

    if (mode === 'BATCH_ADD') return html`
        <div className="pb-20 fade-in">
            <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-xl text-white">Carga Masiva</h2><button onClick=${() => setMode('LIST')} className="text-xs text-slate-400">Cancelar</button></div>
            <div className="space-y-4">
                ${batchList.map((item, idx) => html`
                    <div key=${item.id} className="glass p-4 rounded-xl border border-slate-700 relative">
                        <div className="absolute top-2 right-2 text-xs text-slate-500 font-bold">#${idx+1}</div>
                        <input className="input-dark mb-2 text-sm font-bold" placeholder="Título Canción" value=${item.titulo} onInput=${e => updateBatchRow(item.id, 'titulo', e.target.value)} />
                        <div className="mb-2"><input className="input-dark text-xs mb-1" placeholder="Vocalista(s)" value=${item.vocalista} onInput=${e => updateBatchRow(item.id, 'vocalista', e.target.value)} /><div className="flex flex-wrap gap-1">${equipo.filter(e => e.rol === 'Líder').map(l => html`<button onClick=${() => { const current = item.vocalista ? item.vocalista + ", " : ""; updateBatchRow(item.id, 'vocalista', current + l.nombre); }} className="px-2 py-0.5 rounded text-[10px] border border-slate-600 text-slate-400 hover:bg-slate-800">+ ${l.nombre}</button>`)}</div></div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <select className="input-dark text-sm" value=${item.ritmo} onChange=${e => updateBatchRow(item.id, 'ritmo', e.target.value)}>
                                ${groups.map(g => html`<option value=${g.id}>${g.id}</option>`)}
                            </select>
                            <input className="input-dark text-sm" placeholder="Tono" value=${item.tono} onInput=${e => updateBatchRow(item.id, 'tono', e.target.value)} />
                        </div>
                        <input className="input-dark mb-2 text-xs" placeholder="Link YouTube" value=${item.link} onInput=${e => updateBatchRow(item.id, 'link', e.target.value)} />
                        <textarea className="input-dark text-xs h-16" placeholder="Letra" onInput=${e => updateBatchRow(item.id, 'letra', e.target.value)}>${item.letra}</textarea>
                        ${batchList.length > 1 && html`<button onClick=${() => removeBatchRow(item.id)} className="text-red-400 text-xs mt-2 underline">Eliminar esta</button>`}
                    </div>
                `)}
                <button onClick=${addBatchRow} className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:bg-slate-800 transition">+ Agregar otra fila</button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020617]/95 border-t border-slate-800 flex gap-3 backdrop-blur z-50"><button onClick=${saveBatch} className="w-full py-3 bg-blue-600 rounded-xl font-bold shadow-lg text-white">GUARDAR TODAS (${batchList.length})</button></div>
        </div>
    `;

    if (mode === 'EDIT_SINGLE') return html`
        <div className="space-y-4 pb-10 fade-in">
            <button onClick=${() => setMode('LIST')} className="text-xs text-slate-400 mb-2">← Cancelar</button>
            <h2 className="font-serif text-xl text-white">Editar Canción</h2>
            <input className="input-dark" placeholder="Título" value=${song.titulo} onInput=${e => setSong({...song, titulo: e.target.value})} />
            <div><p className="text-[10px] uppercase text-slate-500 mb-1">Vocalista</p><input className="input-dark mb-2" placeholder="Ej: Grisela, Saudith..." value=${song.vocalista} onInput=${e => setSong({...song, vocalista: e.target.value})} /><div className="flex flex-wrap gap-2 mb-2">${equipo.filter(e => e.rol === 'Líder').map(l => html`<button onClick=${() => { const current = song.vocalista ? song.vocalista + ", " : ""; setSong({...song, vocalista: current + l.nombre}); }} className="px-3 py-1 rounded text-xs border border-slate-600 text-slate-400 hover:bg-slate-800">+ ${l.nombre}</button>`)}</div></div>
            <div className="grid grid-cols-2 gap-2">
                <select className="input-dark" value=${song.ritmo} onChange=${e => setSong({...song, ritmo: e.target.value})}>
                    ${groups.map(g => html`<option value=${g.id}>${g.id}</option>`)}
                </select>
                <input className="input-dark" placeholder="Tono" value=${getBestTone(song.tono, filterVocalist !== "TODOS" ? filterVocalist : "Original")} onInput=${e => setSong({...song, tono: e.target.value})} />
            </div>
            <input className="input-dark" placeholder="Link YouTube" value=${song.link} onInput=${e => setSong({...song, link: e.target.value})} />
            <textarea className="input-dark h-32" placeholder="Letra..." value=${song.letra} onInput=${e => setSong({...song, letra: e.target.value})}></textarea>
            <button onClick=${saveSingle} className="w-full bg-blue-600 py-3 rounded-lg font-bold shadow-lg btn-active">Guardar</button>
        </div>
    `;

    let safeCanciones = Array.isArray(data) ? data : [];
    let filtered = safeCanciones.filter(s => s.titulo.toLowerCase().includes(search.toLowerCase()));
    
    if (filterVocalist !== "TODOS") {
        filtered = filtered.filter(s => (s.vocalista || "").toLowerCase().includes(filterVocalist.toLowerCase()));
    }

    const groupIds = groups.map(g => g.id);
    const uncategorizedSongs = filtered.filter(s => !groupIds.includes(s.ritmo));

    return html`
        <div className="pb-20 space-y-4">
            <div className="flex gap-2"><input className="input-dark flex-1" placeholder="Buscar..." value=${search} onInput=${e => setSearch(e.target.value)} /><button onClick=${startBatch} className="bg-blue-600 px-4 rounded-xl shadow-lg flex items-center gap-1 font-bold text-xs"><${Icon.Plus}/> Masivo</button></div>
            <select className="input-dark py-2 mt-1" value=${filterVocalist} onChange=${e => setFilterVocalist(e.target.value)}><option value="TODOS">Todos los Cantantes</option>${equipo.filter(e => e.rol === 'Líder').map(l => html`<option value=${l.nombre}>${l.nombre}</option>`)}</select>
            <div className="space-y-4">
                ${groups.map(group => {
                    const songsInGroup = filtered.filter(s => s.ritmo === group.id);
                    if(songsInGroup.length === 0) return null;
                    return html`
                        <div>
                            <h3 className=${`font-bold text-xs uppercase mb-2 flex items-center gap-1 ${group.color}`}><${group.icon}/> ${group.label} (${songsInGroup.length})</h3>
                            <div className="space-y-1">
                                ${songsInGroup.map(s => html`
                                    <div key=${s.id} onClick=${() => { 
                                        if (embedMode) {
                                            onSelect(s);
                                        } else if(isAdmin || true) { 
                                            setSong({...s}); setMode('EDIT_SINGLE'); 
                                        } 
                                    }} className="glass p-3 rounded-xl flex items-center gap-3 mb-2 cursor-pointer border border-transparent hover:border-slate-500">
                                        <div className=${`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${group.color.replace('text-', 'bg-').replace('400', '500')}/20 ${group.color}`}><${group.icon}/></div>
                                        <div className="flex-1"><div className="font-bold text-white text-sm"><${SafeText} content=${s.titulo} /></div><div className="text-[10px] text-slate-400 flex gap-2"><span>👤 <${SafeText} content=${s.vocalista} /></span><span className="text-yellow-500 font-mono"><${SafeText} content=${formatTonoDisplay(s.tono)} /></span></div></div>
                                        ${embedMode && html`<div className="text-green-500 font-bold text-lg">+</div>`}
                                    </div>
                                `)}
                            </div>
                        </div>
                    `;
                })}
                
                ${uncategorizedSongs.length > 0 && html`
                    <div class="pt-4 border-t border-slate-800">
                        <h3 className="font-bold text-xs uppercase mb-2 flex items-center gap-1 text-slate-400"><${Icon.List}/> Otros / General (${uncategorizedSongs.length})</h3>
                        <div className="space-y-1">
                            ${uncategorizedSongs.map(s => html`
                                <div key=${s.id} onClick=${() => { 
                                    if (embedMode) {
                                        onSelect(s);
                                    } else if(isAdmin || true) { 
                                        setSong({...s}); setMode('EDIT_SINGLE'); 
                                    } 
                                }} className="glass p-3 rounded-xl flex items-center gap-3 mb-2 cursor-pointer border border-transparent hover:border-slate-500">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-400"><${Icon.Music}/></div>
                                    <div className="flex-1"><div className="font-bold text-white text-sm"><${SafeText} content=${s.titulo} /></div><div className="text-[10px] text-slate-400 flex gap-2"><span>👤 <${SafeText} content=${s.vocalista} /></span><span className="text-yellow-500 font-mono"><${SafeText} content=${formatTonoDisplay(s.tono)} /></span></div></div>
                                    ${embedMode && html`<div className="text-green-500 font-bold text-lg">+</div>`}
                                </div>
                            `)}
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

// INICIALIZACIÓN
ReactDOM.render(html`<${App} />`, document.getElementById('root'));
