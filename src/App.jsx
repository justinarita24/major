import { useState, useEffect, useCallback } from "react";

const COURSES = [
  {
    name: "Ala Wai Golf Course",
    pars: [4, 3, 5, 4, 3, 4, 4, 3, 4, 5, 3, 4, 5, 4, 3, 4, 4, 4],
    yards: [363, 196, 525, 351, 170, 370, 354, 205, 360, 500, 210, 440, 552, 354, 173, 333, 378, 374],
  },
  {
    name: "Kapolei Golf Club",
    pars: [4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 5, 4, 4, 3, 4, 5, 4],
    yards: [380, 410, 175, 395, 530, 420, 195, 365, 510, 405, 165, 520, 390, 435, 180, 400, 545, 415],
  },
  {
    name: "Ko Olina Golf Club",
    pars: [5, 4, 4, 3, 5, 4, 4, 3, 4, 4, 4, 3, 5, 5, 4, 3, 4, 4],
    yards: [518, 412, 362, 203, 528, 373, 444, 195, 438, 413, 355, 183, 514, 516, 353, 227, 353, 428],
  },
  {
    name: "Coral Creek Golf Course",
    pars: [4, 5, 3, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4],
    yards: [370, 505, 160, 385, 410, 395, 175, 525, 400, 390, 155, 510, 375, 420, 170, 405, 530, 395],
  },
  {
    name: "Hawaii Prince Golf Club",
    pars: [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4],
    yards: [395, 185, 540, 410, 380, 165, 425, 520, 405, 415, 535, 170, 390, 440, 550, 190, 400, 420],
  },
  {
    name: "Mililani Golf Club",
    pars: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 3, 5, 4, 5],
    yards: [416, 311, 151, 531, 408, 403, 189, 491, 434, 403, 322, 214, 362, 401, 174, 492, 383, 502],
  },
  {
    name: "Royal Kunia Country Club",
    pars: [5, 4, 4, 4, 3, 4, 4, 3, 5, 5, 4, 4, 3, 4, 4, 4, 3, 5],
    yards: [552, 406, 432, 414, 207, 423, 368, 200, 621, 609, 412, 329, 198, 349, 391, 421, 180, 495],
  },
  {
    name: "Ted Makalena Golf Course",
    pars: [4, 4, 5, 3, 4, 3, 5, 4, 5, 5, 3, 4, 4, 3, 4, 4, 3, 4],
    yards: [432, 370, 466, 140, 310, 130, 487, 474, 440, 481, 150, 387, 400, 150, 387, 317, 107, 388],
  },
  {
    name: "Turtle Bay (Palmer)",
    pars: [4, 4, 5, 3, 4, 4, 4, 3, 5, 4, 5, 4, 5, 4, 3, 4, 3, 4],
    yards: [340, 338, 452, 180, 381, 367, 337, 155, 511, 410, 530, 390, 540, 400, 195, 410, 200, 420],
  },
  {
    name: "Waikele Country Club",
    pars: [4, 4, 4, 4, 3, 4, 5, 3, 5, 4, 3, 5, 4, 4, 5, 4, 3, 4],
    yards: [399, 346, 367, 300, 184, 409, 546, 167, 559, 322, 209, 507, 418, 409, 550, 378, 201, 392],
  },
  {
    name: "Custom Course",
    pars: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    yards: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    editable: true,
  },
];

const HDCP_HOLES_18 = [1,3,5,7,9,11,13,15,17,2,4,6,8,10,12,14,16,18];

function getStrokesOnHole(handicap, holeIndex) {
  const rank = HDCP_HOLES_18[holeIndex];
  if (handicap >= 18) {
    const extra = handicap - 18;
    const extraRank = HDCP_HOLES_18[holeIndex];
    return 1 + (extraRank <= extra ? 1 : 0);
  }
  return rank <= handicap ? 1 : 0;
}

function sumArr(arr) {
  return arr.reduce((s, v) => s + (v || 0), 0);
}

