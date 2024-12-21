"use client";

import React from 'react';
import { useRealtimeSessionEngine } from "gabber-client-react";
import { useEffect, useState } from "react";

export const AgentAudioVisualizer = () => {
  const { agentState, agentVolumeBands, agentVolume } = useRealtimeSessionEngine();
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => {
      setTicker((t) => (t + 1) % 5);
    }, 200);

    return () => {
      clearInterval(itv);
    };
  }, []);

  return (
    <div className={`flex flex-row items-end justify-center space-x-1 h-full`}>
      {agentVolumeBands.map((frequency, index) => {
        const isCenter = index + 1 === Math.round(agentVolumeBands.length / 2);
        let bg = "bg-primary";
        let animate = "";
        if (agentVolume > 0.1) {
          bg = "bg-primary";
        } else {
          if (agentState === "thinking") {
            bg =
              ticker % agentVolumeBands.length === index
                ? "bg-primary"
                : "bg-base-300";
          } else if (agentState === "listening") {
            bg = isCenter ? "bg-primary" : "bg-base-300";
          }
        }

        return (
          <div
            className={`transition-all duration-75 rounded-sm w-[20px] ${bg}`}
            key={"frequency-" + index}
            style={{
              height: `${agentVolume > 0.1 ? 5 + frequency * 100 : 5}%`,
            }}
          ></div>
        );
      })}
    </div>
  );
};