import { useLocation } from "react-router-dom";
import { logTreeNodeInput } from "../services/loggingService";

export function useNodeInputLogger() {
  const location = useLocation();

  const logNodeChange = (nodeData) => {
    logTreeNodeInput({
      page: location.pathname,
      nodeId: nodeData.nodeId,
      value: nodeData.value,
      action: nodeData.action || "edit",
    });
  };

  return { logNodeChange };
}
