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
    <div className="page-container">
      
    </div>
  );
};
