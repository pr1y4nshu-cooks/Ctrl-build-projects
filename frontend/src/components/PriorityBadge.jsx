import React from "react";

const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    critical: "bg-error/20 text-error border border-error/30",
    high: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  const style = priorityStyles[priority?.toLowerCase()] || priorityStyles.medium;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${style}`}>
      {priority || "Medium"}
    </span>
  );
};

export default PriorityBadge;
