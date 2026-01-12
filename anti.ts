// ==========================================
// INTERFACES & GLOBAL DECLARATIONS
// ==========================================

interface Cell {
  id: number;
  mass: number;
  historyMass?: number[]; // historyMass might not exist initially
}

interface LegendMod {
  playerCells: Cell[];
}

interface LegendModSettings {
  optimizedmass: boolean;
}

interface LegendModStats {
  fps: number;
}

// Extend the global Window interface to recognize game variables
declare global {
  interface Window {
    legendmod: LegendMod;
    legendmod5: LegendModSettings;
    legendmod2: LegendModStats;

    // External data source for history
    playerCellsId: Record<number, { historyMass: number[] }>;

    // State flags
    lastejected: boolean;

    // jQuery
    $: any;
  }
}

// ==========================================
// STATE VARIABLES
// ==========================================

let myCells: Cell[] = [];
let myCellsHistoryMass: number[] = [];

// Initialize with defaults to avoid 'undefined' errors
let myBiggerCell: Partial<Cell> = { mass: 0 };
let mySmallerCell: Partial<Cell> = { mass: 25000 };

let cellTimerTriggerOnce = true;

// ==========================================
// LOGIC
// ==========================================

export function cellTimerTrigger(): boolean | undefined {
  if (cellTimerTriggerOnce) {
    if (!window.legendmod5.optimizedmass) {
      cellTimer();
    }
    return (cellTimerTriggerOnce = false);
  }
}

function cellTimer(): void {
  console.log("ding");

  // Recursive timer using arrow function
  setTimeout(() => {
    if (!window.legendmod5.optimizedmass) {
      cellTimer();
    }
  }, 1000);

  // Reset state for this tick
  myCells = [];
  myCellsHistoryMass = [];

  // Reset min/max trackers
  myBiggerCell = { mass: 0 };
  mySmallerCell = { mass: 25000 };

  // 1. Gather Player Cells and Snapshot Mass
  if (
    window.playerCellsId != null && window.legendmod.playerCells.length !== 0
  ) {
    for (const cell of window.legendmod.playerCells) {
      // Push to local array
      myCells.push(cell);

      // Sync history from external source safely
      // using Optional Chaining (?.) and fallback
      const historySource = window.playerCellsId[cell.id];
      if (historySource?.historyMass) {
        cell.historyMass = historySource.historyMass;
      }

      // Update Biggest/Smallest references
      if (cell.mass > (myBiggerCell.mass ?? 0)) {
        myBiggerCell = cell;
      }
      if (cell.mass < (mySmallerCell.mass ?? 25000)) {
        mySmallerCell = cell;
      }
    }

    // 2. Aggregate History Mass (Summing up mass of all split cells per frame)
    for (const cell of myCells) {
      if (cell.historyMass) {
        for (let j = 0; j < cell.historyMass.length; j++) {
          // Initialize index if undefined
          if (myCellsHistoryMass[j] === undefined) {
            myCellsHistoryMass[j] = 0;
          }
          myCellsHistoryMass[j] += cell.historyMass[j];
        }
      }
    }
  }

  // 3. Analyze Mass Fluctuation (Anti-Beat Detection)
  try {
    let historyTop = 0;
    let historyBottom = 25000;
    let historyTopIndex = 0;
    let historyBottomIndex = 0;

    // Loop limit based on FPS (minus 5 buffer frames)
    const frameLimit = (window.legendmod2.fps || 60) - 5;

    for (let i = 0; i < frameLimit; i++) {
      const currentMass = myCellsHistoryMass[i];

      // Skip undefined frames
      if (currentMass === undefined) continue;

      if (currentMass < historyBottom) {
        historyBottom = currentMass;
        historyBottomIndex = i;
      }
      if (currentMass > historyTop) {
        historyTop = currentMass;
        historyTopIndex = i;
      }
    }

    // If valid fluctuation detected
    if (historyTop !== 0 && historyTop !== historyBottom) {
      // Check if Mass Dropped (High mass index occurred before Low mass index??)
      // *Logic preserved from original script*
      if (historyBottom < historyTop && historyTopIndex < historyBottomIndex) {
        if (window.lastejected) {
          window.lastejected = false;
        } else {
          const ratio = 1 - (historyBottom / historyTop);

          // Original logic: check if ratio < 1000 (which is almost always true for 0-1 range)
          if (ratio < 1000) {
            const percentage = ratio * 100; // Calculate number FIRST

            // Check trigger range
            if (percentage < 10 && percentage > 0.1) {
              const formattedPct = percentage.toFixed(5);

              console.log(`${formattedPct}%`);

              window.$("#pause-hud").text(
                `PAUSE! Anti beat:: ${formattedPct}%`,
              );

              setTimeout(() => {
                window.$("#pause-hud").text("PAUSE!");
              }, 3000);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error in cellTimer analysis:", e);
  }
}