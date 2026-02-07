/**
 * APP.JS - VERSIÓN 7.4 (ESTABILIDAD)
 * Corrección: Sintaxis simplificada para evitar ReferenceErrors ocultos.
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyevrQgX1ifj-hKDnkZBXuoSA_M6blg3zz3rbC-9In7QrXbn5obsCxZZbDj7sl5aQMxxA/exec";

// 1. CONFIGURACIÓN REACT
const html = htm.bind(React.createElement);
const { useState, useEffect, useRef } = React;
let showToastCallback = null;

// 2. UTILIDADES Y API
async function callGasApi(action, payload = {}, password = "") {
    try {
        if(showToastCallback && (action.startsWith('save') || action.startsWith('delete'))) showToastCallback("Procesando...", "loading");
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify({ action, payload, password })
        });
        const result = await response.json();
        if(showToastCallback) showToastCallback(result.status === 'success' ? "Éxito" : "Error", result.status === 'success' ? "success" : "error");
        return result;
    } catch (error) {
        console.error(error);
        if(showToastCallback) showToastCallback("Error de Red", "error");
        return { status: "error", message: "Error red" };
    }
}

const SafeText = ({ content }) => content ? String(content) : "";
const safeJoin = (list) => Array.isArray(list) ? list.join(", ") : String(list);
const getBestTone = (raw, singer) => {
    try {
        if(!raw) return "";
        let obj = raw;
        if(typeof raw === 'string' && raw.startsWith('{')) obj = JSON.parse(raw);
        return (typeof obj === 'object') ? (obj[singer] || obj["Original"] || "") : raw;
    } catch(e) { return raw; }
};

// 3. ICONOS
const Icon = {
    Music: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    Users: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Calendar: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>`,
    Trash: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    Edit: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    Plus: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    Wrench: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    History: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`
};

// 4. COMPONENTES

function Toast({ message, type }) {
    const color = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    return html`<div className="fixed top-5 right-5 z-50"><div className=${`${color} text-white px-4 py-2 rounded shadow-lg text-sm`}>${message}</div></div>`;
}

function SearchableUserSelect({ allUsers, selectedUsers, onAdd, onRemove, placeholder }) {
    const [q, setQ] = useState("");
    const [res, setRes] = useState([]);
    
    const search = (e) => {
        const v = e.target.value; setQ(v);
        if(v) setRes(allUsers.filter(u => u.nombre.toLowerCase().includes(v.toLowerCase()) && !selectedUsers.includes(u.nombre)));
        else setRes([]);
    };
    
    return html`
        <div className="mb-2 relative">
            <input className="input-dark w-full" placeholder=${placeholder} value=${q} onInput=${search} />
            ${res.length > 0 && html`<div className="absolute z-10 w-full bg-slate-800 border border-slate-700 mt-1 max-h-32 overflow-y-auto">${res.map(u => html`<div className="p-2 hover:bg-slate-700 cursor-pointer text-sm" onClick=${() => { onAdd(u.nombre); setQ(""); setRes([]); }}>${u.nombre}</div>`)}</div>`}
            <div className="flex flex-wrap gap-1 mt-2">${selectedUsers.map(u => html`<span className="bg-slate-700 text-xs px-2 py-1 rounded flex items-center gap-1">${u}<button onClick=${()=>onRemove(u)} className="text-red-400">x</button></span>`)}</div>
        </div>
    `;
}

function RepertoirePlanner({ data, teamData, onAddSongs, onClose }) {
    const [rows, setRows] = useState([{ id: Date.now(), titulo: '', vocalista: '', tipo: 'Rápida', estilo: '', tono: '', link: '', isNew: true }]);
    const [activeTab, setActiveTab] = useState('Rápida');
    
    // Lista de biblioteca
    const library = data.filter(s => s.tipo === activeTab || (activeTab === 'Rápida' && s.ritmo === 'Rápida') || (activeTab === 'Lenta' && s.ritmo === 'Lenta'));

    const addRow = () => setRows([...rows, { id: Date.now(), titulo: '', isNew: true, tipo: activeTab }]);
    const updateRow = (id, f, v) => setRows(rows.map(r => r.id===id ? {...r, [f]:v} : r));
    const handleSelect = (song) => setRows([...rows, { ...song, id: Date.now(), isNew: false, dbId: song.id }]);

    const save = () => {
        const valid = rows.filter(r => r.titulo);
        if(!valid.length) return;
        
        // Crear nuevas
        const toCreate = valid.filter(r => r.isNew).map(r => ({ ...r, titulo: r.titulo.toUpperCase() }));
        if(toCreate.length) callGasApi('saveSongsBatch', toCreate);
        
        onAddSongs(valid.map(r => ({ ...r, id: r.dbId || "TEMP-"+Date.now() })));
        onClose();
    };

    return html`
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between bg-slate-900">
                <h2 className="text-white font-bold">Planificador</h2>
                <button onClick=${onClose} className="text-red-400">Cerrar</button>
            </div>
            
            <div className="p-4 bg-slate-900 max-h-[40vh] overflow-y-auto border-b border-slate-700">
                <h3 className="text-xs text-blue-400 font-bold mb-2">SELECCIÓN ACTUAL</h3>
                ${rows.map((r, i) => html`
                    <div key=${r.id} className="mb-2 p-2 border border-slate-700 rounded bg-slate-800">
                        <input className="input-dark w-full mb-1 text-sm font-bold" placeholder="Título" value=${r.titulo} onInput=${e=>updateRow(r.id,'titulo',e.target.value)} />
                        <div className="flex gap-1">
                            <input className="input-dark flex-1 text-xs" placeholder="Vocalista" value=${r.vocalista||''} onInput=${e=>updateRow(r.id,'vocalista',e.target.value)} />
                            <input className="input-dark w-16 text-xs" placeholder="Tono" value=${r.tono||''} onInput=${e=>updateRow(r.id,'tono',e.target.value)} />
                        </div>
                    </div>
                `)}
                <button onClick=${addRow} className="text-xs text-slate-400 block w-full text-center py-2 border border-dashed border-slate-700 rounded">+ Fila</button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col bg-black">
                <div className="flex gap-2 p-2 overflow-x-auto border-b border-slate-800">
                    ${["Rápida", "Lenta", "Ministración"].map(t => html`
                        <button onClick=${()=>setActiveTab(t)} className=${`px-3 py-1 rounded-full text-xs ${activeTab===t ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>${t}</button>
                    `)}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    ${library.map(s => html`
                        <div onClick=${()=>handleSelect(s)} className="p-3 border-b border-slate-800 hover:bg-slate-900 cursor-pointer flex justify-between items-center">
                            <div>
                                <div className="text-sm text-white font-bold">${s.titulo}</div>
                                <div className="text-xs text-slate-500">${s.vocalista}</div>
                            </div>
                            <div className="text-xs text-yellow-600 bg-yellow-900/20 px-2 rounded">${s.estilo || 'Gral'}</div>
                        </div>
                    `)}
                </div>
            </div>

            <button onClick=${save} className="bg-blue-600 text-white p-4 font-bold text-center">CONFIRMAR SELECCIÓN</button>
        </div>
    `;
}

function ServiceEditor({ service, data, isAdmin, onSave, onCancel }) {
    const [form, setForm] = useState({...service});
    const [view, setView] = useState('MAIN'); // MAIN, PLANNER

    if(view === 'PLANNER') {
        return html`<${RepertoirePlanner} data=${data.canciones} teamData=${data.equipo} onClose=${()=>setView('MAIN')} onAddSongs=${(songs) => {
            setForm({...form, repertorio: [...(form.repertorio||[]), ...songs]});
            setView('MAIN');
        }} />`;
    }

    return html`
        <div className="p-4 pb-20">
            <h2 className="text-xl text-white font-serif mb-4">Editar Servicio</h2>
            <div className="space-y-4">
                <input type="date" className="input-dark w-full" value=${form.fecha} onChange=${e=>setForm({...form, fecha:e.target.value})} />
                <input className="input-dark w-full" placeholder="Líder" value=${form.lider} onChange=${e=>setForm({...form, lider:e.target.value})} />
                
                <div className="bg-slate-900 p-3 rounded-lg">
                    <h3 className="text-yellow-500 text-xs font-bold mb-2">REPERTORIO</h3>
                    ${(form.repertorio||[]).map((s, i) => html`
                        <div key=${i} className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-white text-sm">${i+1}. ${s.titulo}</span>
                            <span className="text-yellow-500 text-xs">${getBestTone(s.tono, form.lider)}</span>
                        </div>
                    `)}
                    <button onClick=${()=>setView('PLANNER')} className="mt-3 w-full bg-slate-800 text-white py-2 rounded border border-dashed border-slate-600 text-sm">+ Agregar Canciones</button>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full p-4 bg-black border-t border-slate-800 flex gap-2">
                <button onClick=${onCancel} className="flex-1 bg-slate-800 text-white py-3 rounded">Cancelar</button>
                <button onClick=${()=>onSave(form)} className="flex-1 bg-blue-600 text-white py-3 rounded">Guardar</button>
            </div>
        </div>
    `;
}

function UpcomingServicesList({ servicios, onEdit, onNew }) {
    // IMPORTANTE: Validación de array para evitar error #130
    const list = Array.isArray(servicios) ? servicios : [];
    const today = new Date().toISOString().split('T')[0];
    const upcoming = list.filter(s => s.fecha >= today).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    return html`
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold">Próximos Servicios</h3>
                <button onClick=${onNew} className="text-blue-400 text-sm font-bold">+ Nuevo</button>
            </div>
            <div className="space-y-3">
                ${upcoming.length === 0 && html`<div className="text-slate-500 text-sm italic">No hay servicios programados.</div>`}
                ${upcoming.map(s => html`
                    <div key=${s.id} onClick=${()=>onEdit(s)} className="glass p-3 rounded-xl border-l-4 border-yellow-500 cursor-pointer">
                        <div className="flex justify-between">
                            <span className="text-white font-bold text-lg">${new Date(s.fecha + 'T00:00').getDate()}</span>
                            <span className="text-slate-400 text-xs uppercase">${s.jornada}</span>
                        </div>
                        <div className="text-slate-300 text-sm">${s.lider || 'Sin Líder'}</div>
                    </div>
                `)}
            </div>
        </div>
    `;
}

function TeamManager({ data }) {
    // Validación de array
    const list = Array.isArray(data) ? data : [];
    return html`
        <div className="space-y-2">
            ${list.map(m => html`
                <div key=${m.id} className="glass p-3 rounded flex justify-between">
                    <span className="text-white">${m.nombre}</span>
                    <span className="text-slate-400 text-xs">${m.rol}</span>
                </div>
            `)}
        </div>
    `;
}

// 5. APP PRINCIPAL
function App() {
    const [view, setView] = useState('HOME');
    const [data, setData] = useState({ canciones: [], equipo: [], servicios: [], equiposMant: [], historial: [] });
    const [loading, setLoading] = useState(true);
    const [currentService, setCurrentService] = useState(null);
    const [toast, setToast] = useState(null);

    // Toast Global
    window.showToastCallback = (msg, type) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        callGasApi('getInitialData').then(res => {
            if(res.status === 'success') setData(res.data);
            setLoading(false);
        });
    }, []);

    const handleSaveService = (srv) => {
        // Optimistic UI
        const newList = [...data.servicios];
        const idx = newList.findIndex(s => s.id === srv.id);
        if(idx >= 0) newList[idx] = srv; else newList.push(srv);
        
        setData({...data, servicios: newList});
        setView('HOME');
        callGasApi('saveService', srv, '1234');
    };

    if(loading) return html`<div className="h-screen flex items-center justify-center text-yellow-500">Cargando...</div>`;

    return html`
        <div className="bg-universe min-h-screen font-sans">
            ${toast && html`<${Toast} message=${toast.msg} type=${toast.type} />`}
            
            <div className="max-w-md mx-auto min-h-screen relative">
                ${view === 'HOME' && html`
                    <div className="p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-serif text-white">ICC ALABANZA</h1>
                            <p className="text-slate-500 text-xs tracking-widest">PANEL DE CONTROL</p>
                        </div>

                        <${UpcomingServicesList} 
                            servicios=${data.servicios} 
                            onEdit=${(s)=>{ setCurrentService(s); setView('EDITOR'); }} 
                            onNew=${()=>{ setCurrentService({ id: null, fecha: new Date().toISOString().split('T')[0], repertorio: [] }); setView('EDITOR'); }} 
                        />
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button onClick=${()=>setView('TEAM')} className="glass p-4 rounded-xl text-center">
                                <div className="text-teal-400 mb-2 flex justify-center"><${Icon.Users}/></div>
                                <span className="text-white text-sm font-bold">Equipo</span>
                            </button>
                            <button onClick=${()=>setView('MAINT')} className="glass p-4 rounded-xl text-center">
                                <div className="text-purple-400 mb-2 flex justify-center"><${Icon.Wrench}/></div>
                                <span className="text-white text-sm font-bold">Equipos</span>
                            </button>
                        </div>
                    </div>
                `}

                ${view === 'EDITOR' && html`
                    <${ServiceEditor} 
                        service=${currentService} 
                        data=${data} 
                        isAdmin=${true} 
                        onSave=${handleSaveService} 
                        onCancel=${()=>setView('HOME')} 
                    />
                `}

                ${view === 'TEAM' && html`
                    <div className="p-4">
                        <button onClick=${()=>setView('HOME')} className="text-slate-400 mb-4">← Volver</button>
                        <h2 className="text-white text-xl font-bold mb-4">Equipo</h2>
                        <${TeamManager} data=${data.equipo} isAdmin=${true} refresh=${()=>{}} />
                    </div>
                `}
            </div>
        </div>
    `;
}

ReactDOM.render(html`<${App} />`, document.getElementById('root'));
