import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumb = ({ path, data, selectionHandler }) => {
  const levels = path.map((name, idx) =>
    data.find(
      (node) =>
        node.name === name && node.path.join() === path.slice(0, idx + 1).join()
    )
  );

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {levels.map((node, idx) =>
        node ? (
          <Typography
            key={idx}
            color="inherit"
            variant="button"
            onClick={() => selectionHandler(node)}
            sx={{ cursor: "pointer" }}
          >
            {node.name}
          </Typography>
        ) : null
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
