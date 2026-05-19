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
} from "lucide-react";

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

        if (
          data?.submission?.code
        ) {
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
    if (typeof input === "string") return input;

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

          // save failed attempt also
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
    <div className="h-[80vh] border border-white/10 rounded-xl overflow-hidden">

      <ResizablePanelGroup direction="horizontal">

        {/* LEFT PANEL */}

        <ResizablePanel
          defaultSize={30}
          minSize={20}
        >

          <div className="h-full p-4 bg-white/5 overflow-y-auto">

            <h2 className="text-lg font-semibold mb-2">
              {algo.title}
            </h2>

            <h3 className="text-xs uppercase text-gray-500 mt-4">
              Problem
            </h3>

            <p className="text-sm text-gray-300 whitespace-pre-line">
              {algo.problem?.statement}
            </p>

            {algo.problem?.inputFormat && (
              <>
                <h3 className="text-xs uppercase text-gray-500 mt-4">
                  Input
                </h3>

                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {algo.problem.inputFormat}
                </p>
              </>
            )}

            {algo.problem?.outputFormat && (
              <>
                <h3 className="text-xs uppercase text-gray-500 mt-4">
                  Output
                </h3>

                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {algo.problem.outputFormat}
                </p>
              </>
            )}

            {algo.problem?.constraints && (
              <>
                <h3 className="text-xs uppercase text-gray-500 mt-4">
                  Constraints
                </h3>

                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {algo.problem.constraints}
                </p>
              </>
            )}

            {/* EXAMPLES */}

            <div className="space-y-3 mt-4">

              <h3 className="text-xs uppercase text-gray-500">
                Examples
              </h3>

              {(algo.examples || []).map((ex, i) => (

                <div
                  key={i}
                  className="bg-black/50 p-3 rounded-lg text-xs font-mono"
                >

                  <div>
                    Input:{" "}
                    {formatDisplay(ex.input)}
                  </div>

                  <div>
                    Output:{" "}
                    {formatDisplay(ex.output)}
                  </div>

                  {ex.explanation && (
                    <div className="text-gray-400 mt-1">
                      {ex.explanation}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT PANEL */}

        <ResizablePanel defaultSize={70}>

          <ResizablePanelGroup direction="vertical">

            {/* EDITOR */}

            <ResizablePanel defaultSize={70}>

              <div className="h-full flex flex-col">

                <div className="text-xs text-gray-500 px-3 py-1 border-b border-white/10">
                  Write your solution. Input is taken from stdin.
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

                    padding: {
                      top: 10,
                    },
                  }}
                />

              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* RESULTS PANEL */}

            <ResizablePanel defaultSize={30}>

              <div className="h-full flex flex-col bg-black/70 border-t border-white/10">

                {/* ACTION BUTTONS */}

                {/* <div className="flex gap-2 p-3 border-b border-white/10"> */}
                <div className="flex gap-2 p-3 border-b border-white/10 flex-wrap">
                  <Button
                    onClick={handleRun}
                    disabled={loading}
                  >
                    <Play size={16} />
                    Run
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={
                      loading || submitted
                    }
                  >
                    {submitted ? (
                      <>
                        <CheckCircle size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit
                      </>
                    )}
                  </Button>

                  <Button
                    // variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </Button>

                </div>

                {/* CUSTOM INPUT */}

                <textarea
                  className="m-2 p-2 text-xs bg-black/50 border border-white/10 rounded-md"
                  placeholder="Custom input..."
                  value={customInput}
                  onChange={(e) =>
                    setCustomInput(
                      e.target.value
                    )
                  }
                />

                {/* RESULTS */}

                <div className="flex-1 overflow-y-auto p-3 text-sm font-mono">

                  {results.length === 0 && (
                    <p className="text-gray-500">
                      Run your code to see results...
                    </p>
                  )}

                  {results.map((r, i) => (

                    <div
                      key={i}
                      className={`p-2 rounded mb-2 ${r.passed
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                        }`}
                    >

                      <div className="flex items-center gap-2">

                        {r.passed ? (
                          <VerifiedIcon />
                        ) : (
                          <X />
                        )}

                        Test {i + 1}:{" "}
                        {r.passed
                          ? "Passed"
                          : "Failed"}

                      </div>

                      {!r.passed && (
                        <div className="text-xs mt-1 pl-4">

                          <div>
                            Expected: {r.expected}
                          </div>

                          <div>
                            Got: {r.output}
                          </div>

                        </div>
                      )}

                      {r.error && (
                        <div className="text-xs mt-1 pl-4 text-red-300">

                          Error: {r.error}

                        </div>
                      )}

                      {r.message && (
                        <div className="text-xs mt-1 pl-4 text-green-300">

                          {r.message}

                        </div>
                      )}

                    </div>
                  ))}

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