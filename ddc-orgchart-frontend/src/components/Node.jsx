import { Card, CardContent, Typography } from "@mui/material";

const Node = ({ node, selectionHandler, isSelected, selectedVariable }) => {
  const total = node[selectedVariable] || 0;
  const displayValue = total ? total.toLocaleString() : "0";
  const displayLabel = `${selectedVariable} - ${displayValue}`;
  const cardColor = total > 0 ? "#f1f3f5" : "#f1f3f5";

  return (
    <Card
      raised
      sx={{
        width: "200px",
        minHeight: "90px",
        backgroundColor: cardColor,
        boxShadow: isSelected
          ? "0 0 0 3px #6f42c1"
          : "0 4px 10px rgba(0,0,0,0.1)",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.04)",
        },
      }}
      onClick={() => selectionHandler(node)}
    >
      <CardContent sx={{ padding: "12px !important" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#333", lineHeight: 1.2 }}
        >
          {node.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", color: "#666", marginTop: "6px" }}
        >
          {selectedVariable} — {displayValue}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Node;
