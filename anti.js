let myCells = [];
let myCellsHistoryMass = [];
let myBiggerCell = { mass: 0 };
let mySmallerCell = { mass: 25e3 };
let cellTimerTriggerOnce = true;
export function cellTimerTrigger() {
  if (cellTimerTriggerOnce) {
    if (!window.legendmod5.optimizedmass) {
      cellTimer();
    }
    return cellTimerTriggerOnce = false;
  }
}
function cellTimer() {
  var _a, _b;
  console.log("ding");
  setTimeout(() => {
    if (!window.legendmod5.optimizedmass) {
      cellTimer();
    }
  }, 1e3);
  myCells = [];
  myCellsHistoryMass = [];
  myBiggerCell = { mass: 0 };
  mySmallerCell = { mass: 25e3 };
  if (window.playerCellsId != null && window.legendmod.playerCells.length !== 0) {
    for (const cell of window.legendmod.playerCells) {
      myCells.push(cell);
      const historySource = window.playerCellsId[cell.id];
      if (historySource == null ? void 0 : historySource.historyMass) {
        cell.historyMass = historySource.historyMass;
      }
      if (cell.mass > ((_a = myBiggerCell.mass) != null ? _a : 0)) {
        myBiggerCell = cell;
      }
      if (cell.mass < ((_b = mySmallerCell.mass) != null ? _b : 25e3)) {
        mySmallerCell = cell;
      }
    }
    for (const cell of myCells) {
      if (cell.historyMass) {
        for (let j = 0; j < cell.historyMass.length; j++) {
          if (myCellsHistoryMass[j] === void 0) {
            myCellsHistoryMass[j] = 0;
          }
          myCellsHistoryMass[j] += cell.historyMass[j];
        }
      }
    }
  }
  try {
    let historyTop = 0;
    let historyBottom = 25e3;
    let historyTopIndex = 0;
    let historyBottomIndex = 0;
    const frameLimit = (window.legendmod2.fps || 60) - 5;
    for (let i = 0; i < frameLimit; i++) {
      const currentMass = myCellsHistoryMass[i];
      if (currentMass === void 0) continue;
      if (currentMass < historyBottom) {
        historyBottom = currentMass;
        historyBottomIndex = i;
      }
      if (currentMass > historyTop) {
        historyTop = currentMass;
        historyTopIndex = i;
      }
    }
    if (historyTop !== 0 && historyTop !== historyBottom) {
      if (historyBottom < historyTop && historyTopIndex < historyBottomIndex) {
        if (window.lastejected) {
          window.lastejected = false;
        } else {
          const ratio = 1 - historyBottom / historyTop;
          if (ratio < 1e3) {
            const percentage = ratio * 100;
            if (percentage < 10 && percentage > 0.1) {
              const formattedPct = percentage.toFixed(5);
              console.log(`${formattedPct}%`);
              window.$("#pause-hud").text(
                `PAUSE! Anti beat:: ${formattedPct}%`
              );
              setTimeout(() => {
                window.$("#pause-hud").text("PAUSE!");
              }, 3e3);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error in cellTimer analysis:", e);
  }
}
