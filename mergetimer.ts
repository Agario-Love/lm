/**
 * Time Merger v1.9 - TypeScript Conversion
 */

// ==========================================
// 1. Type Definitions
// ==========================================

interface PlayerCell {
  id: number;
  // Add other properties if needed (e.g., x, y, size)
}

interface CellData {
  historyMass: number[];
  mergeTime: number | null;
}

// Extend the Window interface to include the global variables used in this script
declare global {
  interface Window {
    ExternalScripts: boolean;

    // Configuration objects
    legendmod5: {
      optimizedMass: boolean;
    };
    legendmod: {
      playerCells: PlayerCell[];
    };
    legendmod2: {
      fps: number;
    };

    // Dictionary mapping cell IDs to their data
    playerCellsId: Record<number, CellData>;
  }
}

// ==========================================
// 2. Main Logic
// ==========================================

// Initialize Global Flag
window.ExternalScripts = true;

// Start the Timer
const IntervalStatistics = setInterval(cellTimer, 1000);

function cellTimer(): void {
  // Only run if optimizedMass is false and scripts are enabled
  if (!window.legendmod5?.optimizedMass && window.ExternalScripts) {
    const playerCells = window.legendmod?.playerCells || [];

    for (let i = 0; i < playerCells.length; i++) {
      const cell = playerCells[i];
      const cellData = window.playerCellsId?.[cell.id];

      // Ensure cell data and history exists
      if (cell && cellData && cellData.historyMass) {
        const currentFpsIndex = window.legendmod2?.fps || 0;
        const currentMass = cellData.historyMass[currentFpsIndex];
        const initialMass = cellData.historyMass[0];

        // Check if mass has increased by 40% (1.4x)
        // Note: Ensure bounds check in case FPS index > array length
        if (
          currentMass !== undefined && initialMass !== undefined &&
          currentMass > initialMass * 1.4
        ) {
          // Start Merge Timer
          const cellIndex = i;
          const counter = 0;
          mergeCells(cellIndex, counter);
        } else {
          // Reset merge time if condition not met
          cellData.mergeTime = null;
        }
      }
    }
  }
}

function mergeCells(cellIndex: number, counter: number): void {
  counter++;

  const playerCells = window.legendmod?.playerCells;
  const cell = playerCells?.[cellIndex];

  // Safety check: Ensure the cell and its data still exist
  if (playerCells && playerCells.length > 1 && cell) {
    const cellData = window.playerCellsId?.[cell.id];

    if (cellData && cellData.historyMass) {
      const initialMass = cellData.historyMass[0];

      // Calculate Merge Time
      // Formula: 29 + (8 / 300) * Mass - Counter
      cellData.mergeTime = 29 + (8 / 300) * initialMass - counter;

      // If time is valid (greater than -20), continue recursion
      if (cellData.mergeTime > -20) {
        setTimeout(() => {
          mergeCells(cellIndex, counter);
        }, 1000);
      }
      return;
    }
  }

  // Fallback: Logic if the cell no longer exists or condition failed (Timer ended)
  // We try to access the cell data one last time to reset it if it still exists in memory
  const fallbackCell = window.legendmod?.playerCells?.[cellIndex];
  if (fallbackCell) {
    const fallbackData = window.playerCellsId?.[fallbackCell.id];
    if (fallbackData?.historyMass) {
      fallbackData.mergeTime = null;
    }
  }
}