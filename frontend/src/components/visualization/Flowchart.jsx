import React, { useMemo, useState, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { nodeTypes } from "@/components/ui/NodeTypes";

// ---------------- DAGRE SETUP ----------------
const nodeWidth = 180;
const nodeHeight = 70;

function getLayoutedElements(nodes, edges) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const pos = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: pos.x - nodeWidth / 2,
          y: pos.y - nodeHeight / 2,
        },
        sourcePosition: "bottom",
        targetPosition: "top",
      };
    }),
    edges,
  };
}

// ---------------- PALINDROME DRY RUN ENGINE ----------------
// Each step: { nodeId, label, left, right, matched, result }
// nodeId must match your rawNodes ids exactly (adjust if yours differ)
function buildPalindromeSteps(s) {
  if (!s) return [];
  const n = s.length;
  const steps = [];

  steps.push({ nodeId: "start",  label: "Start",                               left: null, right: null, matched: [] });
  steps.push({ nodeId: "input",  label: `Input: "${s}"`,                        left: null, right: null, matched: [] });
  steps.push({ nodeId: "init",   label: `left = 0,  right = ${n - 1}`,          left: 0,    right: n-1,  matched: [] });

  let l = 0, r = n - 1, matched = [];

  while (true) {
    steps.push({
      nodeId: "cond1",
      label: `left < right?  (${l} < ${r})  →  ${l < r}`,
      left: l, right: r, matched: [...matched],
    });

    if (l >= r) {
      steps.push({ nodeId: "palindrome", label: "✓ Is a Palindrome", left: l, right: r, matched: [...matched], result: "yes" });
      steps.push({ nodeId: "end",        label: "End",                left: l, right: r, matched: [...matched] });
      break;
    }

    steps.push({
      nodeId: "cond2",
      label: `s[${l}] == s[${r}]?  ('${s[l]}' == '${s[r]}')  →  ${s[l] === s[r]}`,
      left: l, right: r, matched: [...matched],
    });

    if (s[l] !== s[r]) {
      steps.push({ nodeId: "not_palindrome", label: "✗ Not a Palindrome", left: l, right: r, matched: [...matched], result: "no" });
      steps.push({ nodeId: "end",            label: "End",                left: l, right: r, matched: [...matched] });
      break;
    }

    matched = [...matched, l, r];
    steps.push({
      nodeId: "increment",
      label: `Match! '${s[l]}'  →  left++ = ${l+1},  right-- = ${r-1}`,
      left: l+1, right: r-1, matched: [...matched],
    });
    l++; r--;
  }

  return steps;
}

