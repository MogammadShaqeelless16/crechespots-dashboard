import React, { useState } from "react";
import { CreateButton } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

export const ChatPageWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { show } = useNavigation();
  const [selectedEventCategory, setSelectedEventCategory] = useState<string[]>(
    [],
  );

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe 
        src="https://ayoba-hackathon-socket.onrender.com/" 
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Ayoba Hackathon Socket"
      ></iframe>
    </div>
  );
};
