window.ExternalScripts = true;
const IntervalStatistics = setInterval(cellTimer, 1e3);
function cellTimer() {
  var _a, _b, _c, _d;
  if (!((_a = window.legendmod5) == null ? void 0 : _a.optimizedMass) && window.ExternalScripts) {
    const playerCells = ((_b = window.legendmod) == null ? void 0 : _b.playerCells) || [];
    for (let i = 0; i < playerCells.length; i++) {
      const cell = playerCells[i];
      const cellData = (_c = window.playerCellsId) == null ? void 0 : _c[cell.id];
      if (cell && cellData && cellData.historyMass) {
        const currentFpsIndex = ((_d = window.legendmod2) == null ? void 0 : _d.fps) || 0;
        const currentMass = cellData.historyMass[currentFpsIndex];
        const initialMass = cellData.historyMass[0];
        if (currentMass !== void 0 && initialMass !== void 0 && currentMass > initialMass * 1.4) {
          const cellIndex = i;
          const counter = 0;
          mergeCells(cellIndex, counter);
        } else {
          cellData.mergeTime = null;
        }
      }
    }
  }
}
function mergeCells(cellIndex, counter) {
  var _a, _b, _c, _d, _e;
  counter++;
  const playerCells = (_a = window.legendmod) == null ? void 0 : _a.playerCells;
  const cell = playerCells == null ? void 0 : playerCells[cellIndex];
  if (playerCells && playerCells.length > 1 && cell) {
    const cellData = (_b = window.playerCellsId) == null ? void 0 : _b[cell.id];
    if (cellData && cellData.historyMass) {
      const initialMass = cellData.historyMass[0];
      cellData.mergeTime = 29 + 8 / 300 * initialMass - counter;
      if (cellData.mergeTime > -20) {
        setTimeout(() => {
          mergeCells(cellIndex, counter);
        }, 1e3);
      }
      return;
    }
  }
  const fallbackCell = (_d = (_c = window.legendmod) == null ? void 0 : _c.playerCells) == null ? void 0 : _d[cellIndex];
  if (fallbackCell) {
    const fallbackData = (_e = window.playerCellsId) == null ? void 0 : _e[fallbackCell.id];
    if (fallbackData == null ? void 0 : fallbackData.historyMass) {
      fallbackData.mergeTime = null;
    }
  }
}
