import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { OrgChart } from "d3-org-chart";
import buildTreeData from "../functions/buildTreeData";
import "./OrgChart.css";

const D3OrgChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedVariable] = useState("QUANTITY");

  useEffect(() => {
    const initListener = () => {
      if (window.va?.messagingUtil) {
        window.va.messagingUtil.setOnDataReceivedCallback((vaResponse) => {
          console.log("Received VA Data:", vaResponse);
          let vaData;
          if (
            Array.isArray(vaResponse.data) &&
            Array.isArray(vaResponse.columns)
          ) {
            vaData = {
              data: vaResponse.data,
              columns: vaResponse.columns,
            };
          } else if (vaResponse.data?.data && vaResponse.data?.columns) {
            vaData = {
              data: vaResponse.data.data,
              columns: vaResponse.data.columns,
            };
          } else {
            console.warn("Invalid VA response format:", vaResponse);
            return;
          }

          const tree = buildTreeData(vaData, selectedVariable);

          const formattedData = [
            {
              id: "root", // synthetic root
              name: "All Products",
              parentId: null,
              positionName: "",
              _directSubordinates: tree.filter((n) => n.parentId === 0).length,
            },
            ...tree.map((node) => ({
              id: node.id,
              name: node.name,
              parentId: node.parentId === 0 ? "root" : node.parentId, // wrap all top-level nodes under 'root'
              positionName: `${selectedVariable} — ${
                node[selectedVariable]?.toLocaleString() || "0"
              }`,
              _directSubordinates: node.children?.length || 0,
              [selectedVariable]: node[selectedVariable] || 0, // Add QUANTITY to the data
            })),
          ];

          console.log("Formatted Data:", formattedData); // Debug the formatted data

          if (!chartInstance.current) {
            chartInstance.current = new OrgChart();
          }

          chartInstance.current
            .container(chartRef.current)
            .data(formattedData)
            .nodeId((d) => d.id)
            .nodeHeight(() => 90)
            .nodeWidth(() => 220)
            .childrenMargin(() => 50)
            .siblingsMargin(() => 30)
            .buttonContent(
              ({ node }) =>
                `<div style="color:#333;font-size:11px;padding:4px;border:1px solid #ddd;border-radius:4px;background:#fff;">
                <i class="fas fa-angle-${node.children ? "up" : "down"}"></i>
                ${node.data._directSubordinates}
              </div>`
            )
            .nodeContent((d) => {
              return `
               <div style="background:#f9f9f9;border-radius:12px;border:1px solid #E4E2E9;padding:15px;width:${
                 d.width
               }px;height:${
                d.height
              }px;font-family:Inter, sans-serif;text-align:center;">
                 <div style="font-size:16px;font-weight:700;color:#333;">${
                   d.data.name
                 }</div>
                  <div style="font-size:14px;color:#555;margin-top:8px;">${selectedVariable} — ${
                d.data[selectedVariable]?.toLocaleString() || "0"
              }
              </div>
              </div>`;
            })
            .render();
        });
      }
    };

    setTimeout(initListener, 100);
  }, [selectedVariable]);

  return (
    <div
      ref={chartRef}
      style={{
        backgroundColor: "#f9f9fb",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    />
  );
};

export default D3OrgChart;
