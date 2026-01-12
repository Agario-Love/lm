window.autoteammatenicks = [];
window.targetFood = null;
window.autoPlay = false;
window.doSplitFlag = true;
window.VirusFlag = true;
window.BiggerCellFlag = true;
window.SmallerCellFlag = true;
window.bestDist = 1e4;
function calcTarget() {
  window.legendmod5.virMassShots = true;
  window.legendmod5.noNames = false;
  window.legendmod5.autoHideNames = false;
  window.legendmod5.autoHideMass = false;
  window.legendmod5.hideMyName = false;
  window.legendmod5.hideTeammatesNames = false;
  window.legendmod5.showMass = true;
  window.legendmod5.hideEnemiesMass = false;
  window.legendmod5.autoHideFood = false;
  window.legendmod5.autoHideFoodOnZoom = false;
  let target;
  let target2 = { x: 0, y: 0 };
  let bestDist = 1e4;
  let bestDist2 = 1e4;
  let PlayerCell;
  let doSplit = false;
  let doSplittoAvoidCorner = false;
  let doFeed = false;
  window.DistanceX = [];
  window.DistanceY = [];
  window.DistanceName = [];
  window.DistanceId = [];
  window.DangerDistanceX = [];
  window.DangerDistanceY = [];
  window.DangerDistanceName = [];
  window.VirusDistanceX = [];
  window.VirusDistanceY = [];
  let VirusCellDontDoTheRest = false;
  window.FlagDangerCells = [];
  window.FlagVirusCells = [];
  window.BadCellsDistanceX = [];
  window.BadCellsDistanceY = [];
  window.BadCellsDistanceName = [];
  let biggercell = { mass: 0 };
  let smallercell = { mass: 25e3 };
  window.SandwichCellCase = null;
  if (window.legendmod.playerCells.length > 0) {
    for (let i = 0; i < window.legendmod.playerCells.length; i++) {
      if (window.legendmod.playerCells[i].mass > (biggercell.mass || 0)) {
        biggercell = window.legendmod.playerCells[i];
      }
      if (window.legendmod.playerCells[i].mass < (smallercell.mass || 25e3)) {
        smallercell = window.legendmod.playerCells[i];
      }
    }
  }
  Object.keys(window.legendmod.food).forEach((node) => {
    if (window.legendmod.food[node].isFood) {
      let cell = window.legendmod.food[node];
      let distance = calcDist(cell.x, cell.y);
      if (distance < bestDist) {
        target = cell;
        bestDist = distance;
      }
    }
  });
  let distcounterflag = 0;
  Object.keys(window.legendmod.cells).forEach((node) => {
    distcounterflag++;
    PlayerCell = window.legendmod.cells[node];
    let distancePlayerCell = calcDist(PlayerCell.x, PlayerCell.y);
    if (PlayerCell.nick != window.legendmod.playerNick) {
      try {
        window.DistanceX[PlayerCell.id] = PlayerCell.x - window.legendmod.playerX;
        window.DistanceY[PlayerCell.id] = PlayerCell.y - window.legendmod.playerY;
        window.DistanceName[PlayerCell.id] = PlayerCell.nick;
        window.DistanceId[distcounterflag] = PlayerCell.id;
        if (PlayerCell.isVirus) {
          window.FlagVirusCells.push(PlayerCell.id);
        }
        for (let i = 0; i < window.FlagVirusCells.length; i++) {
          let vId = window.FlagVirusCells[i];
          window.VirusDistanceX[vId] = window.DistanceX[vId];
          window.VirusDistanceY[vId] = window.DistanceY[vId];
        }
      } catch (err) {
      } finally {
        if (distancePlayerCell < window.legendmod.playerSize + PlayerCell.size && (biggercell.mass || 0) > 125 + 1.25 * ((7 - PlayerCell.mass) * 12) && PlayerCell.isVirus && window.legendmod.playerCells.length != 16) {
          if (window.VirusFlag === true) {
            window.VirusFlag = false;
            setTimeout(function() {
              window.VirusFlag = true;
            }, 1e3);
            window.$("#pause-hud").html(
              "<font color='" + PlayerCell.color + "'>Virus</font> is close. X: " + parseInt(String(window.DistanceX[PlayerCell.id])) + " , Y: " + parseInt(String(window.DistanceY[PlayerCell.id]))
            );
          }
          if (window.DistanceX[PlayerCell.id] > 0) {
            target2.x = window.legendmod.mapMinX;
          } else {
            target2.x = window.legendmod.mapMaxX;
          }
          if (window.DistanceY[PlayerCell.id] > 0) {
            target2.y = window.legendmod.mapMinY;
          } else {
            target2.y = window.legendmod.mapMaxY;
          }
        } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 760 && window.teammatenicks.includes(PlayerCell.nick) && window.application.lastSentClanTag != "") {
          console.log("feed!");
          window.autoteammatenicks[PlayerCell.name] = true;
          target2.x = PlayerCell.x;
          target2.y = PlayerCell.y;
          if (PlayerCell.mass != 0 && PlayerCell.name != "" && PlayerCell.nick != null) {
            doFeed = true;
          }
          window.$("#pause-hud").html(
            "<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is teammate. X: " + parseInt(String(window.DistanceX[PlayerCell.id])) + " , Y: " + parseInt(String(window.DistanceY[PlayerCell.id]))
          );
        } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 760 && PlayerCell.mass > (biggercell.mass || 0) * 2.5 || distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 95 && PlayerCell.mass > (biggercell.mass || 0) * 1.25) {
          window.DangerDistanceX[PlayerCell.id] = window.DistanceX[PlayerCell.id];
          window.DangerDistanceY[PlayerCell.id] = window.DistanceY[PlayerCell.id];
          window.DangerDistanceName[PlayerCell.id] = window.DistanceName[PlayerCell.id];
          window.FlagDangerCells.push(PlayerCell.id);
          DefineSandwichCellCase();
          if (distancePlayerCell - PlayerCell.size < bestDist2) {
            bestDist2 = distancePlayerCell - PlayerCell.size;
          }
          if (window.legendmod.playerSize > 140) {
            const isLeaderboardDanger = window.legendmod.leaderboard.slice(0, 5).some(
              (lb) => lb && lb.nick && window.DangerDistanceName[PlayerCell.id] === lb.nick
            );
            if (isLeaderboardDanger) {
              for (let i = 0; i < 5 && i < window.FlagDangerCells.length; i++) {
                let dId = window.FlagDangerCells[i];
                for (let j = 0; j < window.legendmod.leaderboard.length; j++) {
                  if (window.DangerDistanceName[dId] == window.legendmod.leaderboard[j].nick) {
                    window.BadCellsDistanceX[dId] = window.DangerDistanceX[dId];
                    window.BadCellsDistanceY[dId] = window.DangerDistanceY[dId];
                    window.BadCellsDistanceName[dId] = window.DangerDistanceName[dId];
                  }
                }
              }
              const shootResult = DefineVirusshootCaseAndShoot(
                target2,
                doFeed,
                VirusCellDontDoTheRest
              );
              if (shootResult) {
                target2 = shootResult.target2;
                doFeed = shootResult.doFeed;
                VirusCellDontDoTheRest = shootResult.stop;
              }
            }
          }
          if (distancePlayerCell - PlayerCell.size <= bestDist2 && !VirusCellDontDoTheRest) {
            if (window.BiggerCellFlag == true) {
              window.BiggerCellFlag = false;
              setTimeout(function() {
                window.BiggerCellFlag = true;
              }, 1e3);
              window.$("#pause-hud").html(
                "<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close. X: " + parseInt(String(window.DistanceX[PlayerCell.id])) + " , Y: " + parseInt(String(window.DistanceY[PlayerCell.id]))
              );
            }
            if (window.SandwichCellCase != null) {
              if ([0, 1, 2, 3].includes(window.SandwichCellCase)) {
                target2 = handleSandwichCellCase(target2);
                window.SandwichCellCase = null;
              }
              const cornerResult = avoidCorners(
                biggercell,
                target2,
                PlayerCell,
                doSplittoAvoidCorner
              );
              target2 = cornerResult.target2;
              doSplittoAvoidCorner = cornerResult.doSplit;
            } else {
              target2 = GeneralAvoiding(target2, PlayerCell);
              const cornerResult = avoidCorners(
                biggercell,
                target2,
                PlayerCell,
                doSplittoAvoidCorner
              );
              target2 = cornerResult.target2;
              doSplittoAvoidCorner = cornerResult.doSplit;
            }
          }
        } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 320 && PlayerCell.mass * 1.4 < (biggercell.mass || 0) && (biggercell.mass || 0) > 130 && !VirusCellDontDoTheRest) {
          if (PlayerCell.mass != 0 && PlayerCell.nick != "" && PlayerCell.mass * 3 < (biggercell.mass || 0) && window.legendmod.playerCells.length == 1 && !(PlayerCell.mass * 10 < (biggercell.mass || 0) && (biggercell.mass || 0) > 260)) {
            if (window.SmallerCellFlag == true) {
              window.SmallerCellFlag = false;
              setTimeout(function() {
                window.SmallerCellFlag = true;
              }, 1e3);
              window.$("#pause-hud").html(
                "<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close and will be eaten by split. X: " + parseInt(String(window.DistanceX[PlayerCell.id])) + " , Y: " + parseInt(String(window.DistanceY[PlayerCell.id]))
              );
            }
            target2.x = PlayerCell.x;
            target2.y = PlayerCell.y;
            if (PlayerCell.mass != 0) {
              doSplit = true;
            }
          } else if (PlayerCell.mass * 1.4 < (biggercell.mass || 0) && !(PlayerCell.mass * 10 < (biggercell.mass || 0))) {
            if (window.SmallerCellFlag == true) {
              window.SmallerCellFlag = false;
              setTimeout(function() {
                window.SmallerCellFlag = true;
              }, 1e3);
              window.$("#pause-hud").html(
                "<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close, AI follows... X: " + parseInt(String(window.DistanceX[PlayerCell.id])) + " , Y: " + parseInt(String(window.DistanceY[PlayerCell.id]))
              );
            }
            target2.x = PlayerCell.x;
            target2.y = PlayerCell.y;
          }
        }
      }
    }
  });
  if (target != void 0) {
    window.legendmod.sendPosition(target, target2);
  }
  if (doSplit == true && window.doSplitFlag == true) {
    doSplit = false;
    window.doSplitFlag = false;
    setTimeout(function() {
      window.doSplitFlag = true;
    }, 2e3);
    window.legendmod.sendAction(17);
  } else if (doSplittoAvoidCorner == true && window.doSplitFlag == true) {
    doSplittoAvoidCorner = false;
    window.doSplitFlag = false;
    setTimeout(function() {
      window.doSplitFlag = true;
    }, 8e3);
    window.legendmod.sendAction(17);
  } else if (doFeed) {
    doFeed = false;
    window.legendmod.sendAction(21);
  }
}
function GeneralAvoiding(target2, PlayerCell) {
  if (window.DistanceX[PlayerCell.id] > 0) {
    target2.x = window.legendmod.mapMinX;
  } else {
    target2.x = window.legendmod.mapMaxX;
  }
  if (window.DistanceY[PlayerCell.id] > 0) {
    target2.y = window.legendmod.mapMinY;
  } else {
    target2.y = window.legendmod.mapMaxY;
  }
  return target2;
}
function DefineVirusshootCaseAndShoot(target2, doFeed, VirusCellDontDoTheRest) {
  if (window.FlagVirusCells.length > 0 && Object.keys(window.BadCellsDistanceName).length > 0) {
    for (let i = 0; i < window.FlagVirusCells.length; i++) {
      for (let j = 0; j < window.FlagDangerCells.length; j++) {
        let vId = window.FlagVirusCells[i];
        let dId = window.FlagDangerCells[j];
        if (Math.abs(window.VirusDistanceX[vId]) < 700 && Math.abs(window.VirusDistanceX[vId]) > 20 && Math.abs(window.BadCellsDistanceX[dId]) < 760) {
          if (window.application.lastSentClanTag != "" || !window.teammatenicks.includes(window.BadCellsDistanceName[dId])) {
            if (Math.abs(window.VirusDistanceX[vId]) < Math.abs(window.BadCellsDistanceX[dId]) && Math.abs(window.VirusDistanceY[vId]) < Math.abs(window.BadCellsDistanceY[dId])) {
              let vX = window.VirusDistanceX[vId];
              let vY = window.VirusDistanceY[vId];
              let dX = window.BadCellsDistanceX[dId];
              let dY = window.BadCellsDistanceY[dId];
              let name = window.BadCellsDistanceName[dId];
              let shoot = false;
              if (vX > 0 && dX > 0 && vY > 0 && dY > 0) shoot = true;
              else if (vX > 0 && dX < 0 && vY > 0 && dY < 0) shoot = true;
              else if (vX < 0 && dX > 0 && vY < 0 && dY > 0) shoot = true;
              else if (vX < 0 && dX < 0 && vY < 0 && dY < 0) shoot = true;
              if (shoot) {
                AnnounceBadCellShooting(vX, vY, name, dX, dY);
                target2.x = vX;
                target2.y = vY;
                doFeed = true;
                VirusCellDontDoTheRest = true;
                return { target2, doFeed, stop: VirusCellDontDoTheRest };
              }
            }
          }
        }
      }
    }
  }
  return null;
}
function DefineSandwichCellCase() {
  if (window.FlagDangerCells.length > 1) {
    for (let i = 1; i < window.FlagDangerCells.length; i++) {
      let prevId = window.FlagDangerCells[i - 1];
      let currId = window.FlagDangerCells[i];
      if (window.DangerDistanceX[prevId] > 0) {
        if (window.DangerDistanceY[prevId] > 0) {
          if (window.DangerDistanceX[currId] < 0 && window.DangerDistanceY[currId] < 0) {
            AnnounceDangerCellOpposite(
              window.DangerDistanceName[prevId],
              window.DangerDistanceName[currId]
            );
            window.SandwichCellCase = 0;
          }
        } else if (window.DangerDistanceY[prevId] < 0) {
          if (window.DangerDistanceX[currId] < 0 && window.DangerDistanceY[currId] > 0) {
            AnnounceDangerCellOpposite(
              window.DangerDistanceName[prevId],
              window.DangerDistanceName[currId]
            );
            window.SandwichCellCase = 1;
          }
        }
      } else if (window.DangerDistanceX[prevId] < 0) {
        if (window.DangerDistanceY[prevId] > 0) {
          if (window.DangerDistanceX[currId] > 0 && window.DangerDistanceY[currId] < 0) {
            AnnounceDangerCellOpposite(
              window.DangerDistanceName[prevId],
              window.DangerDistanceName[currId]
            );
            window.SandwichCellCase = 2;
          }
        } else if (window.DangerDistanceY[prevId] < 0) {
          if (window.DangerDistanceX[currId] > 0 && window.DangerDistanceY[currId] > 0) {
            AnnounceDangerCellOpposite(
              window.DangerDistanceName[prevId],
              window.DangerDistanceName[currId]
            );
            window.SandwichCellCase = 3;
          }
        }
      }
    }
  }
}
function handleSandwichCellCase(target2) {
  let closestX = 1e3;
  let closestY = 1e3;
  let negativeX = false;
  let negativeY = false;
  window.FlagDangerCells.forEach(function(key) {
    if (Math.abs(window.DangerDistanceX[key]) < closestX) {
      closestX = Math.abs(window.DangerDistanceX[key]);
      negativeX = window.DangerDistanceX[key] < 0;
    }
    if (Math.abs(window.DangerDistanceY[key]) < closestY) {
      closestY = Math.abs(window.DangerDistanceY[key]);
      negativeY = window.DangerDistanceY[key] < 0;
    }
  });
  if (negativeX) closestX = -closestX;
  if (negativeY) closestY = -closestY;
  if (Math.abs(-closestX) < Math.abs(-closestY)) {
    target2.x = -closestX;
    target2.y = closestY;
  } else {
    target2.x = closestX;
    target2.y = -closestY;
  }
  return target2;
}
function avoidCorners(biggercell, target2, PlayerCell, doSplittoAvoidCorner) {
  if (!biggercell || !PlayerCell) {
    return { target2, doSplit: doSplittoAvoidCorner };
  }
  if ((biggercell.x < window.legendmod.mapMinX + 760 || biggercell.y < window.legendmod.mapMinY + 760 || biggercell.x > window.legendmod.mapMaxX - 760 || biggercell.y > window.legendmod.mapMaxY - 760) && (PlayerCell.x < window.legendmod.mapMinX + 760 || PlayerCell.y < window.legendmod.mapMinY + 760 || PlayerCell.x > window.legendmod.mapMaxX - 760 || PlayerCell.y > window.legendmod.mapMaxY - 760)) {
    let defineCornercaseX = "";
    let defineCornercaseY = "";
    let distanceCornerX = 0;
    let distanceCornerY = 0;
    if (PlayerCell.x < window.legendmod.mapMinX + 760) {
      if (biggercell.y < PlayerCell.y) target2.y = window.legendmod.mapMinY;
      else target2.y = window.legendmod.mapMaxY;
      defineCornercaseX = "left";
      distanceCornerX = PlayerCell.x - window.legendmod.mapMinX;
      window.$("#pause-hud").html("Avoiding corners X- " + PlayerCell.x);
    }
    if (PlayerCell.y < window.legendmod.mapMinY + 760) {
      if (biggercell.x < PlayerCell.x) target2.x = window.legendmod.mapMinX;
      else target2.x = window.legendmod.mapMaxX;
      defineCornercaseY = "up";
      distanceCornerY = PlayerCell.y - window.legendmod.mapMinY;
      window.$("#pause-hud").html("Avoiding corners Y- " + PlayerCell.y);
    }
    if (PlayerCell.x > window.legendmod.mapMaxX - 760) {
      if (biggercell.y < PlayerCell.y) target2.y = window.legendmod.mapMinY;
      else target2.y = window.legendmod.mapMaxY;
      defineCornercaseX = "right";
      distanceCornerX = PlayerCell.x - window.legendmod.mapMinX;
      window.$("#pause-hud").html("Avoiding corners X+ " + PlayerCell.x);
    }
    if (PlayerCell.y > window.legendmod.mapMaxY - 760) {
      if (biggercell.x < PlayerCell.x) target2.x = window.legendmod.mapMinX;
      else target2.x = window.legendmod.mapMaxX;
      defineCornercaseY = "down";
      distanceCornerY = PlayerCell.y - window.legendmod.mapMinY;
      window.$("#pause-hud").html("Avoiding corners Y+ " + PlayerCell.x);
    }
    const isCloseEdge = PlayerCell.x < window.legendmod.mapMinX + 520 || PlayerCell.y < window.legendmod.mapMinY + 520 || PlayerCell.x > window.legendmod.mapMaxX - 520 || PlayerCell.y > window.legendmod.mapMaxY - 520;
    if (isCloseEdge) {
      if (defineCornercaseX == "left" && defineCornercaseY == "up") {
        if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) {
          target2.x = window.legendmod.mapMaxX;
        } else target2.y = window.legendmod.mapMaxY;
      } else if (defineCornercaseX == "left" && defineCornercaseY == "down") {
        if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) {
          target2.x = window.legendmod.mapMaxX;
        } else target2.y = window.legendmod.mapMinY;
      } else if (defineCornercaseX == "right" && defineCornercaseY == "up") {
        if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) {
          target2.x = window.legendmod.mapMaxX;
        } else target2.y = window.legendmod.mapMaxY;
      } else if (defineCornercaseX == "right" && defineCornercaseY == "down") {
        if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) {
          target2.x = window.legendmod.mapMinX;
        } else target2.y = window.legendmod.mapMinY;
      }
    }
    doSplittoAvoidCorner = true;
  }
  return { target2, doSplit: doSplittoAvoidCorner };
}
function calcDist(x, y) {
  return Math.round(
    Math.sqrt(
      Math.pow(window.legendmod.playerX - x, 2) + Math.pow(window.legendmod.playerY - y, 2)
    )
  );
}
function calcDistVirus(x, y, vx, vy) {
  return Math.round(Math.sqrt(Math.pow(vx - x, 2) + Math.pow(vy - y, 2)));
}
function AnnounceDangerCellOpposite(name1, name2) {
  window.$("#pause-hud").html(
    "<font color='red'>Danger: <font> " + name1 + " and " + name2 + " are diametral"
  );
}
function AnnounceBadCellShooting(vx, vy, name, x, y) {
  window.$("#pause-hud").html(
    "<font color='yellow'>Shooting: <font> " + name + "(" + parseInt(String(x)) + " , " + parseInt(String(y)) + ")from virus " + parseInt(String(vx)) + "," + parseInt(String(vy))
  );
}
