/**
 * SettingsPage → now "Model Info" — shows TrOCR model status, cache, no API keys
 */
const C = {blue:'#1D4ED8',sky:'#3B82F6',skyLight:'#EFF6FF',skyPale:'#DBEAFE',ink:'#0F1729',mid:'#475569',dim:'#94A3B8',line:'#E2E8F0',white:'#fff',green:'#22C55E',greenBg:'#F0FDF4',greenDk:'#166534',amber:'#F59E0B',amberPale:'#FEF3C7',amberDk:'#92400E'};

export default function SettingsPage() {
  return (
    <div style={{padding:'18px 22px',display:'flex',flexDirection:'column',gap:14,maxWidth:780,margin:'0 auto'}}>
      <div style={{background:'linear-gradient(135deg,#0A1A3A,#1D4ED8)',borderRadius:14,padding:'14px 20px'}}>
        <div style={{fontSize:17,fontWeight:800,color:'#fff'}}>ℹ️ About Scribbly</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',marginTop:2}}>Local TrOCR · No API · No rate limits · Fully offline</div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          ['🔒','Zero API calls','No Gemini. No OpenAI. No internet after first model download.'],
          ['⚡','Microsoft TrOCR','Runs locally via ONNX/WebAssembly. Model: trocr-base-handwritten.'],
          ['📦','~340MB one-time','Model downloads once, cached forever in %APPDATA%.'],
          ['🖊️','Improved canvas','Pressure simulation, Bezier smoothing, writing guide lines, DPI-aware.'],
          ['🔄','Reversal detection','Stroke-temporal analysis for b/d/p/q reversals on top of TrOCR.'],
          ['🧩','Fine-tunable','See Training tab to train on dyslexia datasets and use your own model.'],
        ].map(([e,t,d]) => (
          <div key={t} style={{display:'flex',gap:12,alignItems:'flex-start',
            padding:'14px 18px',background:C.white,borderRadius:12,
            border:'1.5px solid '+C.skyPale}}>
            <span style={{fontSize:22,marginTop:1}}>{e}</span>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:C.ink,marginBottom:3}}>{t}</div>
              <div style={{fontSize:13,color:C.mid,lineHeight:1.55}}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'13px 18px',background:C.greenBg,borderRadius:12,
        border:'1.5px solid '+C.green,fontSize:13,fontWeight:600,color:C.greenDk}}>
        ✅ This app never sends any data to any server. All AI runs on your device.
        Child privacy is guaranteed by architecture, not just policy.
      </div>
    </div>
  );
}
