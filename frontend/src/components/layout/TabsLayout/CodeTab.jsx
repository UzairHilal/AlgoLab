import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import { Button } from "@/components/ui/button";

import {
  Play,
  Send,
  CheckCircle,
  VerifiedIcon,
  X,
  RotateCcw,
  Terminal,
  Code2,
  Sparkles,
} from "lucide-react";

import { motion } from "motion/react";

import { apiFetch } from "@/utils/api";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../ui/resizable";

function CodeTab({ algo }) {

  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // ================= RESET =================

  const handleReset = async () => {

    const confirmReset = window.confirm(
      "Reset your code to starter template?"
    );

    if (!confirmReset) return;

    try {

      setCode(
        algo.problem?.starterCode?.python || ""
      );

      setResults([]);
      setSubmitted(false);
      setCustomInput("");

      await apiFetch(
        `submissions/reset/${algo.slug}`,
        {
          method: "DELETE",
        }
      );

    } catch (err) {

      console.error(
        "Failed resetting code:",
        err
      );
    }
  };

  // ================= LOAD SAVED CODE =================

  useEffect(() => {

    if (!algo) return;

    const loadSavedCode = async () => {

      try {

        const res = await apiFetch(
          `submissions/${algo.slug}`
        );

        const data = await res.json();

        if (data?.submission?.code) {

          setCode(data.submission.code);

          if (data.submission.passed) {
            setSubmitted(true);
          }

        } else {

          setCode(
            algo.problem?.starterCode?.python || ""
          );
        }

      } catch (err) {

        console.error(
          "Failed loading saved code:",
          err
        );

        setCode(
          algo.problem?.starterCode?.python || ""
        );
      }
    };

    loadSavedCode();

  }, [algo]);

  // ================= CODE CHANGE =================

  const handleCodeChange = (value) => {
    setCode(value || "");
  };

  // ================= HELPERS =================

  const formatInput = (input) => {

    if (typeof input === "string") {
      return input;
    }

    if (Array.isArray(input)) {
      return input.join(" ");
    }

    if (typeof input === "object") {
      return Object.values(input).join(" ");
    }

    return String(input);
  };

  const formatOutput = (output) => {

    if (typeof output === "string") {
      return output.trim();
    }

    return String(output).trim();
  };

  const formatDisplay = (val) => {

    if (Array.isArray(val)) {
      return val.join(" ");
    }

    if (typeof val === "object") {
      return Object.values(val).join(" ");
    }

    return String(val);
  };

  // ================= JUDGE0 =================

  const runCode = async ({ code, input }) => {

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          source_code: code,
          language_id: 71,
          stdin: input,
        }),
      }
    );

    const data = await response.json();

    return {
      stdout: data.stdout ?? "",
      stderr: data.stderr ?? "",
      compile_output: data.compile_output ?? "",
    };
  };

  // ================= RUN =================

  const handleRun = async () => {

    setLoading(true);
    setResults([]);

    try {

      const tests = algo.examples || [];

      const promises = tests.map((test) =>
        runCode({
          code,
          input: customInput || formatInput(test.input),
        })
      );

      const outputs = await Promise.all(promises);

      const resultsArray = outputs.map((res, i) => {

        const output = formatOutput(res.stdout);

        const expected = formatOutput(
          tests[i].output
        );

        const error =
          res.stderr || res.compile_output;

        return {
          passed: !error && output === expected,
          output,
          expected,
          error,
        };
      });

      setResults(resultsArray);

    } catch (err) {

      setResults([
        {
          passed: false,
          error: err.message,
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {

    setLoading(true);
    setResults([]);

    try {

      const tests = algo.testCases || [];

      const resultsArray = [];

      for (let i = 0; i < tests.length; i++) {

        const test = tests[i];

        const res = await runCode({
          code,
          input: formatInput(test.input),
        });

        const output = formatOutput(
          res.stdout
        );

        const expected = formatOutput(
          test.expected
        );

        const error =
          res.stderr || res.compile_output;

        const passed =
          !error && output === expected;

        resultsArray.push({
          passed,
          output,
          expected,
          error,
        });

        // STOP ON FIRST FAIL

        if (!passed) {

          setResults(resultsArray);

          await apiFetch(
            "submissions/save",
            {
              method: "POST",

              body: JSON.stringify({
                algorithmSlug: algo.slug,
                code,
                language: "python",
                passed: false,
              }),
            }
          );

          setLoading(false);

          return;
        }
      }

      // ================= MARK COMPLETE =================

      await apiFetch(
        "progress/complete",
        {
          method: "POST",

          body: JSON.stringify({
            algorithmSlug: algo.slug,
          }),
        }
      );

      // ================= SAVE SUBMISSION =================

      await apiFetch(
        "submissions/save",
        {
          method: "POST",

          body: JSON.stringify({
            algorithmSlug: algo.slug,
            code,
            language: "python",
            passed: true,
          }),
        }
      );

      setSubmitted(true);

      setResults([
        {
          passed: true,
          message:
            "All hidden test cases passed 🚀",
        },
      ]);

    } catch (err) {

      setResults([
        {
          passed: false,
          error: err.message,
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">

      <ResizablePanelGroup direction="horizontal">

        {/* LEFT PANEL */}

        <ResizablePanel defaultSize={30} minSize={22}>

          <div className="h-full overflow-y-auto border-r border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-5">

            <div className="mb-5">

              <div className="flex items-center gap-2 mb-2">

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1">
                  <Sparkles size={13} className="text-emerald-400" />

                  <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-300">
                    Coding Challenge
                  </span>
                </div>

              </div>

              <h2 className="text-xl font-bold text-white">
                {algo.title}
              </h2>

            </div>

            {/* PROBLEM */}

            <div className="space-y-5">

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Problem Statement
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
                  {algo.problem?.statement}
                </p>

              </div>

              {algo.problem?.inputFormat && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Input Format
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-6 text-gray-400">
                    {algo.problem.inputFormat}
                  </p>

                </div>
              )}

              {algo.problem?.outputFormat && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Output Format
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-6 text-gray-400">
                    {algo.problem.outputFormat}
                  </p>

                </div>
              )}

              {algo.problem?.constraints && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
                    Constraints
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-6 text-gray-400">
                    {algo.problem.constraints}
                  </p>

                </div>
              )}

              {/* EXAMPLES */}

              <div className="space-y-3">

                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Examples
                </h3>

                {(algo.examples || []).map((ex, i) => (

                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-4 shadow-lg"
                  >

                    <div className="space-y-2 text-xs font-mono">

                      <div className="text-cyan-300">
                        <span className="text-gray-500">
                          Input:
                        </span>{" "}
                        {formatDisplay(ex.input)}
                      </div>

                      <div className="text-emerald-300">
                        <span className="text-gray-500">
                          Output:
                        </span>{" "}
                        {formatDisplay(ex.output)}
                      </div>

                      {ex.explanation && (
                        <div className="pt-2 text-gray-400 leading-6">
                          {ex.explanation}
                        </div>
                      )}

                    </div>

                  </motion.div>
                ))}

              </div>

            </div>

          </div>

        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT PANEL */}

        <ResizablePanel defaultSize={70}>

          <ResizablePanelGroup direction="vertical">

            {/* EDITOR */}

            <ResizablePanel defaultSize={70}>

              <div className="flex h-full flex-col bg-[#0a0a0a]">

                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">

                  <div className="flex items-center gap-2 text-sm text-gray-400">

                    <Code2 size={15} />

                    <span>
                      Python Editor
                    </span>

                  </div>

                  <div className="text-xs text-gray-500">
                    Monaco IDE
                  </div>

                </div>

                <Editor
                  key={algo.slug}
                  height="100%"
                  theme="vs-dark"
                  language="python"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 14,

                    minimap: {
                      enabled: false,
                    },

                    smoothScrolling: true,

                    padding: {
                      top: 16,
                    },

                    scrollBeyondLastLine: false,

                    fontFamily:
                      "'JetBrains Mono', monospace",
                  }}
                />

              </div>

            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* RESULTS PANEL */}

            <ResizablePanel defaultSize={30}>

              <div className="flex h-full flex-col border-t border-white/10 bg-[#050505]">

                {/* ACTIONS */}

                <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-3">

                  <Button
                    onClick={handleRun}
                    disabled={loading}
                    className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:opacity-90"
                  >
                    <Play size={15} />
                    Run
                  </Button>

                  {!submitted && (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:opacity-90"
                    >
                      <Send size={15} />
                      Submit
                    </Button>
                  )}

                  <Button
                    onClick={handleReset}
                    disabled={loading}
                    className="gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    <RotateCcw size={15} />
                    Reset
                  </Button>

                  {submitted && (
                    <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">

                      <CheckCircle size={15} />

                      Completed

                    </div>
                  )}

                </div>

                {/* CUSTOM INPUT */}

                <div className="border-b border-white/10 p-3">

                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">

                    <Terminal size={13} />

                    Custom Input

                  </div>

                  <textarea
                    className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-gray-300 outline-none transition focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-500/10"
                    placeholder="Type custom input here..."
                    value={customInput}
                    onChange={(e) =>
                      setCustomInput(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* RESULTS */}

                <div className="flex-1 overflow-y-auto p-3">

                  {results.length === 0 && (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Run your code to see execution results...
                    </div>
                  )}

                  <div className="space-y-3">

                    {results.map((r, i) => (

                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-4 ${
                          r.passed
                            ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                            : "border-red-500/20 bg-red-500/[0.06]"
                        }`}
                      >

                        <div className="flex items-center gap-2 font-medium">

                          {r.passed ? (
                            <VerifiedIcon
                              size={18}
                              className="text-emerald-400"
                            />
                          ) : (
                            <X
                              size={18}
                              className="text-red-400"
                            />
                          )}

                          <span
                            className={
                              r.passed
                                ? "text-emerald-300"
                                : "text-red-300"
                            }
                          >
                            Test {i + 1} — {r.passed ? "Passed" : "Failed"}
                          </span>

                        </div>

                        {!r.passed && (
                          <div className="mt-3 space-y-1 pl-7 text-sm">

                            <div className="text-gray-400">
                              Expected:{" "}
                              <span className="text-white">
                                {r.expected}
                              </span>
                            </div>

                            <div className="text-gray-400">
                              Got:{" "}
                              <span className="text-white">
                                {r.output}
                              </span>
                            </div>

                          </div>
                        )}

                        {r.error && (
                          <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-red-300">
                            {r.error}
                          </div>
                        )}

                        {r.message && (
                          <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-emerald-300">
                            {r.message}
                          </div>
                        )}

                      </motion.div>
                    ))}

                  </div>

                </div>

              </div>

            </ResizablePanel>

          </ResizablePanelGroup>

        </ResizablePanel>

      </ResizablePanelGroup>

    </div>
  );
}

export default CodeTab;