// ---------------- STRING VISUALIZER ----------------
function StringViz({ s, left, right, matched }) {
  if (!s) return null;
  return (
    <div className="flex flex-wrap gap-1 my-2">
      {s.split("").map((ch, i) => {
        const isMatched = matched?.includes(i);
        const isLeft    = left === i && right !== i;
        const isRight   = right === i && left !== i;
        const isBoth    = left === i && right === i;

        let bg = "bg-zinc-700 border-zinc-600 text-zinc-200";
        if (isMatched) bg = "bg-green-900 border-green-500 text-green-300";
        if (isLeft)    bg = "bg-cyan-900 border-cyan-400 text-cyan-200";
        if (isRight)   bg = "bg-orange-900 border-orange-400 text-orange-200";
        if (isBoth)    bg = "bg-purple-900 border-purple-400 text-purple-200";

        return (
          <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border font-mono text-sm font-bold ${bg}`}>
            {ch}
          </div>
        );
      })}
    </div>
  );
}

// ---------------- RIGHT PANEL ----------------
function DryRunPanel({ activeStep, steps, onNext, onPrev, onReset, inputVal, onInputChange, onRun }) {
  const s = inputVal;
  const st = steps[activeStep];

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto p-4 bg-zinc-900 border-l border-zinc-700 w-80 shrink-0">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Dry Run</p>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-zinc-800 border border-zinc-600 rounded px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
          placeholder="Enter a string…"
          value={inputVal}
          maxLength={16}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onRun()}
        />
        <button
          onClick={onRun}
          className="px-3 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium transition-colors"
        >
          Run
        </button>
      </div>

      {/* String visualizer */}
      {s && steps.length > 0 && (
        <>
          <div className="flex gap-3 text-xs text-zinc-400">
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-cyan-700 border border-cyan-400 mr-1"/>left</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-700 border border-orange-400 mr-1"/>right</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-purple-700 border border-purple-400 mr-1"/>both</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-800 border border-green-500 mr-1"/>matched</span>
          </div>
          <StringViz s={s} left={st?.left ?? null} right={st?.right ?? null} matched={st?.matched ?? []} />
        </>
      )}

      {/* Variable cards */}
      {steps.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "left",     val: st?.left  ?? "—" },
            { label: "right",    val: st?.right ?? "—" },
            { label: "s[left]",  val: st?.left  != null ? s[st.left]  ?? "—" : "—" },
            { label: "s[right]", val: st?.right != null ? s[st.right] ?? "—" : "—" },
          ].map(({ label, val }) => (
            <div key={label} className="bg-zinc-800 rounded p-2 border border-zinc-700">
              <div className="text-xs text-zinc-400">{label}</div>
              <div className="text-lg font-mono font-semibold text-white">{String(val)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Step counter + controls */}
      {steps.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Step {activeStep + 1} / {steps.length}</span>
            <button onClick={onReset} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs">Reset</button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={activeStep === 0}
              className="flex-1 py-1.5 text-sm border border-zinc-600 rounded text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={onNext}
              disabled={activeStep === steps.length - 1}
              className="flex-1 py-1.5 text-sm border border-zinc-600 rounded text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Step log */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          {[...steps].slice(0, activeStep + 1).reverse().map((step, i) => {
            const isActive = i === 0;
            // const isResult = step.result === "yes" || step.result === "no";
            let cls = "border-l-2 pl-2 py-1 text-xs rounded-r ";
            if (isActive && step.result === "yes") cls += "border-green-400 bg-green-950 text-green-300 font-medium";
            else if (isActive && step.result === "no") cls += "border-red-400 bg-red-950 text-red-300 font-medium";
            else if (isActive) cls += "border-cyan-400 bg-zinc-800 text-white";
            else cls += "border-zinc-700 text-zinc-500";

            return <div key={i} className={cls}>{step.label}</div>;
          })}
        </div>
      )}

      {/* Empty state */}
      {steps.length === 0 && (
        <p className="text-sm text-zinc-500 mt-4">Type a string and press Run to start the dry run.</p>
      )}
    </div>
  );
}

// ---------------- COMPONENT ----------------
function VisualTab({ algo }) {
  const rawNodes = algo?.flowChartData?.rawNodes || [];
  const rawEdges = algo?.flowChartData?.rawEdges || [];

  // Dry run state
  const [inputVal,   setInputVal]   = useState("");
  const [steps,      setSteps]      = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const activeNodeId = steps[activeStep]?.nodeId ?? null;

  const handleRun = useCallback(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    const s = buildPalindromeSteps(trimmed);
    setSteps(s);
    setActiveStep(0);
  }, [inputVal]);

  // Styled edges — unchanged from your original
  const styledEdges = useMemo(() => {
    return rawEdges.map((edge) => ({
      ...edge,
      type: "smoothstep",
      animated: true,
      labelStyle: { fontWeight: "bold", fill: "#000" },
      style: { strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#fff" },
    }));
  }, [rawEdges]);

  // Dagre layout — unchanged from your original
  const { nodes: layoutedNodes, edges } = useMemo(() => {
    return getLayoutedElements(rawNodes, styledEdges);
  }, [rawNodes, styledEdges]);

  // ✅ Inject isActive into node data — does NOT touch layout or structure
  const nodes = useMemo(() => {
    return layoutedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isActive: node.id === activeNodeId,
      },
    }));
  }, [layoutedNodes, activeNodeId]);

  return (
    <div className="flex h-[85vh]">
      {/* ---- Flowchart (unchanged ReactFlow block) ---- */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold mb-2">{algo.title} Flow Chart</h2>
        <div className="w-full h-full text-black">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            zoomOnScroll={false}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            panOnDrag={true}
            nodesDraggable={false}
            elementsSelectable={false}
          >
            <Background gap={30} />
            <Controls
              className="p-4"
              fitViewOptions={true}
              showZoom={false}
              showInteractive={false}
            />
          </ReactFlow>
        </div>
      </div>

      {/* ---- Right panel ---- */}
      <DryRunPanel
        activeStep={activeStep}
        steps={steps}
        onNext={() => setActiveStep((p) => Math.min(p + 1, steps.length - 1))}
        onPrev={() => setActiveStep((p) => Math.max(p - 1, 0))}
        onReset={() => { setSteps([]); setActiveStep(0); setInputVal(""); }}
        inputVal={inputVal}
        onInputChange={setInputVal}
        onRun={handleRun}
      />
    </div>
  );
}

export default VisualTab;