// ──────────── STORAGE HELPERS ────────────
function loadGames() {
  try {
    const r = localStorage.getItem("majors-games");
    return r ? JSON.parse(r) : [];
  } catch { return []; }
}
function saveGames(games) {
  try { localStorage.setItem("majors-games", JSON.stringify(games)); } catch (e) { console.error(e); }
}
function loadActive() {
  try {
    const r = localStorage.getItem("majors-active");
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}
function saveActive(game) {
  try { localStorage.setItem("majors-active", JSON.stringify(game)); } catch (e) { console.error(e); }
}
function clearActive() {
  try { localStorage.removeItem("majors-active"); } catch (e) { console.error(e); }
}
function loadCustomCourses() {
  try {
    const r = localStorage.getItem("majors-custom-courses");
    return r ? JSON.parse(r) : [];
  } catch { return []; }
}
function saveCustomCourses(courses) {
  try { localStorage.setItem("majors-custom-courses", JSON.stringify(courses)); } catch (e) { console.error(e); }
}

// ──────────── COMPONENTS ────────────

function HomeScreen({ onNewGame, onResume, onHistory, hasActive, gameCount }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, fontFamily: "'EB Garamond', Georgia, serif" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 14, letterSpacing: 6, color: "#c8a951", fontFamily: "'Outfit', sans-serif", fontWeight: 600, marginBottom: 8 }}>THE</div>
        <h1 style={{ fontSize: 64, fontWeight: 700, color: "#1a3a1a", margin: 0, lineHeight: 1 }}>Majors</h1>
        <div style={{ width: 80, height: 2, background: "#c8a951", margin: "16px auto" }} />
        <p style={{ color: "#4a6a4a", fontSize: 16, fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>Stroke Play Scorecard</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        {hasActive && (
          <button onClick={onResume} style={btnStyle("#c8a951", "#1a1a0a")}>
            Resume Round
          </button>
        )}
        <button onClick={onNewGame} style={btnStyle("#1a3a1a", "#fff")}>
          New Round
        </button>
        <button onClick={onHistory} style={{ ...btnStyle("transparent", "#1a3a1a"), border: "2px solid #1a3a1a" }}>
          History {gameCount > 0 && `(${gameCount})`}
        </button>
      </div>
    </div>
  );
}

