/**
 * APP.JS - MINISTERIO DE ALABANZA
 * Integridad Absoluta: Código Completo
 * Versión 7.1: Fix ReferenceError (UpcomingServicesList Restaurado)
 */

// ================= CONFIGURACIÓN =================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyevrQgX1ifj-hKDnkZBXuoSA_M6blg3zz3rbC-9In7QrXbn5obsCxZZbDj7sl5aQMxxA/exec";

// ================= PUENTE DE CONEXIÓN =================
let showToastCallback = null;

async function callGasApi(action, payload = {}, password = "") {
    try {
        if(showToastCallback && (action.startsWith('save') || action.startsWith('delete'))) {
            showToastCallback("Procesando...", "loading");
        }
        
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify({ action, payload, password })
        });
        const result = await response.json();
        
        if(showToastCallback && result.status === 'success') {
            showToastCallback("¡Acción Exitosa!", "success");
        } else if (showToastCallback && result.status !== 'success') {
            showToastCallback("Error: " + result.message, "error");
        }
        
        return result;
    } catch (error) {
        if(showToastCallback) showToastCallback("Error de Red", "error");
        console.error("API Error:", error);
        return { status: "error", message: "Sin conexión" };
    }
}

// ================= INICIO LÓGICA REACT =================
const html = htm.bind(React.createElement);
const { useState, useEffect, useRef } = React;

// --- ICONOS SVG ---
const Icon = {
    ArrowLeft: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    ArrowRight: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    ArrowUp: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`,
    ArrowDown: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
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
    BigPlus: () => html`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`
};

// --- UTILIDADES ---
const SafeText = ({ content }) => {
    if (content === null || content === undefined) return "";
    return String(content);
};

const safeJoin = (list) => {
    if (!Array.isArray(list)) return "";
    return list.join(", ");
};

const formatTonoDisplay = (rawTono) => {
    try {
        if (!rawTono) return "";
        if (typeof rawTono === 'string' && rawTono.trim().startsWith('{')) {
            const obj = JSON.parse(rawTono);
            return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' | ');
        }
        return String(rawTono);
    } catch(e) { return String(rawTono); }
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
    } catch(e) { return ""; }
};

// ================= COMPONENTES BASE (DEFINIDOS PRIMERO) =================

// 1. SPLASH SCREEN
const SplashScreen = () => {
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
            </div>
        </div>
    `;
};

