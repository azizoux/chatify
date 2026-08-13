// recupere le coord X d'une case
export const getX = (key, data) => {
  return data.pions.filter((p, index) => p.id === key)[0].abs;
};

// Recupere le coord Y d'une case
export const getY = (key, data) => {
  return data.pions.filter((p, index) => p.id === key)[0].ord;
};

// Renvoie le nom d'une case a partir de X et Y
export const getCaseName = (x, y, data) => {
  return data.pions.filter((p) => p.abs === x && p.ord === y)[0].id;
};

// Renvoi la liste des cases frontieres a une case donnee
export const getNearCases = (key, data) => {
  let pf = [];
  let x = getX(key, data);
  let y = getY(key, data);
  let x1 = x + 1;
  let x2 = x - 1;
  let y1 = y + 1;
  let y2 = y - 1;
  if (x1 >= 0 && x1 <= 5) {
    let key = getCaseName(x1, y, data);
    pf.push(key);
  }
  if (x2 >= 0 && x2 <= 5) {
    let key = getCaseName(x2, y, data);
    pf.push(key);
  }

  if (0 <= y1 && y1 <= 4) {
    let key = getCaseName(x, y1, data);
    pf.push(key);
  }

  if (0 <= y2 && y2 <= 4) {
    key = getCaseName(x, y2, data);
    pf.push(key);
  }
  return pf;
};

// Renvoi la liste des cases occupees
export const getFilledCases = (data) => {
  const filledCases = [];
  data.pions.forEach((p) => {
    if (p.ownerId !== 0) {
      filledCases.push(p.id);
    }
  });
  return filledCases;
};
// Test si une case est vide
export const isEmpty = (key, data) => {
  return getFilledCases(data).includes(key) ? false : true;
};
// Renvoi la liste des cases vide frontiere a une case donnee
export const getEmptyCases = (key, data) => {
  let result = [];
  let filledCases = getFilledCases(data);
  let nearCases = getNearCases(key, data);
  nearCases.forEach((nc) => {
    if (!filledCases.includes(nc)) {
      result.push(nc);
    }
  });
  return result;
};
// Retourne la liste des pions d'un player donnee
export const getPlayerPions = (playerId, data) => {
  const playerPions = [];
  data.pions
    .filter((p) => p.ownerId === playerId)
    .forEach((el) => {
      playerPions.push(el.id);
    });
  return playerPions;
};
// Function utils pour verifications des alignement

export const isAlignedY = (key, playerId, data) => {
  let x = getX(key, data);
  let y = getY(key, data);
  let current_pions = getPlayerPions(playerId, data);
  let x1 = x + 1;
  let x2 = x + 2;
  let x3 = x - 1;
  let x4 = x - 2;
  let pa = [];
  if (0 <= x1 && x1 <= 5) {
    let c = getCaseName(x1, y, data);
    if (current_pions.includes(c) === true) {
      pa.push(c);
      if (0 <= x2 && x2 <= 5) {
        let c = getCaseName(x2, y, data);
        if (current_pions.includes(c) === true) pa.push(c);
      }
    }
  }

  if (0 <= x3 && x3 <= 5) {
    key = getCaseName(x3, y, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 <= x4 && x4 <= 5) {
        key = getCaseName(x4, y, data);
        if (current_pions.includes(key) === true) pa.push(key);
      }
    }
  }
  if (pa.length >= 2) return true;
  return false;
};

export const isAlignedX = (key, playerId, data) => {
  let x = getX(key, data);
  let y = getY(key, data);
  let current_pions = getPlayerPions(playerId, data);
  let y1 = y + 1;
  let y2 = y + 2;
  let y3 = y - 1;
  let y4 = y - 2;
  let pa = [];
  if (0 <= y1 && y1 <= 4) {
    key = getCaseName(x, y1, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 < y2 && y2 <= 4) {
        key = getCaseName(x, y2, data);
        if (current_pions.includes(key) === true) pa.push(key);
      }
    }
  }

  if (0 <= y3 && y3 <= 4) {
    key = getCaseName(x, y3, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 <= y4 && y4 <= 4) {
        key = getCaseName(x, y4, data);
        if (current_pions.includes(key) === true) pa.push(key);
      }
    }
  }
  if (pa.length >= 2) return true;
  return false;
};

// Function determinant les alignement gagnant

export const isWinAlignedX = (key, playerId, data) => {
  let x = getX(key, data);
  let y = getY(key, data);
  let current_pions = getPlayerPions(playerId, data);
  let y1 = y + 1;
  let y2 = y + 2;
  let y3 = y + 3;
  let y4 = y - 1;
  let y5 = y - 2;
  let y6 = y - 3;
  let pa = [];
  if (0 <= y1 && y1 <= 4) {
    key = getCaseName(x, y1, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 < y2 && y2 <= 4) {
        key = getCaseName(x, y2, data);
        if (current_pions.includes(key) === true) {
          pa.push(key);
          if (0 < y3 && y3 <= 4) {
            let key = getCaseName(x, y3, data);
            if (current_pions.includes(key) === true) {
              pa.push(key);
            }
          }
        }
      }
    }
  }

  if (0 <= y4 && y4 <= 4) {
    key = getCaseName(x, y4, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 <= y5 && y5 <= 4) {
        key = getCaseName(x, y5, data);
        if (current_pions.includes(key) === true) {
          pa.push(key);
          if (0 <= y6 && y6 <= 4) {
            let key = getCaseName(x, y6, data);
            if (current_pions.includes(key) === true) {
              pa.push(key);
            }
          }
        }
      }
    }
  }
  if (pa.length === 2) return true;
  return false;
};