function SetupScreen({ onStart, onBack, customCourses }) {
  const [players, setPlayers] = useState([
    { name: "Justin", hdcp: 2 },
    { name: "Cole", hdcp: 15 },
    { name: "Jordan", hdcp: 20 },
    { name: "Andy", hdcp: 8 },
  ]);
  const [courseIdx, setCourseIdx] = useState(0);
  const [customPars, setCustomPars] = useState([...COURSES[3].pars]);
  const [courseName, setCourseName] = useState("");
  const allCourses = [...COURSES.slice(0, -1), ...customCourses, COURSES[COURSES.length - 1]];
  const customStart = COURSES.length - 1;

  const addPlayer = () => { if (players.length < 6) setPlayers([...players, { name: "", hdcp: 0 }]); };
  const removePlayer = (i) => { if (players.length > 2) setPlayers(players.filter((_, j) => j !== i)); };
  const updatePlayer = (i, field, val) => {
    const p = [...players];
    p[i] = { ...p[i], [field]: field === "hdcp" ? Math.max(0, Math.min(36, parseInt(val) || 0)) : val };
    setPlayers(p);
  };

  const selectedCourse = allCourses[courseIdx];
  const isCustom = selectedCourse?.editable;

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length < 2) return;
    const pars = isCustom ? [...customPars] : [...selectedCourse.pars];
    const name = isCustom ? (courseName.trim() || "Custom Course") : selectedCourse.name;
    onStart(validPlayers, { name, pars, yards: selectedCourse.yards });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px", fontFamily: "'Outfit', sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <button onClick={onBack} style={linkBtn}>← Back</button>

      <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 32, color: "#1a3a1a", marginTop: 16 }}>Round Setup</h2>

      {/* Course Selection */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Course</label>
        <select
          value={courseIdx}
          onChange={e => setCourseIdx(parseInt(e.target.value))}
          style={selectStyle}
        >
          {allCourses.map((c, i) => (
            <option key={i} value={i}>{c.editable ? "＋ Custom Course" : c.name}</option>
          ))}
        </select>
        {!isCustom && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {selectedCourse.pars.map((p, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: 4, background: p === 3 ? "#e8d4a0" : p === 5 ? "#2d5a2d" : "#f5f0e8", color: p === 5 ? "#fff" : "#1a3a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                {p}
              </div>
            ))}
            <div style={{ fontSize: 12, color: "#7a8a7a", display: "flex", alignItems: "center", marginLeft: 4 }}>
              Par {sumArr(selectedCourse.pars)}
            </div>
          </div>
        )}
        {isCustom && (
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="Course name"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              style={{ ...inputStyle, marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, color: "#7a8a7a", marginBottom: 6 }}>Tap par values to change (3/4/5):</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {customPars.map((p, i) => (
                <button key={i} onClick={() => {
                  const next = p === 3 ? 4 : p === 4 ? 5 : 3;
                  const np = [...customPars]; np[i] = next; setCustomPars(np);
                }} style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #d4c9b0", background: p === 3 ? "#e8d4a0" : p === 5 ? "#2d5a2d" : "#f5f0e8", color: p === 5 ? "#fff" : "#1a3a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {p}
                </button>
              ))}
              <div style={{ fontSize: 12, color: "#7a8a7a", display: "flex", alignItems: "center", marginLeft: 4 }}>
                Par {sumArr(customPars)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Players */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Players</label>
        {players.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input
              placeholder={`Player ${i + 1}`}
              value={p.name}
              onChange={e => updatePlayer(i, "name", e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={() => updatePlayer(i, "hdcp", p.hdcp - 1)} style={stepBtn}>−</button>
              <div style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#1a3a1a" }}>{p.hdcp}</div>
              <button onClick={() => updatePlayer(i, "hdcp", p.hdcp + 1)} style={stepBtn}>+</button>
              <span style={{ fontSize: 10, color: "#7a8a7a", width: 28 }}>hdcp</span>
            </div>
            {players.length > 2 && (
              <button onClick={() => removePlayer(i)} style={{ ...stepBtn, color: "#a55", border: "1px solid #daa" }}>×</button>
            )}
          </div>
        ))}
        {players.length < 6 && (
          <button onClick={addPlayer} style={{ ...linkBtn, fontSize: 13, marginTop: 4 }}>+ Add Player</button>
        )}
      </div>

      <button onClick={handleStart} style={{ ...btnStyle("#1a3a1a", "#fff"), width: "100%", marginTop: 16 }}>
        Start Round
      </button>
    </div>
  );
}

function ScorecardScreen({ game, setGame, onFinish, onDelete, onBack }) {
  const { players, course, scores } = game;
  const [activeHole, setActiveHole] = useState(() => {
    for (let h = 0; h < 18; h++) {
      if (players.some((_, pi) => !scores[pi][h])) return h;
    }
    return 0;
  });
  const [tab, setTab] = useState("input"); // input | card
  const [confirmAction, setConfirmAction] = useState(null); // "save" | "delete" | null

  const updateScore = (pi, hole, val) => {
    const ns = scores.map(s => [...s]);
    ns[pi][hole] = Math.max(0, Math.min(15, val));
    const ng = { ...game, scores: ns };
    setGame(ng);
    saveActive(ng);
  };

  const holeComplete = players.every((_, pi) => scores[pi][activeHole] > 0);
  const roundComplete = players.every((_, pi) => scores[pi].every(s => s > 0));
  const par = course.pars[activeHole];

  const getGrossTotal = (pi) => sumArr(scores[pi]);
  const getNetTotal = (pi) => {
    let net = 0;
    for (let h = 0; h < 18; h++) {
      if (scores[pi][h]) {
        net += scores[pi][h] - getStrokesOnHole(players[pi].hdcp, h);
      }
    }
    return net;
  };
  const getNetOnHole = (pi, h) => {
    if (!scores[pi][h]) return null;
    return scores[pi][h] - getStrokesOnHole(players[pi].hdcp, h);
  };
  const getRelPar = (pi) => {
    let rel = 0;
    for (let h = 0; h < 18; h++) {
      if (scores[pi][h]) {
        const net = scores[pi][h] - getStrokesOnHole(players[pi].hdcp, h);
        rel += net - course.pars[h];
      }
    }
    return rel;
  };

  const standings = players.map((p, i) => ({ ...p, idx: i, gross: getGrossTotal(i), net: getNetTotal(i), relPar: getRelPar(i) }))
    .sort((a, b) => {
      if (a.net === 0 && b.net === 0) return 0;
      if (a.net === 0) return 1;
      if (b.net === 0) return -1;
      return a.relPar - b.relPar;
    });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Outfit', sans-serif", maxWidth: 700, margin: "0 auto", padding: "16px 8px", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 8px", marginBottom: 12 }}>
        <button onClick={onBack} style={linkBtn}>← Menu</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1a3a1a" }}>The Majors</div>
          <div style={{ fontSize: 11, color: "#7a8a7a" }}>{course.name} · Par {sumArr(course.pars)}</div>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Leaderboard Strip */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 8px", marginBottom: 16 }}>
        {standings.map((p, rank) => (
          <div key={p.idx} style={{ minWidth: 80, background: rank === 0 && p.net > 0 ? "#f8f4e8" : "#f8f8f6", borderRadius: 8, padding: "8px 10px", textAlign: "center", border: rank === 0 && p.net > 0 ? "2px solid #c8a951" : "1px solid #e8e4d8", flex: "1 0 auto" }}>
            <div style={{ fontSize: 10, color: "#7a8a7a", marginBottom: 2 }}>{rank === 0 ? "🏆" : `#${rank + 1}`}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a3a1a", whiteSpace: "nowrap" }}>{p.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: p.relPar < 0 ? "#b22" : p.relPar === 0 ? "#1a3a1a" : "#4a6a4a" }}>
              {p.net === 0 ? "E" : p.relPar === 0 ? "E" : p.relPar > 0 ? `+${p.relPar}` : p.relPar}
            </div>
            <div style={{ fontSize: 10, color: "#999" }}>Net {p.net || "-"}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #e8e4d8", marginBottom: 16, padding: "0 8px" }}>
        {["input", "card"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", borderBottom: tab === t ? "2px solid #1a3a1a" : "2px solid transparent", fontWeight: tab === t ? 700 : 400, color: tab === t ? "#1a3a1a" : "#999", fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
            {t === "input" ? "Score Entry" : "Full Card"}
          </button>
        ))}
      </div>

      {tab === "input" ? (
        <div style={{ padding: "0 8px" }}>
          {/* Hole Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button onClick={() => setActiveHole(Math.max(0, activeHole - 1))} disabled={activeHole === 0} style={{ ...stepBtn, opacity: activeHole === 0 ? 0.3 : 1, width: 36, height: 36, fontSize: 18 }}>‹</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#c8a951", fontWeight: 600 }}>HOLE</div>
              <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 48, fontWeight: 700, color: "#1a3a1a", lineHeight: 1 }}>{activeHole + 1}</div>
              <div style={{ fontSize: 13, color: "#7a8a7a" }}>Par {par}{course.yards[activeHole] > 0 ? ` · ${course.yards[activeHole]} yds` : ""}</div>
            </div>
            <button onClick={() => setActiveHole(Math.min(17, activeHole + 1))} disabled={activeHole === 17} style={{ ...stepBtn, opacity: activeHole === 17 ? 0.3 : 1, width: 36, height: 36, fontSize: 18 }}>›</button>
          </div>

          {/* Hole Quick Nav */}
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
            {Array.from({ length: 18 }, (_, h) => {
              const done = players.every((_, pi) => scores[pi][h] > 0);
              return (
                <button key={h} onClick={() => setActiveHole(h)} style={{ width: 28, height: 24, borderRadius: 4, border: h === activeHole ? "2px solid #1a3a1a" : "1px solid #ddd", background: done ? "#e8f0e8" : h === activeHole ? "#1a3a1a" : "#fff", color: h === activeHole ? "#fff" : "#555", fontSize: 10, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                  {h + 1}
                </button>
              );
            })}
          </div>

          {/* Score Inputs */}
          {players.map((p, pi) => {
            const sc = scores[pi][activeHole] || 0;
            const grossRel = sc ? sc - par : null;
            const grossLabel = grossRel === null ? "" : grossRel <= -3 ? "Albatross" : grossRel === -2 ? "Eagle" : grossRel === -1 ? "Birdie" : grossRel === 0 ? "Par" : grossRel === 1 ? "Bogey" : grossRel === 2 ? "Double" : grossRel === 3 ? "Triple" : `+${grossRel}`;
            const grossColor = grossRel === null ? "#999" : grossRel <= -2 ? "#c8a951" : grossRel === -1 ? "#b22" : grossRel === 0 ? "#1a3a1a" : "#2d5a8d";
            return (
              <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "12px 14px", background: "#f8f8f6", borderRadius: 10, border: "1px solid #e8e4d8" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a3a1a" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>
                    {p.hdcp} hdcp
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => updateScore(pi, activeHole, Math.max(0, sc - 1))} style={{ ...stepBtn, width: 32, height: 32 }}>−</button>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, background: !sc ? "#e4e0d8" : grossRel < -1 ? "#c8a951" : grossRel === -1 ? "#b22" : grossRel === 0 ? "#1a3a1a" : grossRel === 1 ? "#2d5a8d" : grossRel === 2 ? "#5a8abc" : "#78a", color: !sc ? "#999" : "#fff" }}>
                    {sc || "E"}
                  </div>
                  <button onClick={() => updateScore(pi, activeHole, sc + 1)} style={{ ...stepBtn, width: 32, height: 32 }}>+</button>
                </div>
                <div style={{ width: 50, textAlign: "center", fontSize: 11, fontWeight: 600, color: grossColor }}>
                  {grossLabel}
                </div>
              </div>
            );
          })}

          {holeComplete && activeHole < 17 && (
            <button onClick={() => setActiveHole(activeHole + 1)} style={{ ...btnStyle("#1a3a1a", "#fff"), width: "100%", marginTop: 12 }}>
              Next Hole →
            </button>
          )}

          {/* Round Actions */}
          {confirmAction ? (
            <div style={{ marginTop: 24, padding: 16, background: confirmAction === "delete" ? "#fdf0f0" : "#f8f4e8", borderRadius: 10, border: `1px solid ${confirmAction === "delete" ? "#daa" : "#d4c9b0"}`, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a3a1a", marginBottom: 12 }}>
                {confirmAction === "save" ? "Save this round to history?" : "Delete this round? This cannot be undone."}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => { setConfirmAction(null); if (confirmAction === "save") onFinish(); else onDelete(); }} style={{ ...btnStyle(confirmAction === "delete" ? "#a55" : "#c8a951", "#fff"), padding: "10px 24px" }}>
                  {confirmAction === "save" ? "Yes, Save" : "Yes, Delete"}
                </button>
                <button onClick={() => setConfirmAction(null)} style={{ ...btnStyle("transparent", "#1a3a1a"), padding: "10px 24px", border: "1px solid #ccc" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmAction("save")} style={{ ...btnStyle("#c8a951", "#1a1a0a"), flex: 1 }}>
                Save Round
              </button>
              <button onClick={() => setConfirmAction("delete")} style={{ ...btnStyle("transparent", "#a55"), flex: 1, border: "2px solid #daa" }}>
                Delete Round
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Full Scorecard */
        <div style={{ overflowX: "auto", padding: "0 4px" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#1a3a1a", color: "#fff" }}>
                <th style={thStyle}>Hole</th>
                {Array.from({ length: 9 }, (_, i) => <th key={i} style={thStyle}>{i + 1}</th>)}
                <th style={{ ...thStyle, background: "#2d5a2d" }}>OUT</th>
                {Array.from({ length: 9 }, (_, i) => <th key={i + 9} style={thStyle}>{i + 10}</th>)}
                <th style={{ ...thStyle, background: "#2d5a2d" }}>IN</th>
                <th style={{ ...thStyle, background: "#c8a951", color: "#1a1a0a" }}>TOT</th>
                <th style={{ ...thStyle, background: "#c8a951", color: "#1a1a0a" }}>NET</th>
              </tr>
              <tr style={{ background: "#e8e4d8" }}>
                <td style={tdStyle}>Par</td>
                {course.pars.slice(0, 9).map((p, i) => <td key={i} style={tdStyle}>{p}</td>)}
                <td style={{ ...tdStyle, fontWeight: 700 }}>{sumArr(course.pars.slice(0, 9))}</td>
                {course.pars.slice(9).map((p, i) => <td key={i} style={tdStyle}>{p}</td>)}
                <td style={{ ...tdStyle, fontWeight: 700 }}>{sumArr(course.pars.slice(9))}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{sumArr(course.pars)}</td>
                <td style={tdStyle}></td>
              </tr>
            </thead>
            <tbody>
              {players.map((p, pi) => (
                <tr key={pi} style={{ background: pi % 2 === 0 ? "#fff" : "#fafaf6" }}>
                  <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{p.name} ({p.hdcp})</td>
                  {scores[pi].slice(0, 9).map((s, h) => {
                    const r = s ? s - course.pars[h] + getStrokesOnHole(p.hdcp, h) : null;
                    return <td key={h} style={{ ...tdStyle, ...(s ? scoreColor(s - getStrokesOnHole(p.hdcp, h) - course.pars[h]) : {}) }}>{s || ""}</td>;
                  })}
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{sumArr(scores[pi].slice(0, 9)) || ""}</td>
                  {scores[pi].slice(9).map((s, h) => (
                    <td key={h + 9} style={{ ...tdStyle, ...(s ? scoreColor(s - getStrokesOnHole(p.hdcp, h + 9) - course.pars[h + 9]) : {}) }}>{s || ""}</td>
                  ))}
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{sumArr(scores[pi].slice(9)) || ""}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{getGrossTotal(pi) || ""}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "#b22" }}>{getNetTotal(pi) || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HistoryScreen({ games, onBack, onDeleteGame }) {
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (games.length === 0) {
    return (
      <div style={{ minHeight: "100vh", padding: 24, fontFamily: "'Outfit', sans-serif", maxWidth: 600, margin: "0 auto" }}>
        <button onClick={onBack} style={linkBtn}>← Back</button>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 32, color: "#1a3a1a", marginTop: 16 }}>History</h2>
        <p style={{ color: "#999", marginTop: 40, textAlign: "center" }}>No completed rounds yet. Go play!</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px", fontFamily: "'Outfit', sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <button onClick={onBack} style={linkBtn}>← Back</button>
      <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 32, color: "#1a3a1a", marginTop: 16 }}>History</h2>

      {games.map((g, gi) => {
        const standings = g.players.map((p, pi) => {
          let net = 0;
          for (let h = 0; h < 18; h++) {
            if (g.scores[pi][h]) net += g.scores[pi][h] - getStrokesOnHole(p.hdcp, h);
          }
          let relPar = 0;
          for (let h = 0; h < 18; h++) {
            if (g.scores[pi][h]) {
              const n = g.scores[pi][h] - getStrokesOnHole(p.hdcp, h);
              relPar += n - g.course.pars[h];
            }
          }
          return { ...p, idx: pi, gross: sumArr(g.scores[pi]), net, relPar };
        }).sort((a, b) => a.relPar - b.relPar);

        const winner = standings[0];
        const date = new Date(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return (
          <div key={gi} style={{ marginBottom: 12, border: "1px solid #e8e4d8", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <button onClick={() => setExpanded(expanded === gi ? null : gi)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a3a1a" }}>{g.course.name}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{date} · {g.players.length} players</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#c8a951", fontWeight: 600 }}>🏆 {winner.name}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: winner.relPar < 0 ? "#b22" : "#1a3a1a" }}>
                  {winner.relPar === 0 ? "E" : winner.relPar > 0 ? `+${winner.relPar}` : winner.relPar}
                </div>
              </div>
            </button>
            {expanded === gi && (
              <div style={{ padding: "0 16px 14px", borderTop: "1px solid #eee" }}>
                {standings.map((s, si) => (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: "#555" }}>{si + 1}. {s.name} ({s.hdcp} hdcp)</span>
                    <span style={{ fontWeight: 600 }}>
                      Gross {s.gross} · Net {s.net} ({s.relPar === 0 ? "E" : s.relPar > 0 ? `+${s.relPar}` : s.relPar})
                    </span>
                  </div>
                ))}
                {confirmDelete === gi ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: "#a55" }}>Delete this round?</span>
                    <button onClick={() => { onDeleteGame(gi); setConfirmDelete(null); setExpanded(null); }} style={{ ...linkBtn, color: "#fff", background: "#a55", padding: "4px 10px", borderRadius: 4, fontSize: 11 }}>
                      Yes
                    </button>
                    <button onClick={() => setConfirmDelete(null)} style={{ ...linkBtn, fontSize: 11, color: "#999" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(gi)} style={{ ...linkBtn, color: "#a55", fontSize: 11, marginTop: 8 }}>
                    Delete Round
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ──────────── MAIN APP ────────────

export default function MajorsApp() {
  const [screen, setScreen] = useState("loading");
  const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [customCourses, setCustomCourses] = useState([]);

  useEffect(() => {
    setGames(loadGames());
    setActiveGame(loadActive());
    setCustomCourses(loadCustomCourses());
    setScreen("home");
  }, []);

  const startGame = useCallback((players, course) => {
    const game = {
      players,
      course,
      scores: players.map(() => new Array(18).fill(0)),
      date: new Date().toISOString(),
    };
    setActiveGame(game);
    saveActive(game);
    setScreen("scorecard");
  }, []);

  const finishGame = useCallback(() => {
    if (!activeGame) return;
    const updated = [...games, activeGame];
    setGames(updated);
    saveGames(updated);
    // Save custom course if it was truly custom
    const knownNames = COURSES.map(c => c.name);
    const savedCustomNames = customCourses.map(c => c.name);
    if (!knownNames.includes(activeGame.course.name) && !savedCustomNames.includes(activeGame.course.name)) {
      const updatedCC = [...customCourses, { name: activeGame.course.name, pars: activeGame.course.pars, yards: activeGame.course.yards || new Array(18).fill(0) }];
      setCustomCourses(updatedCC);
      saveCustomCourses(updatedCC);
    }
    setActiveGame(null);
    clearActive();
    setScreen("home");
  }, [activeGame, games, customCourses]);

  const deleteActiveGame = useCallback(() => {
    setActiveGame(null);
    clearActive();
    setScreen("home");
  }, []);

  const deleteGame = useCallback((idx) => {
    const updated = games.filter((_, i) => i !== idx);
    setGames(updated);
    saveGames(updated);
  }, [games]);

  if (screen === "loading") {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Outfit', sans-serif", color: "#999" }}>Loading...</div>;
  }

  return (
    <div style={{ background: "#fefdfb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {screen === "home" && (
        <HomeScreen
          onNewGame={() => setScreen("setup")}
          onResume={() => setScreen("scorecard")}
          onHistory={() => setScreen("history")}
          hasActive={!!activeGame}
          gameCount={games.length}
        />
      )}
      {screen === "setup" && (
        <SetupScreen
          onStart={startGame}
          onBack={() => setScreen("home")}
          customCourses={customCourses}
        />
      )}
      {screen === "scorecard" && activeGame && (
        <ScorecardScreen
          game={activeGame}
          setGame={setActiveGame}
          onFinish={finishGame}
          onDelete={deleteActiveGame}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "history" && (
        <HistoryScreen
          games={games}
          onBack={() => setScreen("home")}
          onDeleteGame={deleteGame}
        />
      )}
    </div>
  );
}

// ──────────── STYLES ────────────

function btnStyle(bg, color) {
  return {
    background: bg,
    color,
    border: "none",
    borderRadius: 8,
    padding: "14px 24px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: 0.5,
    transition: "opacity 0.2s",
  };
}

function scoreColor(relPar) {
  if (relPar <= -2) return { background: "#c8a951", color: "#fff", fontWeight: 700 };
  if (relPar === -1) return { background: "#cc3333", color: "#fff", fontWeight: 700 };
  if (relPar === 0) return {};
  if (relPar === 1) return { background: "#d0d8e8", fontWeight: 600 };
  return { background: "#b8c8e0", fontWeight: 600 };
}

const linkBtn = { background: "none", border: "none", color: "#1a3a1a", fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 500 };
const stepBtn = { width: 28, height: 28, borderRadius: "50%", border: "1px solid #d4c9b0", background: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a3a1a", padding: 0 };
const sectionStyle = { marginBottom: 24, padding: "16px", background: "#f8f8f6", borderRadius: 12, border: "1px solid #e8e4d8" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#1a3a1a", textTransform: "uppercase", marginBottom: 10 };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d4c9b0", borderRadius: 6, fontSize: 14, fontFamily: "'Outfit', sans-serif", background: "#fff", boxSizing: "border-box", outline: "none" };
const selectStyle = { ...inputStyle, cursor: "pointer" };
const thStyle = { padding: "6px 5px", fontSize: 11, fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" };
const tdStyle = { padding: "5px 5px", textAlign: "center", fontSize: 11, borderBottom: "1px solid #eee" };