// 2. TOAST
function Toast({ message, type }) {
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    return html`
        <div className="fixed top-4 right-4 z-[100] fade-in">
            <div className=${`${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10`}>
                ${type === 'loading' && html`<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>`}
                <span className="font-bold text-sm">${message}</span>
            </div>
        </div>
    `;
}

// 3. MANUAL
function Manual({ onClose }) {
    return html`
        <div className="fixed inset-0 bg-black/90 z-[90] flex items-center justify-center p-4 fade-in">
            <div className="glass-gold p-6 rounded-2xl max-w-sm w-full text-center border border-yellow-500/30">
                <div className="text-yellow-500 mb-4 flex justify-center"><${Icon.Info} style=${{width: 40, height: 40}} /></div>
                <h2 className="text-xl font-serif text-white mb-4">Bienvenido al Sistema</h2>
                <div className="text-left space-y-4 text-sm text-slate-300 mb-6">
                    <div className="flex gap-3">
                        <div className="bg-slate-800 p-2 rounded-lg h-fit"><${Icon.Music} /></div>
                        <div><strong className="text-white block">Planificador de Repertorio</strong>Ahora gestiona tus canciones directamente desde el servicio.</div>
                    </div>
                </div>
                <button onClick=${() => { localStorage.setItem('icc_tutorial_seen', 'true'); onClose(); }} className="w-full bg-yellow-600 py-3 rounded-xl font-bold text-black mb-2 shadow-lg">Entendido</button>
            </div>
        </div>
    `;
}

// 4. LOGS
function ActivityModal({ onClose }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        callGasApi('getRecentActivity').then(res => {
            if(res.status === 'success') setLogs(res.data);
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
                    ${loading ? html`<div className="text-center text-yellow-500 mt-10">Cargando...</div>` :
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

// 5. SEARCH SELECT
function SearchableUserSelect({ allUsers, selectedUsers, onAdd, onRemove, placeholder, icon }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 0) {
            const filtered = allUsers.filter(u => 
                u.nombre.toLowerCase().includes(val.toLowerCase()) && 
                !selectedUsers.some(sel => sel.includes(u.nombre))
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const handleSelect = (user) => {
        onAdd(user.nombre); 
        setQuery("");
        setResults([]);
    };

    return html`
        <div className="mb-4">
            <div className="relative">
                <input className="input-dark pl-10" placeholder=${placeholder} value=${query} onInput=${handleSearch} />
                <div className="absolute left-3 top-3 text-slate-500">${icon}</div>
            </div>
            ${results.length > 0 && html`
                <div className="bg-slate-800 border border-slate-700 rounded-lg mt-1 max-h-40 overflow-y-auto absolute z-10 w-full shadow-xl">
                    ${results.map(u => html`
                        <div onClick=${() => handleSelect(u)} className="p-2 hover:bg-slate-700 cursor-pointer text-sm text-white border-b border-slate-700 last:border-0 flex justify-between">
                            <span>${u.nombre}</span>
                            <span className="text-[10px] text-slate-400 italic">${u.instrumento || u.rol}</span>
                        </div>
                    `)}
                </div>
            `}
            <div className="mt-2 flex flex-wrap gap-2">
                ${selectedUsers.map(u => html`
                    <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-2">
                        ${u}
                        <button onClick=${() => onRemove(u)} className="text-red-400 hover:text-red-300">✕</button>
                    </div>
                `)}
            </div>
        </div>
    `;
}

// ================= REPERTOIRE PLANNER (V7.1: DATALIST + LAYOUT) =================
function RepertoirePlanner({ data, teamData, onAddSongs, onClose }) {
    const [activeTab, setActiveTab] = useState('Rápida'); 
    const [filterVocalist, setFilterVocalist] = useState('TODOS');
    const [rows, setRows] = useState([{ id: Date.now(), titulo: '', vocalista: '', tipo: 'Rápida', estilo: '', tono: '', link: '', isNew: true }]);
    const [suggestions, setSuggestions] = useState({});

    const tipos = ["Rápida", "Lenta", "Ministración", "Eventos", "Matrimonio"];
    const estilos = ["Pop", "Rock", "Balada", "Cumbia", "Salsa", "Merengue", "Marcha", "Reggae", "Adoración", "Júbilo", "Urbano"];
    
    // Vocalistas únicos para el Datalist
    const uniqueVocalists = [...new Set(teamData.filter(e => e.rol.includes('Líder') || e.rol.includes('Corista')).map(e => e.nombre))].sort();

    const tabSongs = data.filter(s => {
        const matchType = s.tipo === activeTab || (activeTab === 'Rápida' && s.ritmo === 'Rápida') || (activeTab === 'Lenta' && s.ritmo === 'Lenta'); 
        if (!matchType) return false;
        if (filterVocalist !== 'TODOS') return s.vocalista.includes(filterVocalist);
        return true;
    }).sort((a, b) => a.titulo.localeCompare(b.titulo)); 

    const handleSearch = (id, val) => {
        const newRows = rows.map(r => r.id === id ? { ...r, titulo: val, isNew: true } : r);
        setRows(newRows);
        if (val.length > 2) {
            const matches = data.filter(s => s.titulo.toLowerCase().includes(val.toLowerCase()));
            setSuggestions({ ...suggestions, [id]: matches });
        } else {
            const newSugg = { ...suggestions }; delete newSugg[id]; setSuggestions(newSugg);
        }
    };

    const handleSelectExisting = (id, song) => {
        const newRows = rows.map(r => r.id === id ? { 
            ...r, 
            titulo: song.titulo, 
            vocalista: song.vocalista, 
            tipo: song.tipo || song.ritmo, 
            estilo: song.estilo,
            tono: getBestTone(song.tono, "General"), 
            link: song.link, 
            isNew: false, 
            dbId: song.id 
        } : r);
        setRows(newRows);
        const newSugg = { ...suggestions }; delete newSugg[id]; setSuggestions(newSugg);
    };

    const updateRow = (id, field, val) => setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
    const addRow = () => setRows([...rows, { id: Date.now() + rows.length, titulo: '', vocalista: '', tipo: activeTab, estilo: '', tono: '', link: '', isNew: true }]);
    const removeRow = (id) => rows.length > 1 && setRows(rows.filter(r => r.id !== id));

    const handleSelectFromList = (song) => {
        const lastRow = rows[rows.length - 1];
        if (lastRow.titulo === '') {
            handleSelectExisting(lastRow.id, song);
        } else {
            const newId = Date.now() + Math.random();
            setRows([...rows, { 
                id: newId, 
                titulo: song.titulo, 
                vocalista: song.vocalista, 
                tipo: song.tipo || song.ritmo, 
                estilo: song.estilo,
                tono: getBestTone(song.tono, "General"), 
                link: song.link, 
                isNew: false, 
                dbId: song.id 
            }]);
        }
    };

    const handleSave = () => {
        const validRows = rows.filter(r => r.titulo.trim() !== "");
        if (validRows.length === 0) return alert("Agrega al menos una canción");
        
        const toCreate = validRows.filter(r => r.isNew).map(r => ({ 
            titulo: r.titulo.toUpperCase(), 
            vocalista: r.vocalista, 
            tipo: r.tipo, 
            estilo: r.estilo, 
            tono: r.tono, 
            link: r.link, 
            letra: '' 
        }));
        
        if (toCreate.length > 0) callGasApi('saveSongsBatch', toCreate);

        const mappedSongs = validRows.map(r => ({
            id: r.dbId || "TEMP-" + Date.now() + Math.random(),
            titulo: r.titulo.toUpperCase(),
            vocalista: r.vocalista,
            ritmo: r.tipo, 
            estilo: r.estilo,
            tono: r.tono,
            link: r.link
        }));
        
        onAddSongs(mappedSongs);
        onClose();
    };
    
    return html`
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col p-0 fade-in">
            <datalist id="vocalists-list">
                ${uniqueVocalists.map(v => html`<option value=${v} />`)}
            </datalist>

            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#020617] shrink-0">
                <h2 className="text-lg font-serif text-white">Planificador</h2>
                <button onClick=${onClose} className="text-slate-400">Cerrar</button>
            </div>

            <div className="px-4 py-4 bg-[#020617] border-b border-slate-800 shrink-0 max-h-[40vh] overflow-y-auto">
                <h3 className="text-[10px] uppercase text-blue-500 font-bold mb-2">Tu Selección / Nueva Canción</h3>
                <div className="space-y-3">
                    ${rows.map((r, idx) => html`
                        <div key=${r.id} className="glass p-3 rounded-xl border border-slate-700 relative">
                            <div className="absolute top-2 right-2 text-[10px] font-bold ${r.isNew ? 'text-green-500' : 'text-blue-500'}">${r.isNew ? 'NUEVA' : 'EXISTENTE'}</div>
                            <div className="relative mb-2 mt-2">
                                <input className="input-dark font-bold text-white text-sm" placeholder="Escribe título..." value=${r.titulo} onInput=${(e) => handleSearch(r.id, e.target.value)} />
                                ${suggestions[r.id] && suggestions[r.id].length > 0 && html`
                                    <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg z-50 max-h-40 overflow-y-auto mt-1 shadow-2xl">
                                        ${suggestions[r.id].map(s => html`<div className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0" onClick=${() => handleSelectExisting(r.id, s)}><div className="font-bold text-sm text-white">${s.titulo}</div><div className="text-xs text-slate-400">${s.vocalista}</div></div>`)}
                                    </div>
                                `}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input className="input-dark text-xs" list="vocalists-list" placeholder="Vocalista (Auto)" value=${r.vocalista} onInput=${(e) => updateRow(r.id, 'vocalista', e.target.value)} />
                                <select className="input-dark text-xs" value=${r.estilo} onChange=${(e) => updateRow(r.id, 'estilo', e.target.value)}><option value="">Estilo...</option>${estilos.map(est => html`<option value=${est}>${est}</option>`)}</select>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <select className="input-dark text-xs" value=${r.tipo} onChange=${(e) => updateRow(r.id, 'tipo', e.target.value)}>${tipos.map(t => html`<option value=${t}>${t}</option>`)}</select>
                                <input className="input-dark text-xs" placeholder="Tono" value=${r.tono} onInput=${(e) => updateRow(r.id, 'tono', e.target.value)} />
                                <input className="input-dark text-xs" placeholder="Link" value=${r.link} onInput=${(e) => updateRow(r.id, 'link', e.target.value)} />
                            </div>
                            ${rows.length > 1 && html`<button onClick=${() => removeRow(r.id)} className="absolute bottom-2 right-2 text-red-400 bg-slate-900 p-1 rounded"><${Icon.Trash}/></button>`}
                        </div>
                    `)}
                    <button onClick=${addRow} className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 text-xs hover:bg-slate-800">+ Fila</button>
                </div>
            </div>

            <div className="shrink-0 bg-slate-900/50 border-b border-slate-800">
                <div className="flex overflow-x-auto p-2 gap-2">
                    ${tipos.map(t => html`
                        <button onClick=${() => setActiveTab(t)} className=${`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${activeTab === t ? 'bg-yellow-600 text-black shadow-lg scale-105' : 'bg-slate-800 text-slate-400'}`}>
                            ${t}
                        </button>
                    `)}
                </div>
                <div className="px-4 py-2">
                    <select className="input-dark text-xs" value=${filterVocalist} onChange=${e => setFilterVocalist(e.target.value)}>
                        <option value="TODOS">Ver todos los cantantes</option>
                        ${uniqueVocalists.map(v => html`<option value=${v}>${v}</option>`)}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 px-4 pt-2">
                <h3 className="text-[10px] uppercase text-yellow-500 font-bold mb-2 sticky top-0 bg-[#020617] py-1 z-10">
                    Biblioteca: ${activeTab} (${tabSongs.length})
                </h3>
                <div className="space-y-1">
                    ${tabSongs.map(s => html`
                        <div onClick=${() => handleSelectFromList(s)} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 cursor-pointer group transition">
                            <div className="flex items-center gap-3">
                                <div className="text-yellow-500 text-xs"><${Icon.Music}/></div>
                                <div>
                                    <div className="text-xs font-bold text-white group-hover:text-yellow-400">${s.titulo}</div>
                                    <div className="text-[10px] text-slate-500">${s.vocalista}</div>
                                </div>
                            </div>
                            <div className="text-[9px] bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">
                                ${s.estilo || 'Gral'}
                            </div>
                        </div>
                    `)}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020617] border-t border-slate-800 z-50">
                <button onClick=${handleSave} className="w-full bg-blue-600 py-3 rounded-xl font-bold text-white shadow-lg">Confirmar Selección</button>
            </div>
        </div>
    `;
}

// ================= TEAM MANAGER (V7.0: ROLES MULTIPLES Y DUPLICADOS) =================
function TeamManager({ data, isAdmin, refresh }) {
    const [form, setForm] = useState({ id: '', nombre: '', roles: [], instrumento: '' });
    const [isEditing, setIsEditing] = useState(false);
    
    const roleOptions = ["Líder", "Corista", "Músico"];

    const toggleRole = (role) => {
        if (form.roles.includes(role)) {
            setForm({ ...form, roles: form.roles.filter(r => r !== role) });
        } else {
            setForm({ ...form, roles: [...form.roles, role] });
        }
    };

    const save = () => { 
        if (!form.nombre) return alert("Falta el nombre");
        if (form.roles.length === 0) return alert("Selecciona al menos un rol");
        
        if (!isEditing) {
            const exists = data.some(m => m.nombre.toLowerCase() === form.nombre.toLowerCase());
            if (exists) return alert("Este miembro ya existe. Edita el existente.");
        }

        const payload = {
            ...form,
            rol: form.roles.join(', ') 
        };

        callGasApi('saveMember', payload, '1234').then(() => { 
            setForm({ id: '', nombre: '', roles: [], instrumento: '' }); 
            setIsEditing(false); 
            refresh(); 
        }); 
    };
    
    const edit = (m) => { 
        const rolesArray = m.rol ? m.rol.split(', ') : [];
        setForm({ ...m, roles: rolesArray }); 
        setIsEditing(true); 
    };

    const cancelEdit = () => { setForm({ id: '', nombre: '', roles: [], instrumento: '' }); setIsEditing(false); };
    const remove = (id) => { if (confirm('¿Eliminar?')) callGasApi('deleteMember', {id}, '1234').then(refresh); };

    return html`
        <div className="space-y-6">
            ${isAdmin ? html`
                <div className="glass p-4 rounded-xl space-y-3 border-t-2 border-teal-500">
                    <h3 className="text-xs font-bold text-teal-400 uppercase">${isEditing ? 'Editar Integrante' : 'Nuevo Integrante'}</h3>
                    <input className="input-dark" placeholder="Nombre Completo" value=${form.nombre} onInput=${e => setForm({...form, nombre: e.target.value})} />
                    
                    <div className="flex gap-4 my-2">
                        ${roleOptions.map(r => html`
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked=${form.roles.includes(r)} onChange=${() => toggleRole(r)} className="accent-teal-500" />
                                <span className="text-xs text-slate-300">${r}</span>
                            </label>
                        `)}
                    </div>

                    <input className="input-dark" placeholder="Instrumentos (sep. por comas)" value=${form.instrumento} onInput=${e => setForm({...form, instrumento: e.target.value})} />
                    
                    <div className="flex gap-2">
                        ${isEditing && html`<button onClick=${cancelEdit} className="flex-1 py-3 bg-slate-800 rounded-lg text-slate-400">Cancelar</button>`}
                        <button onClick=${save} className="flex-1 bg-teal-600 py-3 rounded-lg font-bold text-sm shadow-lg btn-active">${isEditing ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </div>
            ` : html`<div className="p-3 bg-slate-900 rounded-xl text-center text-slate-500 text-xs italic"><${Icon.Lock} /> Gestión Restringida</div>`}
            
            <div className="space-y-2 pb-10">
                ${data.map(m => html`
                    <div key=${m.id} className="glass p-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className=${`w-1 h-8 rounded-full ${m.rol.includes('Líder') ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                            <div>
                                <div className="font-bold text-sm text-white">${m.nombre}</div>
                                <div className="text-[10px] text-slate-400 uppercase">${m.rol}</div>
                                <div className="text-[9px] text-slate-500 italic">${m.instrumento}</div>
                            </div>
                        </div>
                        ${isAdmin && html`<div className="flex gap-2"><button onClick=${() => edit(m)} className="text-slate-400 p-2"><${Icon.Edit}/></button><button onClick=${() => remove(m.id)} className="text-red-400 p-2"><${Icon.Trash}/></button></div>`}
                    </div>
                `)}
            </div>
        </div>
    `;
}

// ================= UPCOMING SERVICES LIST (COMPONENTE CRÍTICO RESTAURADO) =================
function UpcomingServicesList({ servicios, isAdmin, onEdit, onViewDetail, onNew, onHistory }) {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = servicios.filter(s => s.fecha >= today).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    return html`
        <div className="mb-8">
            <div className="flex justify-between items-baseline px-1 mb-2"><h3 className="text-sm font-bold text-white uppercase tracking-wider">Próximos Servicios</h3>${isAdmin && html`<button onClick=${onNew} className="text-xs text-blue-400 font-bold">+ Nuevo</button>`}</div>
            <div className="space-y-3">
                ${upcoming.map(s => {
                    const d = new Date(s.fecha + "T00:00:00");
                    const songsCount = s.repertorio ? s.repertorio.length : 0;
                    return html`<div key=${s.id} className="glass p-4 rounded-xl flex justify-between items-center relative overflow-hidden group"><div className=${`absolute left-0 top-0 bottom-0 w-1 ${s.estado === 'Oficial' ? 'bg-yellow-500' : 'bg-slate-600'}`}></div><div className="pl-3 flex-1 cursor-pointer" onClick=${() => onEdit(s)}><div className="flex items-center gap-2 mb-1"><span className="text-lg font-bold text-white leading-none">${d.getDate()}</span><span className="text-xs text-slate-400 uppercase font-bold">${d.toLocaleDateString('es-CO',{month:'short'})}</span>${s.estado === 'Borrador' && html`<span className="text-[8px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Borrador</span>`}</div><div className="text-sm text-slate-200"><span className="text-slate-500 text-xs mr-1">Dirige:</span><${SafeText} content=${s.lider || "Sin asignar"} /></div></div><div className="text-right flex flex-col items-end gap-2"><div className="text-[10px] font-bold text-yellow-500 uppercase mb-1">${s.jornada}</div><div className="flex gap-2 items-center">${isAdmin ? html`<button onClick=${(e) => {e.stopPropagation(); onHistory(s.id);}} className="text-green-500 hover:text-white text-[10px] border border-green-500/50 px-2 py-0.5 rounded">✔ Cerrar</button>` : (songsCount === 0 ? html`<button onClick=${() => onEdit(s)} className="bg-yellow-500/20 text-yellow-500 border border-yellow-500 text-[10px] px-2 py-1 rounded font-bold animate-pulse">⚠ Agregar Canciones</button>` : html`<div className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded inline-block">${songsCount} Canciones</div>`)}<button onClick=${(e) => {e.stopPropagation(); onViewDetail(s);}} className="text-blue-400 hover:text-white"><${Icon.Activity} /></button></div></div></div>`;
                })}
            </div>
        </div>
    `;
}

// ================= SERVICE EDITOR (V7.0: ASIGNACIÓN DINÁMICA DE INSTRUMENTOS) =================
function ServiceEditor({ service, data, isAdmin, onSave, onDelete, onCancel, onViewDetail }) {
    const [form, setForm] = useState({ ...service });
    const [tab, setTab] = useState('REPERTORIO'); 
    const [showPlanner, setShowPlanner] = useState(false);
    
    // Modal de Selección de Instrumento
    const [showInstModal, setShowInstModal] = useState(false);
    const [tempMember, setTempMember] = useState(null);

    // Helpers
    const addCorista = (n) => { if(!form.coristas.includes(n)) setForm({...form, coristas: [...form.coristas, n]}); };
    const removeCorista = (n) => { setForm({...form, coristas: form.coristas.filter(c => c !== n)}); };
    
    // LOGICA NUEVA PARA MUSICOS
    const initiateAddMusico = (name) => {
        // Buscar el miembro completo
        const member = data.equipo.find(m => m.nombre === name);
        if (member) {
            setTempMember(member);
            setShowInstModal(true); // Abrir modal
        } else {
            // Si no existe (raro), agregar nombre directo
            addMusicoString(name);
        }
    };

    const confirmInstrument = (instrument) => {
        const entry = `${tempMember.nombre} (${instrument})`;
        addMusicoString(entry);
        setShowInstModal(false);
        setTempMember(null);
    };

    const addMusicoString = (str) => {
        if(!form.musicos.includes(str)) setForm({...form, musicos: [...form.musicos, str]});
    };

    const removeMusico = (n) => { setForm({...form, musicos: form.musicos.filter(m => m !== n)}); };

    const moveItem = (index, dir) => { const newRep = [...form.repertorio]; if (dir === -1 && index > 0) [newRep[index], newRep[index-1]] = [newRep[index-1], newRep[index]]; else if (dir === 1 && index < newRep.length-1) [newRep[index], newRep[index+1]] = [newRep[index+1], newRep[index]]; setForm({ ...form, repertorio: newRep }); };
    
    const handlePlannerSuccess = (songs) => { setForm({...form, repertorio: [...form.repertorio, ...songs]}); };
    
    const copySetlist = () => {
        let t = `*🎵 SETLIST ${form.jornada}*\n${form.fecha}\n👤 ${form.lider}\n\n`;
        form.repertorio.forEach((s,i)=> t+=`${i+1}. ${s.titulo} (${getBestTone(s.tono, form.lider)})\n`);
        navigator.clipboard.writeText(t); alert("Copiado");
    };

    // Extraer instrumentos del miembro temporal
    const availableInstruments = tempMember ? (tempMember.instrumento || "").split(',').map(s => s.trim()).filter(s => s) : [];

    return html`
        <div className="pb-24 fade-in">
            ${showPlanner && html`<${RepertoirePlanner} data=${data.canciones} teamData=${data.equipo} onAddSongs=${handlePlannerSuccess} onClose=${() => setShowPlanner(false)} />`}

            ${showInstModal && tempMember && html`
                <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
                    <div className="glass-gold p-6 rounded-2xl w-full max-w-sm">
                        <h3 className="text-white font-bold mb-4 text-center">¿Qué tocará ${tempMember.nombre}?</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            ${availableInstruments.map(inst => html`
                                <button onClick=${() => confirmInstrument(inst)} className="bg-slate-800 hover:bg-yellow-600 hover:text-black text-white p-3 rounded-xl border border-slate-600 font-bold text-sm transition">
                                    ${inst}
                                </button>
                            `)}
                            <button onClick=${() => confirmInstrument("Voz")} className="bg-slate-800 text-white p-3 rounded-xl border border-slate-600 text-sm">Voz</button>
                        </div>
                        <input className="input-dark mb-4" placeholder="Otro instrumento..." onKeyDown=${(e) => e.key === 'Enter' && confirmInstrument(e.target.value)} />
                        <button onClick=${() => setShowInstModal(false)} className="w-full text-slate-400 py-2">Cancelar</button>
                    </div>
                </div>
            `}

            <div className="sticky top-0 z-40 bg-[#020617]/95 border-b border-white/5 p-2 flex justify-between items-center mb-4 backdrop-blur">
                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 overflow-x-auto flex-1 mr-2">${['INFO', 'EQUIPO', 'REPERTORIO', 'SETLIST'].map(t => html`<button key=${t} onClick=${() => setTab(t)} className=${`flex-1 py-2 text-[10px] font-bold rounded-lg transition px-2 ${tab === t ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>${t}</button>`)}</div>
                <button onClick=${() => onViewDetail(form)} className="bg-blue-600 p-2 rounded-lg text-white shadow-lg text-xs font-bold flex items-center gap-1"><${Icon.Activity}/> PNG</button>
            </div>

            ${tab === 'INFO' && html`
                <div className="space-y-4">
                    <input type="date" className=${isAdmin ? "input-dark" : "input-dark bg-slate-900 text-slate-500"} value=${form.fecha} onInput=${e => isAdmin && setForm({...form, fecha: e.target.value})} readOnly=${!isAdmin} />
                    <div className="grid grid-cols-2 gap-2"><select className=${isAdmin?"input-dark":"input-dark bg-slate-900 text-slate-500"} value=${form.jornada} onChange=${e => isAdmin && setForm({...form, jornada: e.target.value})} disabled=${!isAdmin}><option>Mañana</option><option>Tarde</option><option>Noche</option><option>Vigilia</option></select><select className=${isAdmin?"input-dark":"input-dark bg-slate-900 text-slate-500"} value=${form.estado} onChange=${e => isAdmin && setForm({...form, estado: e.target.value})} disabled=${!isAdmin}><option>Borrador</option><option>Oficial</option></select></div>
                    <input className=${isAdmin?"input-dark":"input-dark bg-slate-900 text-slate-500"} value=${form.lider} onInput=${e => isAdmin && setForm({...form, lider: e.target.value})} readOnly=${!isAdmin} placeholder="Director (Libre)" />
                </div>
            `}

            ${tab === 'EQUIPO' && html`
                <div className="space-y-6">
                    <div>
                        <p className="text-xs text-yellow-500 uppercase font-bold mb-2">Coristas</p>
                        ${isAdmin ? html`<${SearchableUserSelect} allUsers=${data.equipo.filter(e=>e.rol.includes('Corista')||e.rol.includes('Líder'))} selectedUsers=${form.coristas} onAdd=${addCorista} onRemove=${removeCorista} placeholder="Añadir Corista..." icon=${html`<${Icon.Mic}/>`}/>` : html`<div className="flex flex-wrap gap-2">${form.coristas.map(c=>html`<div className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 border border-yellow-500/30">${c}</div>`)}</div>`}
                    </div>
                    
                    <div>
                        <p className="text-xs text-blue-500 uppercase font-bold mb-2">Músicos</p>
                        ${isAdmin ? html`<${SearchableUserSelect} allUsers=${data.equipo.filter(e=>e.rol.includes('Músico')||e.rol.includes('Líder'))} selectedUsers=${form.musicos} onAdd=${initiateAddMusico} onRemove=${removeMusico} placeholder="Añadir Músico..." icon=${html`<${Icon.Guitar}/>`}/>` : html`<div className="flex flex-wrap gap-2">${form.musicos.map(m=>html`<div className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 border border-blue-500/30">${m}</div>`)}</div>`}
                    </div>
                </div>
            `}

            ${tab === 'REPERTORIO' && html`
                <div className="space-y-4">
                    ${(form.repertorio||[]).length === 0 && html`<div onClick=${() => isAdmin && setShowPlanner(true)} className="bg-slate-900 border-2 border-dashed border-yellow-500/50 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-800 transition group flex flex-col items-center justify-center gap-3"><div className="bg-yellow-600 rounded-full p-3 mb-3 shadow-lg group-hover:scale-110 transition"><${Icon.Plus}/></div><h3 className="text-yellow-500 font-bold text-lg uppercase tracking-widest">AGREGAR CANCIONES</h3></div>`}
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        ${form.repertorio.map((r, idx) => html`
                            <div key=${idx} className="bg-slate-800 p-2 rounded-lg flex justify-between items-center border-l-2 border-green-500 group">
                                <div className="flex flex-col gap-1 mr-2"><button onClick=${() => moveItem(idx, -1)} className="text-slate-500 hover:text-white text-[10px]"><${Icon.ArrowUp}/></button><button onClick=${() => moveItem(idx, 1)} className="text-slate-500 hover:text-white text-[10px]"><${Icon.ArrowDown}/></button></div>
                                <div className="flex-1 min-w-0"><div className="text-sm font-bold text-white truncate">${r.titulo}</div><div className="text-[10px] text-slate-400 truncate">${r.vocalista}</div></div>
                                <div className="flex items-center gap-2 ml-2"><input className="bg-slate-900 border border-slate-600 rounded w-10 text-center text-white text-xs py-1" value=${getBestTone(r.tono, form.lider)} onInput=${e => {const newRep = [...form.repertorio]; newRep[idx].tono = e.target.value; setForm({...form, repertorio: newRep});}} /><button onClick=${() => {const newRep = form.repertorio.filter((_, i) => i !== idx); setForm({...form, repertorio: newRep})}} className="text-red-400 p-1"><${Icon.Trash}/></button></div>
                            </div>
                        `)}
                    </div>
                    ${(form.repertorio||[]).length > 0 && isAdmin && html`<button onClick=${() => setShowPlanner(true)} className="w-full py-3 bg-slate-800 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:text-white hover:border-slate-400 transition">+ Agregar Más Canciones</button>`}
                </div>
            `}

            ${tab === 'SETLIST' && html`<div className="space-y-6 text-center pt-4"><button onClick=${copySetlist} className="w-full bg-green-600 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 btn-active"><${Icon.WhatsApp} /> Copiar Setlist</button></div>`}
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020617]/95 border-t border-slate-800 flex gap-3 backdrop-blur z-50">
                <button onClick=${onCancel} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400">Cancelar</button>
                <button onClick=${() => onSave(form)} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold shadow-lg text-white">Guardar Cambios</button>
            </div>
        </div>
    `;
}

function MonthPoster({ servicios }) {
    const [offset, setOffset] = useState(0);
    const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() + offset);
    const monthName = date.toLocaleDateString('es-CO', { month: 'long' });
    const year = date.getFullYear();
    const posterRef = useRef(null);
    const monthServices = servicios.filter(s => { if(!s.fecha) return false; const d = new Date(s.fecha + "T00:00:00"); return d.getMonth() === date.getMonth() && d.getFullYear() === year; }).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    const generatePng = async () => { if (posterRef.current) { try { const canvas = await html2canvas(posterRef.current, { backgroundColor: "#0f172a", scale: 2 }); const link = document.createElement('a'); link.download = `Cronograma-${monthName}.png`; link.href = canvas.toDataURL(); link.click(); } catch (err) { alert("Error"); } } };

    return html`
        <div className="fade-in pb-10">
            <div className="flex justify-between items-center glass p-2 rounded-xl mb-4"><button onClick=${() => setOffset(offset - 1)} className="p-2"><${Icon.ArrowLeft}/></button><span className="font-bold uppercase text-sm">${monthName} ${year}</span><button onClick=${() => setOffset(offset + 1)} className="p-2"><${Icon.ArrowRight}/></button></div>
            <button onClick=${generatePng} className="w-full bg-blue-600 mb-4 p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg btn-active"><${Icon.Download} /> Guardar Imagen (PNG)</button>
            <div ref=${posterRef} className="glass-gold p-6 rounded-xl relative overflow-hidden bg-slate-900"><div className="text-center border-b border-yellow-500/30 pb-4 mb-4"><p className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.3em] mb-1">Cronograma Oficial</p><h2 className="text-2xl font-serif font-bold text-white uppercase">${monthName}</h2></div><div className="space-y-6">${monthServices.map(s => { const d = new Date(s.fecha + "T00:00:00"); return html`<div className="border-l-2 border-yellow-500 pl-4 relative"><div className="flex justify-between items-baseline mb-1"><h3 className="text-lg font-bold text-white capitalize">${d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric' })}</h3><span className="text-[9px] uppercase font-bold text-yellow-500">${s.jornada}</span></div><div className="text-sm mb-2"><span className="text-slate-400 block text-xs">Dirige:</span><strong className="text-white text-base">${s.lider}</strong></div><div className="grid grid-cols-1 gap-1 text-xs text-slate-300"><div><span className="text-yellow-600 font-bold mr-1">Coros:</span>${safeJoin(s.coristas)||'Pendiente'}</div><div><span className="text-blue-500 font-bold mr-1">Músicos:</span>${safeJoin(s.musicos)||'Pendiente'}</div></div></div>`; })}</div><div className="mt-6 text-center opacity-50"><p className="text-[8px] text-slate-500 uppercase tracking-widest">ICC Villa Rosario • Ministerio de Alabanza</p></div></div>
        </div>
    `;
}

// ================= APP PRINCIPAL =================

function App() {
    const [view, setView] = useState('HOME');
    const [data, setData] = useState({ canciones: [], equipo: [], servicios: [], equiposMant: [], historial: [] });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentService, setCurrentService] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [toast, setToast] = useState(null); 
    const [serviceDetail, setServiceDetail] = useState(null); 

    window.showToastCallback = (msg, type) => { setToast({ msg, type }); if(type !== 'loading') setTimeout(() => setToast(null), 3000); };

    useEffect(() => { 
        const savedSession = localStorage.getItem('icc_admin');
        if(savedSession === 'true') setIsAdmin(true);
        setTimeout(() => {
            if (!localStorage.getItem('icc_tutorial_seen')) setView('HOME'); 
        }, 3500);
        fetchData(); 
    }, []);

    const fetchData = () => { callGasApi('getInitialData').then(res => { if (res.status === 'success') setData(res.data); setLoading(false); }); };
    const handleLogin = () => { if(passwordInput === '1234' || passwordInput === '6991') { setIsAdmin(true); localStorage.setItem('icc_admin', 'true'); setShowLogin(false); setPasswordInput(""); } else { alert("Contraseña incorrecta"); } };
    const handleLogout = () => { setIsAdmin(false); localStorage.removeItem('icc_admin'); };
    const handleSaveService = (srv) => {
        const newData = {...data}; const idx = newData.servicios.findIndex(s => s.id === srv.id);
        if(idx >= 0) newData.servicios[idx] = srv; else newData.servicios.push(srv);
        setData(newData); setView('HOME'); callGasApi('saveService', srv, '1234');
    };
    const handleGenerateHistory = (id) => { if(confirm("¿Cerrar servicio?")) callGasApi('generateHistory', { idServicio: id }, '1234').then(() => { alert("Cerrado"); fetchData(); }); };

    if (loading) return html`<${SplashScreen} />`;
    
    return html`
        <div className="bg-universe min-h-screen pb-12 font-sans text-slate-200">
            ${toast && html`<${Toast} message=${toast.msg} type=${toast.type} />`}
            ${serviceDetail && html`<${ServiceDetailModal} service=${serviceDetail} teamData=${data.equipo} onClose=${() => setServiceDetail(null)} />`}
            ${!localStorage.getItem('icc_tutorial_seen') && html`<${Manual} onClose=${() => localStorage.setItem('icc_tutorial_seen', 'true')} />`}
            
            ${view !== 'HOME' && html`<div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur border-b border-white/5 p-4 flex items-center shadow-lg"><button onClick=${() => setView('HOME')} className="bg-slate-800 p-2 rounded-full mr-3 text-slate-300 btn-active"><${Icon.ArrowLeft} /></button><h2 className="font-bold text-white uppercase tracking-wider text-sm">${view === 'TEAM' ? 'Equipo' : view}</h2></div>`}

            <div className="px-4 pt-6 max-w-lg mx-auto fade-in">
                ${view === 'HOME' && html`
                    <div className="flex justify-between items-center mb-4">${!isAdmin ? html`<button onClick=${()=>setShowLogin(true)} className="text-xs text-slate-500 flex items-center gap-1 ml-auto"><${Icon.Lock}/> Director</button>` : html`<button onClick=${handleLogout} className="text-xs text-yellow-500 flex items-center gap-1 font-bold ml-auto"><${Icon.Unlock}/> Salir</button>`}</div>
                    <div className="text-center mb-6"><div className="inline-block px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-3"><span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.2em]">ICC Villa Rosario</span></div><h1 className="text-3xl font-serif text-white italic">Panel de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 font-cinzel font-bold not-italic">Adoración</span></h1></div>
                    <${UpcomingServicesList} servicios=${data.servicios} onEdit=${(s) => { setCurrentService(s); setView('SERVICE_EDITOR'); }} onViewDetail=${(s) => setServiceDetail(s)} onNew=${() => { if(isAdmin) { setCurrentService({ id: null, fecha: new Date().toISOString().split('T')[0], jornada: 'Mañana', estado: 'Borrador', lider: '', coristas: [], musicos: [], repertorio: [] }); setView('SERVICE_EDITOR'); } else { alert("Solo Admin"); } }} onHistory=${handleGenerateHistory} isAdmin=${isAdmin} />
                    <div className="grid grid-cols-2 gap-3 mb-6"><button onClick=${() => setView('POSTER')} className="glass-gold p-4 rounded-xl flex flex-col items-center gap-2 btn-active"><${Icon.Calendar} /><span className="font-bold text-xs text-yellow-100">Cronograma</span></button><button onClick=${() => setView('HISTORY')} className="glass p-4 rounded-xl flex flex-col items-center gap-2 btn-active hover:bg-slate-800 border border-slate-700"><${Icon.History} /><span className="font-bold text-xs text-white">Historial</span></button></div>
                    <div className="space-y-3"><button onClick=${() => setView('TEAM')} className="w-full glass p-4 rounded-xl flex items-center justify-between btn-active"><div className="flex items-center gap-4"><div className="text-teal-400"><${Icon.Users} /></div><div className="text-left"><div className="font-bold text-white text-sm">Equipo</div></div></div></button><button onClick=${() => setView('MAINTENANCE')} className="w-full glass p-4 rounded-xl flex items-center justify-between btn-active border-l-4 border-l-purple-500"><div className="flex items-center gap-4"><div className="text-purple-400"><${Icon.Wrench} /></div><div className="text-left"><div className="font-bold text-white text-sm">Mantenimiento</div></div></div></button></div>
                `}
                ${view === 'TEAM' && html`<${TeamManager} data=${data.equipo} isAdmin=${isAdmin} refresh=${fetchData} />`}
                ${view === 'SERVICE_EDITOR' && html`<${ServiceEditor} service=${currentService} data=${data} isAdmin=${isAdmin} onSave=${handleSaveService} onCancel=${() => setView('HOME')} onViewDetail=${(s)=>setServiceDetail(s)} />`}
                ${view === 'POSTER' && html`<${MonthPoster} servicios=${data.servicios} />`}
                ${view === 'MAINTENANCE' && html`<${MaintenanceView} data=${data.equiposMant} isAdmin=${isAdmin} refresh=${fetchData} />`}
                ${view === 'HISTORY' && html`<${HistoryView} data=${data.historial} />`}
            </div>
            ${showLogin && html`<div className="bg-universe fixed inset-0 z-[80] flex flex-col items-center justify-center p-6 fade-in"><div className="glass p-8 rounded-2xl w-full max-w-sm text-center"><h2 className="text-white font-serif text-2xl mb-4">Acceso Director</h2><input type="password" className="input-dark mb-4 text-center text-xl tracking-widest" placeholder="PIN" value=${passwordInput} onInput=${e=>setPasswordInput(e.target.value)} /><div className="flex gap-2"><button onClick=${()=>setShowLogin(false)} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400">Cancelar</button><button onClick=${handleLogin} className="flex-1 py-3 bg-yellow-600 rounded-xl text-black font-bold">Entrar</button></div></div></div>`}
        </div>
    `;
}

// ================= RENDER FINAL =================
ReactDOM.render(html`<${App} />`, document.getElementById('root'));