export const isWinAlignedY = (key, playerId, data) => {
  let x = getX(key, data);
  let y = getY(key, data);
  let current_pions = getPlayerPions(playerId, data);
  let x1 = x + 1;
  let x2 = x + 2;
  let x3 = x + 3;
  let x4 = x - 1;
  let x5 = x - 2;
  let x6 = x - 3;
  let pa = [];
  if (0 <= x1 && x1 <= 5) {
    let c = getCaseName(x1, y, data);
    if (current_pions.includes(c) === true) {
      pa.push(c);
      if (0 <= x2 && x2 <= 5) {
        let c = getCaseName(x2, y, data);
        if (current_pions.includes(c) === true) {
          pa.push(c);
          if (0 <= x3 && x3 <= 5) {
            let c = getCaseName(x3, y, data);
            if (current_pions.includes(c) === true) {
              pa.push(c);
            }
          }
        }
      }
    }
  }

  if (0 <= x4 && x4 <= 5) {
    let key = getCaseName(x4, y, data);
    if (current_pions.includes(key) === true) {
      pa.push(key);
      if (0 <= x5 && x5 <= 5) {
        let key = getCaseName(x5, y, data);
        if (current_pions.includes(key) === true) {
          pa.push(key);
          if (0 <= x6 && x6 <= 5) {
            let c = getCaseName(x6, y, data);
            if (current_pions.includes(c) === true) {
              pa.push(c);
            }
          }
        }
      }
    }
  }
  if (pa.length === 2) return true;
  return false;
};

// Function permettant de changer de tour
export const nextPlayer = (data) => {
  const playerTourId = data.party.tourId;
  data.party.tourId = data.users.find((u) => u.id !== playerTourId).id;
  return data;
};
// Verifie si la case est dans un alignement au moins trois case occupe
//par les pions du meme player
export const isAligned = (key, playerId, data) => {
  if (isAlignedX(key, playerId, data) || isAlignedY(key, playerId, data))
    return true;
  return false;
};

// Aligment gagnant
export const isWinAligned = (key, playerId, data) => {
  if (isAlignedX(key, playerId, data) && isAlignedY(key, playerId, data)) {
    if (
      !isWinAlignedX(key, playerId, data) ||
      !isWinAlignedY(key, playerId, data)
    )
      return false;
  }
  if (isWinAlignedX(key, playerId, data) || isWinAlignedY(key, playerId, data))
    return true;
  return false;
};

// Function permettant de recuperer l'utisateur de jouer.

export const getUserTour = (data) => {
  const tourId = data.party.tourId;
  const users = data.users;
  const user = users.find((user) => user.id === tourId);
  return user;
};

export const getUserNoTour = (data) => {
  const tourId = data.party.tourId;
  const users = data.users;
  const user = users.find((user) => user.id !== tourId);
  return user;
};

export const getAthenticatedUser = (data) => {
  const cureentUser = JSON.parse(localStorage.getItem("user"));
  if (cureentUser) return cureentUser;
  return false;
};
// Verifier si c'est le tour du courant user
export const isYourTour = (user, data) => {
  const tourId = data.party.tourId;
  if (user.id === tourId) return true;
  return false;
};

// function to verify if its titike
export const isTitike = (key, playerId, data) => {
  // console.log("key: ", key);
  // let pion = data.pions.find((p) => p.id === key);
  if (data.pions[key - 1].ownerId === 0) {
    return false;
  }
  if (isAlignedX(key, playerId, data) && isAlignedY(key, playerId, data)) {
    return false;
  }
  if (isWinAligned(key, playerId, data)) {
    let arrow = [];
    const nearCases = getNearCases(key, data);
    console.log("nearCases: ", nearCases);
    let current_pions = getPlayerPions(playerId, data);
    console.log("current_pions: ", current_pions);
    nearCases.forEach((p) => {
      if (current_pions.includes(p)) {
        arrow.push(p);
      }
    });
    if (arrow.length === 3) {
      // console.log("arrow: ", arrow);
      return true;
    }
  }
  return false;
};

// Le player perdant la partie reset pour une nouvelle partie
export const leftParty = (user, data) => {
  let currentUser = user;
  let secondUser = user.id === 1 ? data.users[1] : data.users[0];
  let points = 0;
  points = secondUser.score + 1;
  let pionNumber = getPlayerPions(secondUser, data).length;
  // console.log("pionNumber", pionNumber);
  if (pionNumber === 12 || data.party.isFilling === true) {
    points++;
  }
  secondUser.score = points;
  secondUser.winNumber++;
  data.party.tourNumber++;
  currentUser.lostNumber++;
  data.party.tourId = secondUser.id;
  data.party.isFilling = true;
  data.party.isMoving = false;
  data.party.isCuting = false;
  for (let i = 0; i < 30; i++) {
    data.pions[i].color = "gray";
    data.pions[i].ownerId = 0;
  }

  if (secondUser.score >= currentUser.gameLimit) {
    currentUser.gameLimit--;
    secondUser.score = 0;
    currentUser.score = 0;
  }
  if (currentUser.gameLimit === 0) {
    currentUser.gameLimit = 7;
    secondUser.gameLimit = 7;
    data.party.tourNumber = 1;
    console.log("Le joueur " + currentUser.username + " a un djidji !!!");
  }
  console.log("Le joueur " + currentUser.username + " a perdu !!!");
  return data;
};
