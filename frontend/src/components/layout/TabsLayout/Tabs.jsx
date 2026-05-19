import { Button } from "@/components/ui/button";
import { ChartBar, ChartSpline, Code, Text, SquarePlay } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

function Tabs({ activeTab, setActiveTab, markAsRead }) {

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="w-full flex gap-2  p-2  overflow-x-auto">
      <Button
        onClick={() => handleTabChange("info")}
        className={
          activeTab === "info"
            ? "bg-[var(--bg-secondary)] border-blue-200/80"
            : ""
        }
      >
        Info <Text />
      </Button>

      <Button
        onClick={() => handleTabChange("flow")}
        className={
          activeTab === "flow"
            ? "bg-[var(--bg-secondary)] border-blue-200/80"
            : ""
        }
      >
        FlowChart <ChartSpline />
      </Button>

      <Button
        onClick={() => handleTabChange("visual")}
        className={
          activeTab === "visual"
            ? "bg-[var(--bg-secondary)] border-blue-200/80"
            : ""
        }
      >
        Visualization <SquarePlay />
      </Button>

      <Button
        onClick={() => handleTabChange("code")}
        className={
          activeTab === "code"
            ? "bg-[var(--bg-secondary)] border-blue-200/80"
            : ""
        }
        // disabled={!markAsRead && activeTab === "info"}
      >
        CodeEditor <Code />
      </Button>
    </div>
  );
}

export default Tabs;
