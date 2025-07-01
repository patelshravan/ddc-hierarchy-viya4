const buildTreeData = (vaData, selectedVariable) => {
  const data = [];
  let lastId = 0;

  const levelColumns = vaData.columns
    .map((col, idx) => ({ ...col, idx }))
    .filter((col) => typeof vaData.data[0][col.idx] === "string");

  const levels = levelColumns.length;

  const numericColumns = vaData.columns.filter((col) => col.type === "number");

  let selectedVariableIndex = null;

  if (selectedVariable) {
    selectedVariableIndex = vaData.columns.findIndex(
      (col) => col.label === selectedVariable
    );
    console.log(`Selected Variable: ${selectedVariable}, Index: ${selectedVariableIndex}`);
    if (selectedVariableIndex === -1) {
      console.error(`Column with label "${selectedVariable}" not found in vaData.columns`);
    }
  }

  // Row loop
  vaData.data.forEach((row, rowIdx) => {
    const path = [];

    for (let i = 0; i < levels; i++) {
      const levelCol = levelColumns[i];
      const value = row[levelCol.idx];
      path.push(value);

      const parent = data.find(
        (node) => node.path.join() === path.slice(0, i).join()
      );

      const existingNode = data.find(
        (n) => n.name === value && n.parentId === (parent?.id || 0)
      );

      if (!existingNode) {
        const node = {
          id: ++lastId,
          name: value,
          parentId: parent?.id || 0,
          path: path.slice(0, i + 1),
          level: i,
          children: [],
          rawData: i === levels - 1 ? [row] : [],
        };

        // Add selected variable value at leaf nodes
        if (i === levels - 1 && selectedVariableIndex !== null && selectedVariableIndex !== -1) {
          const selectedValue = row[selectedVariableIndex] || 0;
          node[selectedVariable] = selectedValue;  // Assign the selected variable
          console.log(`Assigned ${selectedVariable} = ${selectedValue} to node ${node.name} at path ${node.path.join(" > ")}`);
        }

        data.push(node);
      } else if (i === levels - 1) {
        existingNode.rawData = existingNode.rawData || [];
        existingNode.rawData.push(row);
      }
    }
  });

  // Attach children to each node
  data.forEach((node) => {
    node.children = data.filter((el) => el.parentId === node.id);
  });

  // Roll-up the totals recursively for the selected numeric variable
  const rollUpTotals = (node) => {
    // 1) First recurse into children
    node.children.forEach(rollUpTotals);

    // 2) If there are any children, sum their values
    if (node.children.length > 0) {
      const previousValue = node[selectedVariable] || 0;
      node[selectedVariable] = node.children.reduce(
        (sum, child) => sum + (child[selectedVariable] || 0),
        0
      );
      console.log(
        `Rolled up ${selectedVariable} for node ${node.name} at path ${node.path.join(" > ")}: ${node[selectedVariable]} (previous: ${previousValue})`
      );
    }

    // Special case for root node (All Products)
    if (node.parentId === "root") {  // Adjusted this to check if parentId is "root"
      node[selectedVariable] = node.children.reduce(
        (sum, child) => sum + (child[selectedVariable] || 0),
        0
      );
      console.log(`Rolled up ${selectedVariable} for root node (All Products): ${node[selectedVariable]}`);
    }
  };

  // Start from root-level nodes and roll up totals recursively
  data.filter(n => n.parentId === 0).forEach(rollUpTotals);

  // Attach child rawData to parents
  data.forEach((node) => {
    if (node.children?.length > 0) {
      node.rawData = node.children.flatMap((child) => child.rawData || []);
    }
  });

  console.log("Built tree data with totals:", data); // Final tree data with totals

  return data;
};

export default buildTreeData;